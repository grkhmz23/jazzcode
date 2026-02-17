import { describe, expect, it } from "vitest";
import universeFixture from "@/lib/courses/defi-on-solana/project/fixtures/universe.v1.json";
import quoteVectorsFixture from "@/lib/courses/defi-on-solana/project/fixtures/quotes.v1.json";
import { toVirtualPool } from "@/lib/courses/defi-on-solana/project/model/pools";
import { cpmmQuote } from "@/lib/courses/defi-on-solana/project/quote/cpmm";

describe("defi cpmm quote", () => {
  it("matches fixture vectors exactly", () => {
    for (const vector of quoteVectorsFixture.vectors) {
      const pool = universeFixture.pools.find((item) => item.id === vector.poolId);
      expect(pool, `Missing pool ${vector.poolId}`).toBeDefined();

      const result = cpmmQuote(toVirtualPool(pool!), vector.inMint, vector.inAmount);

      expect(result.outAmount).toBe(vector.expected.outAmount);
      expect(result.feeAmount).toBe(vector.expected.feeAmount);
      expect(result.inAfterFee).toBe(vector.expected.inAfterFee);
      expect(result.impactBps).toBe(vector.expected.impactBps);
    }
  });

  it("is deterministic across repeated runs", () => {
    const pool = toVirtualPool(universeFixture.pools[0]);
    const first = cpmmQuote(pool, pool.tokenA, "2000000000");
    const second = cpmmQuote(pool, pool.tokenA, "2000000000");

    expect(first.outAmount).toBe(second.outAmount);
    expect(first.feeAmount).toBe(second.feeAmount);
    expect(first.impactBps).toBe(second.impactBps);
  });
});
