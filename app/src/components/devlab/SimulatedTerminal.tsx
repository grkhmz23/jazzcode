"use client";

import "@xterm/xterm/css/xterm.css";

import { useEffect, useMemo, useRef } from "react";
import { useDevLabStore } from "@/lib/devlab/store";

const PROMPT = "\u001b[32muser@solana-devlab\u001b[0m:\u001b[34m~/my-solana-project\u001b[0m$ ";

const BASE_COMMANDS = [
  "solana",
  "solana-keygen",
  "anchor",
  "spl-token",
  "cargo",
  "rustc",
  "node",
  "git",
  "ls",
  "cd",
  "cat",
  "pwd",
  "echo",
  "clear",
  "mkdir",
  "touch",
  "rm",
];

export function SimulatedTerminal() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<import("@xterm/xterm").Terminal | null>(null);
  const fitRef = useRef<import("@xterm/addon-fit").FitAddon | null>(null);
  const currentInput = useRef("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const executeCommand = useDevLabStore((state) => state.executeCommand);
  const commandHistory = useDevLabStore((state) => state.commandHistory);
  const instant = useDevLabStore((state) => state.terminalOutputInstant);
  const vfs = useDevLabStore((state) => state.vfs);

  const pathHints = useMemo(() => {
    const walk = (node: typeof vfs, prefix: string): string[] => {
      if (node.type === "file") return [prefix];
      return Object.values(node.children ?? {}).flatMap((child) => {
        const next = `${prefix}/${child.name}`.replace(/^\//, "");
        return [next, ...walk(child, next)];
      });
    };
    return walk(vfs, "");
  }, [vfs]);

  useEffect(() => {
    historyRef.current = commandHistory;
  }, [commandHistory]);

  useEffect(() => {
    let disposeResize: (() => void) | null = null;

    const boot = async () => {
      if (!elementRef.current) return;

      const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all([
        import("@xterm/xterm"),
        import("@xterm/addon-fit"),
        import("@xterm/addon-web-links"),
      ]);

      const term = new Terminal({
        theme: {
          background: "#1a1a1a",
          foreground: "#d4d4d4",
          cursor: "#aeafad",
          selectionBackground: "#264f78",
        },
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 13,
        cursorBlink: true,
      });

      const fit = new FitAddon();
      const links = new WebLinksAddon();
      term.loadAddon(fit);
      term.loadAddon(links);
      term.open(elementRef.current);
      fit.fit();

      terminalRef.current = term;
      fitRef.current = fit;

      term.writeln("\u001b[33mSolana DevLab terminal ready. Type a command to begin.\u001b[0m");
      term.write(PROMPT);

      const writeOutput = async (text: string, color: "green" | "red" | "yellow") => {
        const prefix = color === "green" ? "\u001b[32m" : color === "red" ? "\u001b[31m" : "\u001b[33m";
        const payload = `${prefix}${text}\u001b[0m`;
        if (instant) {
          term.writeln(payload);
          return;
        }
        for (const char of payload) {
          term.write(char);
          await new Promise((resolve) => setTimeout(resolve, 15));
        }
        term.write("\r\n");
      };

      term.onData(async (data) => {
        const code = data.charCodeAt(0);

        if (code === 3) {
          currentInput.current = "";
          term.write("^C\r\n");
          term.write(PROMPT);
          return;
        }

        if (code === 12) {
          term.clear();
          term.write(PROMPT + currentInput.current);
          return;
        }

        if (data === "\r") {
          const command = currentInput.current.trim();
          term.write("\r\n");
          if (!command) {
            term.write(PROMPT);
            return;
          }

          const result = executeCommand(command);
          if (result.clear) {
            term.clear();
          }
          if (result.stdout) {
            await writeOutput(result.stdout, "green");
          }
          if (result.stderr) {
            await writeOutput(result.stderr, "red");
          }
          currentInput.current = "";
          historyIndexRef.current = -1;
          term.write(PROMPT);
          return;
        }

        if (data === "\u007f") {
          if (currentInput.current.length > 0) {
            currentInput.current = currentInput.current.slice(0, -1);
            term.write("\b \b");
          }
          return;
        }

        if (data === "\u001b[A") {
          const history = historyRef.current;
          if (!history.length) return;
          historyIndexRef.current = Math.min(history.length - 1, historyIndexRef.current + 1);
          const next = history[history.length - 1 - historyIndexRef.current] ?? "";
          while (currentInput.current.length > 0) {
            term.write("\b \b");
            currentInput.current = currentInput.current.slice(0, -1);
          }
          currentInput.current = next;
          term.write(next);
          return;
        }

        if (data === "\u001b[B") {
          const history = historyRef.current;
          if (!history.length) return;
          historyIndexRef.current = Math.max(-1, historyIndexRef.current - 1);
          const next = historyIndexRef.current === -1 ? "" : history[history.length - 1 - historyIndexRef.current] ?? "";
          while (currentInput.current.length > 0) {
            term.write("\b \b");
            currentInput.current = currentInput.current.slice(0, -1);
          }
          currentInput.current = next;
          term.write(next);
          return;
        }

        if (data === "\t") {
          const input = currentInput.current;
          const prefix = input.split(" ").pop() ?? "";
          const candidates = [...BASE_COMMANDS, ...pathHints].filter((value) => value.startsWith(prefix));
          if (candidates.length === 1) {
            const completion = candidates[0].slice(prefix.length);
            currentInput.current += completion;
            term.write(completion);
          }
          return;
        }

        if (code >= 32) {
          currentInput.current += data;
          term.write(data);
        }
      });

      const resize = () => fit.fit();
      window.addEventListener("resize", resize);
      disposeResize = () => window.removeEventListener("resize", resize);
    };

    void boot();

    return () => {
      disposeResize?.();
      terminalRef.current?.dispose();
      terminalRef.current = null;
      fitRef.current = null;
    };
  }, [executeCommand, instant, pathHints]);

  return <div className="h-full w-full bg-[#1a1a1a] p-1" ref={elementRef} />;
}
