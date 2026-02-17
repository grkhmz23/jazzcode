/**
 * Component Hub Registry Tests
 * Validates that all registered components conform to the schema
 */

import { describe, it, expect } from "vitest";
import { componentRegistry, getComponentById, getFeaturedComponents, getComponentsByCategory } from "@/lib/component-hub/registry";
import { validateBundle } from "@/lib/component-hub/schema";

describe("Component Hub Registry", () => {
  describe("registry integrity", () => {
    it("should have unique component IDs", () => {
      const ids = componentRegistry.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have all required fields for each component", () => {
      for (const component of componentRegistry) {
        expect(component.id).toBeDefined();
        expect(component.name).toBeDefined();
        expect(component.category).toBeDefined();
        expect(component.description).toBeDefined();
        expect(component.files).toBeDefined();
        expect(component.files.length).toBeGreaterThan(0);
        expect(component.dependencies).toBeDefined();
        expect(component.props).toBeDefined();
        expect(component.permissions).toBeDefined();
      }
    });

    it("should have valid file paths for all components", () => {
      for (const component of componentRegistry) {
        for (const file of component.files) {
          expect(file.path).toBeDefined();
          expect(file.path.length).toBeGreaterThan(0);
          expect(file.content).toBeDefined();
          expect(file.language).toBeDefined();
        }
      }
    });
  });

  describe("schema compliance", () => {
    it("should validate all components against bundle schema", () => {
      for (const component of componentRegistry) {
        const bundle = {
          id: component.id,
          title: component.name,
          description: component.description,
          files: component.files,
          dependencies: component.dependencies,
          props: component.props,
          permissions: component.permissions,
          defaultProps: {},
          notes: component.productionNotes?.map(n => `${n.title}: ${n.content}`).join("\n"),
        };

        const result = validateBundle(bundle);
        expect(result.success).toBe(true);
      }
    });
  });

  describe("helper functions", () => {
    it("getComponentById should return correct component", () => {
      const component = getComponentById("wallet-connect-button-pro");
      expect(component).toBeDefined();
      expect(component?.name).toBe("WalletConnectButton Pro");
    });

    it("getComponentById should return undefined for invalid ID", () => {
      const component = getComponentById("non-existent-id");
      expect(component).toBeUndefined();
    });

    it("getFeaturedComponents should return only featured", () => {
      const featured = getFeaturedComponents();
      expect(featured.length).toBeGreaterThan(0);
      for (const component of featured) {
        expect(component.isFeatured).toBe(true);
      }
    });

    it("getComponentsByCategory should filter correctly", () => {
      const walletComponents = getComponentsByCategory("wallet");
      expect(walletComponents.length).toBeGreaterThan(0);
      for (const component of walletComponents) {
        expect(component.category).toBe("wallet");
      }
    });
  });

  describe("component structure", () => {
    it("should have TypeScript files as primary language", () => {
      for (const component of componentRegistry) {
        const hasTsx = component.files.some((f) => f.path.endsWith(".tsx"));
        const hasTs = component.files.some((f) => f.path.endsWith(".ts"));
        expect(hasTsx || hasTs).toBe(true);
      }
    });

    it("should have valid dependency formats", () => {
      for (const component of componentRegistry) {
        for (const dep of component.dependencies) {
          expect(dep.name).toBeDefined();
          expect(dep.name.length).toBeGreaterThan(0);
          expect(dep.version).toBeDefined();
          expect(dep.version.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
