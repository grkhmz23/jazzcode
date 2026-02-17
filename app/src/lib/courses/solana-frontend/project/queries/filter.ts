import { getOwnerPortfolio } from "../model/selectors";
import { searchBySymbol } from "./search";
import { sortRows } from "./sort";
import type {
  DashboardHistoryItem,
  DashboardQuery,
  DashboardState,
  DashboardTokenRow,
  DashboardViewModel,
} from "../types";

function latestTsForMint(history: DashboardHistoryItem[], mint: string): number {
  let latest = 0;
  for (const item of history) {
    if (item.summary.includes(mint) && item.ts > latest) {
      latest = item.ts;
    }
  }
  return latest;
}

function filterNonZero(rows: DashboardTokenRow[], enabled: boolean | undefined): DashboardTokenRow[] {
  if (!enabled) {
    return rows;
  }
  return rows.filter((row) => BigInt(row.amount) > BigInt(0));
}

export function buildDashboardView(
  state: DashboardState,
  owner: string,
  query: DashboardQuery,
): DashboardViewModel {
  const portfolio = getOwnerPortfolio(state, owner);
  const rows: DashboardTokenRow[] = portfolio.tokens.map((token) => ({
    mint: token.mint,
    symbol: token.symbol,
    amount: token.amount,
    valueUsd: token.valueUsd,
    recentTs: latestTsForMint(state.history, token.mint),
  }));

  const afterFilter = filterNonZero(rows, query.nonZeroOnly);
  const afterSearch = searchBySymbol(afterFilter, query.search);
  const sorted = sortRows(afterSearch, query.sortBy ?? "valueUsd", query.descending ?? true);

  return {
    owner,
    totalValueUsd: portfolio.totalValueUsd,
    rows: sorted,
  };
}
