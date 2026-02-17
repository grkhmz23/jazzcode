import { describe, expect, it } from "vitest";
import universeFixture from "@/lib/courses/defi-on-solana/project/fixtures/universe.v1.json";
import routesFixture from "@/lib/courses/defi-on-solana/project/fixtures/routes.v1.json";
import { enumerateRoutes } from "@/lib/courses/defi-on-solana/project/router/enumerate";
import { pickBestRoute } from "@/lib/courses/defi-on-solana/project/router/best";

describe("defi router", () => {
  it("enumerates one-hop and two-hop routes and 2-hop can beat 1-hop", () => {
    const scenario = routesFixture.scenarios[0];
    const routes = enumerateRoutes(universeFixture, scenario.inMint, scenario.outMint);
    expect(routes.some((route) => route.hops.length === 1)).toBe(true);
    expect(routes.some((route) => route.hops.length === 2)).toBe(true);

    const best = pickBestRoute({
      universe: universeFixture,
      routes,
      inAmount: scenario.inAmount,
      mode: "bestOut",
    });

    expect(best.route.id).toBe(scenario.expectedBestRouteId);
    expect(best.route.hops.length).toBe(scenario.expectedPathLength);
  });

  it("uses stable tie-breakers", () => {
    const routes = [
      {
        id: "b-route",
        hops: [
          {
            poolId: "pool-sol-jup",
            inMint: "So11111111111111111111111111111111111111112",
            outMint: "JUP1111111111111111111111111111111111111111",
          },
        ],
      },
      {
        id: "a-route",
        hops: [
          {
            poolId: "pool-sol-jup",
            inMint: "So11111111111111111111111111111111111111112",
            outMint: "JUP1111111111111111111111111111111111111111",
          },
        ],
      },
    ];

    const best = pickBestRoute({
      universe: universeFixture,
      routes,
      inAmount: "1000000000",
      mode: "bestOut",
    });

    expect(best.route.id).toBe("a-route");
  });

  it("returns structured error for impossible route/pool", () => {
    expect(() =>
      pickBestRoute({
        universe: universeFixture,
        routes: [
          {
            id: "bad-route",
            hops: [{ poolId: "missing-pool", inMint: "SOL", outMint: "USDC" }],
          },
        ],
        inAmount: "1000",
        mode: "bestOut",
      }),
    ).toThrow("Missing pool for hop");
  });
});
