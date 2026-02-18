import { describe, expect, it } from "vitest";
import {
  generatedSafetyReport,
  generateChecks,
  parseAttributes,
  runGeneratedChecks,
} from "@/lib/courses/rust-proc-macros-codegen-safety/project/codegen";
import {
  createDefaultRustProcMacrosCodegenSafetyLocalState,
  migrateRustProcMacrosCodegenSafetyLocalState,
} from "@/lib/courses/rust-proc-macros-codegen-safety/local-state";

describe("rust proc macros codegen safety project", () => {
  it("parses attribute DSL and generates checks", () => {
    const ast = parseAttributes("signer(authority)\nowner(vault=VaultProgram)");
    expect(ast).toEqual([
      { kind: "signer", target: "authority" },
      { kind: "owner", target: "vault", expected: "VaultProgram" },
    ]);
    expect(generateChecks(ast)).toBe("require_signer(authority);\nrequire_owner(vault, VaultProgram);");
  });

  it("runs generated checks deterministically", () => {
    const result = runGeneratedChecks(parseAttributes("owner(vault=VaultProgram)"), {
      signers: ["authority"],
      owners: { vault: "SystemProgram" },
      relations: {},
      mutableAccounts: [],
    });
    expect(result.ok).toBe(false);
    expect(generatedSafetyReport(result)).toContain("# Generated Safety Report");
  });

  it("throws on invalid DSL", () => {
    expect(() => parseAttributes("invalid-line")).toThrow();
  });

  it("migrates local state", () => {
    const state = migrateRustProcMacrosCodegenSafetyLocalState({ completedLessonIds: ["a", "a"] });
    expect(state.version).toBe(2);
    expect(state.completedLessonIds).toEqual(["a"]);
    expect(createDefaultRustProcMacrosCodegenSafetyLocalState().lastGeneratedSafetyReport).toBeNull();
  });
});
