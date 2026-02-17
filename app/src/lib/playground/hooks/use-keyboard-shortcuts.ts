import { useEffect } from "react";

export interface KeyboardShortcutHandlers {
  save?: () => void;
  quickOpen?: () => void;
  focusTerminal?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Ctrl/Cmd+S → save
      if (isCtrlOrCmd && event.key === "s") {
        event.preventDefault();
        handlers.save?.();
        return;
      }

      // Ctrl+P → quick file open
      if (event.ctrlKey && event.key === "p") {
        event.preventDefault();
        handlers.quickOpen?.();
        return;
      }

      // Ctrl+` → focus terminal
      if (event.ctrlKey && event.key === "`") {
        event.preventDefault();
        handlers.focusTerminal?.();
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}
