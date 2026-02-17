/**
 * Playground Integration
 * Generate Playground URLs for component demos
 */

import { HubComponent, ComponentFile } from "./types";

interface PlaygroundFiles {
  [path: string]: string;
}

/**
 * Generate demo page content for a component
 */
function generateDemoPage(component: HubComponent, props: Record<string, unknown>): string {
  const propString = Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === "boolean") return value ? key : `${key}={false}`;
      if (typeof value === "number") return `${key}={${value}}`;
      if (typeof value === "string") return `${key}="${value}"`;
      return "";
    })
    .filter(Boolean)
    .join(" ");

  const importName = component.name.replace(/\s+/g, "");

  return `import { ${importName} } from "./${importName}";

export default function Demo() {
  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold text-white">${component.name} Demo</h1>
        <${importName} ${propString} />
      </div>
    </div>
  );
}`;
}

/**
 * Generate package.json for the playground
 */
function generatePackageJson(component: HubComponent): string {
  const deps: Record<string, string> = {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    next: "^14.0.0",
  };

  component.dependencies.forEach((dep) => {
    deps[dep.name] = dep.version;
  });

  return JSON.stringify(
    {
      name: `${component.id}-demo`,
      version: "1.0.0",
      private: true,
      dependencies: deps,
    },
    null,
    2
  );
}

/**
 * Convert component files to playground format
 */
function componentToPlaygroundFiles(
  component: HubComponent,
  props: Record<string, unknown>
): PlaygroundFiles {
  const files: PlaygroundFiles = {};

  // Add component files
  component.files.forEach((file) => {
    files[file.path] = file.content;
  });

  // Add demo page
  files["page.tsx"] = generateDemoPage(component, props);

  // Add package.json for dependency info
  files["package.json"] = generatePackageJson(component);

  // Add README with setup instructions
  files["README.md"] = `# ${component.name}

${component.description}

## Setup

This demo requires the following environment:
- Wallet adapter setup
- RPC connection to devnet

## Dependencies

${component.dependencies.map((d) => `- ${d.name}@${d.version}`).join("\n")}

## Props

${component.props
  .map(
    (p) =>
      `- **${p.name}** (${p.type})${p.required ? " (required)" : ""}: ${p.description}`
  )
  .join("\n")}
`;

  return files;
}

/**
 * Serialize files to base64 for URL sharing
 */
function serializeFiles(files: PlaygroundFiles): string {
  const data = JSON.stringify(files);
  // Use encodeURIComponent and base64 for URL safety
  if (typeof window === "undefined") {
    // Server-side: use Buffer
    return Buffer.from(data).toString("base64url");
  }
  // Client-side: use btoa with proper encoding
  return btoa(unescape(encodeURIComponent(data)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Generate a playground URL for a component
 */
export function generatePlaygroundUrl(
  component: HubComponent,
  props: Record<string, unknown> = {}
): string {
  const files = componentToPlaygroundFiles(component, props);
  const serialized = serializeFiles(files);

  // Use the existing playground URL format
  // The playground should be able to deserialize the 'w' parameter
  return `/playground?w=${serialized}`;
}

/**
 * Generate install command for CLI
 */
export function generateInstallCommand(component: HubComponent): string {
  return `jazzcode add ${component.id}`;
}

/**
 * Generate npm install command for dependencies
 */
export function generateNpmInstallCommand(component: HubComponent): string {
  const deps = component.dependencies.map((d) => `${d.name}@${d.version}`).join(" ");
  return `npm install ${deps}`;
}

/**
 * Export component as a zip-ready structure
 */
export function exportComponentAsZip(
  component: HubComponent
): { filename: string; files: ComponentFile[] } {
  return {
    filename: `${component.id}-component.zip`,
    files: component.files,
  };
}

/**
 * Get component usage code snippet
 */
export function getUsageSnippet(component: HubComponent): string {
  const importName = component.name.replace(/\s+/g, "");
  const defaultProps = component.props
    .filter((p) => p.required)
    .map((p) => `  ${p.name}={/* ${p.type} */}`)
    .join("\n");

  return `import { ${importName} } from "@/components/solana/${importName}";

// Usage
<${importName}
${defaultProps}
/>`;
}
