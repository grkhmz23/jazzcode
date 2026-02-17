import { decimalToScaled } from "../model/selectors";
import type { DashboardTokenRow, SortField } from "../types";

export function sortRows(
  rows: DashboardTokenRow[],
  sortBy: SortField,
  descending = true,
): DashboardTokenRow[] {
  const direction = descending ? -1 : 1;
  return [...rows].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "balance") {
      const diff = BigInt(a.amount) - BigInt(b.amount);
      cmp = diff === BigInt(0) ? 0 : diff > BigInt(0) ? 1 : -1;
    } else if (sortBy === "valueUsd") {
      const diff = decimalToScaled(a.valueUsd) - decimalToScaled(b.valueUsd);
      cmp = diff === BigInt(0) ? 0 : diff > BigInt(0) ? 1 : -1;
    } else {
      cmp = a.recentTs - b.recentTs;
    }

    if (cmp !== 0) {
      return cmp * direction;
    }
    return a.mint.localeCompare(b.mint);
  });
}
