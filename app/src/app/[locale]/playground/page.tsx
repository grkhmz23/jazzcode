"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Play,
  Share2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Eye,
  Info,
  CheckCircle2,
  Save,
} from "lucide-react";
import { CodeEditor, CodeEditorHandle } from "@/components/editor/CodeEditor";
import { playgroundTemplates, getTemplateById } from "@/lib/data/playground-templates";
import { cn } from "@/lib/utils";

// Sandbox run function for playground (simulated execution)
interface RunResult {
  success: boolean;
  output: string;
  error: string | null;
}

/**
 * Sandbox runner for playground code - simulates execution with Solana-like APIs
 */
async function runPlaygroundCode(code: string): Promise<RunResult> {
  const logs: string[] = [];
  const mockConsole = {
    log: (...args: unknown[]) => logs.push(args.map((a) => String(a)).join(" ")),
    error: (...args: unknown[]) =>
      logs.push("[ERROR] " + args.map((a) => String(a)).join(" ")),
    warn: (...args: unknown[]) =>
      logs.push("[WARN] " + args.map((a) => String(a)).join(" ")),
  };

  try {
    // Create Solana Web3.js test module
    const mockPublicKey = class MockPublicKey {
      _value: string;
      constructor(value: string) {
        this._value = value;
        this.toBase58 = () => value;
        this.toBuffer = () => Buffer.from(value);
      }
      toBase58: () => string;
      toBuffer: () => Buffer;
    };

    const mockConnection = class MockConnection {
      constructor() {}
      async getBalance(pubkey: { toBase58: () => string }) {
        // Return simulated balance for the given pubkey
        void pubkey.toBase58(); // Acknowledge parameter
        return 1_500_000_000; // 1.5 SOL in lamports
      }
      async getTokenAccountsByOwner() {
        return {
          value: [
            { pubkey: { toBase58: () => "TokenAccount1111111111111111111111" } },
            { pubkey: { toBase58: () => "TokenAccount2222222222222222222222" } },
          ],
        };
      }
    };

    const mockWeb3 = {
      PublicKey: mockPublicKey,
      Connection: mockConnection,
      LAMPORTS_PER_SOL: 1_000_000_000,
    };

    const mockSplToken = {
      TOKEN_PROGRAM_ID: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    };

    // Create a function with mocked require
    const userFn = new Function(
      "require",
      "console",
      `
        ${code}
      `
    );

    const mockRequire = (module: string) => {
      if (module === "@solana/web3.js") return mockWeb3;
      if (module === "@solana/spl-token") return mockSplToken;
      throw new Error(`Module not found: ${module}`);
    };

    userFn(mockRequire, mockConsole);

    return {
      success: true,
      output: logs.join("\n"),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      output: logs.join("\n"),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Compress code for URL sharing (base64)
 */
function compressCode(code: string): string {
  try {
    return btoa(unescape(encodeURIComponent(code)));
  } catch {
    return "";
  }
}

/**
 * Decompress code from URL
 */
function decompressCode(compressed: string): string {
  try {
    return decodeURIComponent(escape(atob(compressed)));
  } catch {
    return "";
  }
}

// Inner component that uses useSearchParams
function PlaygroundContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const editorRef = useRef<CodeEditorHandle>(null);
  const t = useTranslations("playground");
  const tc = useTranslations("common");

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("output");
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<RunResult | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Load initial code from URL params or default template
  useEffect(() => {
    const templateId = searchParams.get("template");
    const compressedCode = searchParams.get("code");

    if (compressedCode) {
      const decoded = decompressCode(compressedCode);
      if (decoded) {
        setCode(decoded);
        setCurrentTemplate(null);
        return;
      }
    }

    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setCode(template.code);
        setCurrentTemplate(templateId);
        return;
      }
    }

    // Default to first template
    setCode(playgroundTemplates[0].code);
    setCurrentTemplate(playgroundTemplates[0].id);
  }, [searchParams]);

  // Show toast helper
  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Load template
  const loadTemplate = useCallback(
    (templateId: string) => {
      const template = getTemplateById(templateId);
      if (template) {
        setCode(template.code);
        setCurrentTemplate(templateId);
        setOutput(null);
        // Update URL
        router.push(`/playground?template=${templateId}`);
      }
    },
    [router]
  );

  // Run code
  const handleRun = useCallback(async () => {
    const currentCode = editorRef.current?.getValue() ?? code;
    setIsRunning(true);
    setOutput(null);
    setActiveTab("output");

    const result = await runPlaygroundCode(currentCode);
    setOutput(result);
    setIsRunning(false);
  }, [code]);

  // Share code
  const handleShare = useCallback(() => {
    const currentCode = editorRef.current?.getValue() ?? code;
    const compressed = compressCode(currentCode);

    if (!compressed || compressed.length > 4000) {
      showToast(t("shareError"), "error");
      return;
    }

    const url = `${window.location.origin}/playground?code=${compressed}`;
    navigator.clipboard.writeText(url);
    showToast(t("shareSuccess"));
  }, [code, showToast, t]);

  // Clear code
  const handleClear = useCallback(() => {
    setCode("");
    setCurrentTemplate(null);
    setOutput(null);
    router.push("/playground");
  }, [router]);

  // Get current template name
  const currentTemplateName = currentTemplate
    ? getTemplateById(currentTemplate)?.name ?? "Custom"
    : "Custom";

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
      {/* Info Banner */}
      <div className="flex items-center gap-2 border-b bg-blue-50/50 px-4 py-2 text-xs text-blue-700">
        <Info className="h-4 w-4" />
        <span>{t("sandboxNotice")}</span>
      </div>

      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="gap-1"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {t("templates")}
          </Button>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">
            {currentTemplateName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  {tc("share")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("share")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  {tc("clear")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("clear")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            onClick={handleRun}
            disabled={isRunning}
            className="gap-1 bg-green-600 hover:bg-green-700"
            size="sm"
          >
            {isRunning ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t("running")}
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {tc("run")}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Templates */}
        {sidebarOpen && (
          <div className="flex w-64 flex-col border-r bg-muted/30">
            <div className="border-b p-3">
              <h3 className="text-sm font-medium">{t("templates")}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {playgroundTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template.id)}
                    className={cn(
                      "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                      currentTemplate === template.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs opacity-80">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t p-3">
              <h3 className="mb-2 text-sm font-medium">{t("yourDemos")}</h3>
              {session ? (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  <Save className="mx-auto mb-2 h-5 w-5" />
                  {t("saveFeature")}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  {t("signInToSave")}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center - Editor */}
        <div className="flex flex-1 flex-col">
          <CodeEditor
            ref={editorRef}
            language="typescript"
            defaultValue={code}
            value={code}
            onChange={setCode}
            height="100%"
          />
        </div>

        {/* Right Panel - Output */}
        {rightPanelOpen && (
          <div className="flex w-80 flex-col border-l bg-muted/30">
            <div className="flex items-center justify-between border-b p-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="output" className="gap-1">
                    <Terminal className="h-4 w-4" />
                    {t("output")}
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="gap-1">
                    <Eye className="h-4 w-4" />
                    {t("preview")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightPanelOpen(false)}
                className="ml-2 h-6 w-6 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} className="h-full">
                <TabsContent value="output" className="mt-0 h-full">
                  {output ? (
                    <div className="h-full overflow-auto p-3">
                      {output.error && (
                        <div className="mb-3 rounded-md bg-red-500/10 p-3 text-sm text-red-600">
                          {output.error}
                        </div>
                      )}
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {output.output}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-4 text-center text-sm text-muted-foreground">
                      <Terminal className="mb-2 h-8 w-8 opacity-30" />
                      <p>{t("noOutput")}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="mt-0 h-full">
                  <div className="flex h-full flex-col items-center justify-center p-4 text-center text-sm text-muted-foreground">
                    <Eye className="mb-2 h-8 w-8 opacity-30" />
                    <p>{t("preview")}</p>
                    <p className="text-xs">{t("saveFeature")}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Toggle right panel when closed */}
        {!rightPanelOpen && (
          <button
            onClick={() => setRightPanelOpen(true)}
            className="flex h-full w-6 items-center justify-center border-l bg-muted/30 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg",
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            )}
          >
            {toast.type === "success" && <CheckCircle2 className="h-4 w-4" />}
            <span className="text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Main page component with Suspense boundary
export default function PlaygroundPage() {
  const t = useTranslations("playground");
  
  return (
    <Suspense fallback={
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    }>
      <PlaygroundContent />
    </Suspense>
  );
}
