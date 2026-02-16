"use client";

import { ReactNode, createContext, useContext, useCallback } from "react";
import type { AnalyticsEvent } from "@/types";

interface AnalyticsContextType {
  track: (event: AnalyticsEvent) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const track = useCallback((event: AnalyticsEvent) => {
    // Placeholder - would send to analytics service
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[Analytics]", event);
    }
  }, []);

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
}
