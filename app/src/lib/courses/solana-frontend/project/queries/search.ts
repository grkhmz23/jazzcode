import type { DashboardTokenRow } from "../types";

export function searchBySymbol(rows: DashboardTokenRow[], query: string | undefined): DashboardTokenRow[] {
  if (!query || query.trim().length === 0) {
    return rows;
  }
  const normalized = query.trim().toLowerCase();
  return rows.filter((row) => row.symbol.toLowerCase().includes(normalized));
}
