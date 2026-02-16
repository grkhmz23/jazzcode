"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTheme } from "next-themes";
import type { editor } from "monaco-editor";

// Lazy load Monaco to avoid SSR issues
import dynamic from "next/dynamic";
import { EditorLoading } from "./EditorLoading";

// Dynamically import Monaco Editor with SSR disabled
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
);

export interface CodeEditorHandle {
  getValue(): string;
  setValue(value: string): void;
  focus(): void;
}

interface CodeEditorProps {
  language: "typescript" | "rust" | "json" | "javascript";
  defaultValue: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  theme?: "vs-dark" | "light";
  fontSize?: number;
  lineNumbers?: boolean;
  minimap?: boolean;
  wordWrap?: boolean;
}

/**
 * CodeEditor - A reusable Monaco editor wrapper component
 *
 * Features:
 * - Lazy loaded (no SSR)
 * - Theme detection from next-themes
 * - Debounced onChange (300ms)
 * - Imperative handle for getValue/setValue/focus
 */
export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  function CodeEditor(
    {
      language,
      defaultValue,
      value,
      onChange,
      readOnly = false,
      height = "100%",
      theme: propTheme,
      fontSize = 14,
      lineNumbers = true,
      minimap = false,
      wordWrap = true,
    },
    ref
  ) {
    const { theme: appTheme } = useTheme();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const [mounted, setMounted] = useState(false);

    // Debounce timer ref
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Determine Monaco theme based on app theme or prop
    const monacoTheme = propTheme ?? (appTheme === "dark" ? "vs-dark" : "light");

    // Handle hydration - only render on client
    useEffect(() => {
      setMounted(true);
    }, []);

    // Expose imperative handle
    useImperativeHandle(
      ref,
      () => ({
        getValue: () => editorRef.current?.getValue() ?? "",
        setValue: (newValue: string) => {
          editorRef.current?.setValue(newValue);
        },
        focus: () => {
          editorRef.current?.focus();
        },
      }),
      []
    );

    // Handle editor mount
    const handleEditorDidMount = useCallback(
      (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
      },
      []
    );

    // Debounced onChange handler
    const handleChange = useCallback(
      (newValue: string | undefined) => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          onChange?.(newValue ?? "");
        }, 300);
      },
      [onChange]
    );

    // Cleanup debounce timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    // Monaco editor options
    const options: editor.IStandaloneEditorConstructionOptions = {
      minimap: { enabled: minimap },
      scrollBeyondLastLine: false,
      fontSize,
      lineNumbers: lineNumbers ? "on" : "off",
      wordWrap: wordWrap ? "on" : "off",
      automaticLayout: true,
      tabSize: 2,
      renderLineHighlight: "line",
      cursorBlinking: "smooth",
      padding: { top: 16 },
      readOnly,
      // Additional options for better UX
      folding: true,
      lineHeight: 1.5,
      renderWhitespace: "selection",
      quickSuggestions: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: "on",
      // Rounding and appearance
      roundedSelection: true,
      // Hide unnecessary UI elements
      overviewRulerLanes: 0,
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      // Scrollbar styling
      scrollbar: {
        useShadows: false,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        vertical: "auto",
        horizontal: "auto",
      },
    };

    // Don't render during SSR
    if (!mounted) {
      return <EditorLoading height={height} />;
    }

    return (
      <div className="relative h-full w-full overflow-hidden rounded-md border">
        <MonacoEditor
          height={height}
          language={language}
          defaultValue={defaultValue}
          value={value}
          theme={monacoTheme}
          options={options}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          loading={<EditorLoading height={height} />}
        />
      </div>
    );
  }
);
