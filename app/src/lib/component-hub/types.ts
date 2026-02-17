/**
 * Component Hub Types
 * Registry system for Solana components
 */

export type ComponentCategory = 
  | "wallet" 
  | "tokens" 
  | "swap" 
  | "nfts" 
  | "dev-tools" 
  | "analytics";

export interface ComponentFile {
  path: string;
  content: string;
  language: "typescript" | "javascript" | "css" | "json";
}

export interface ComponentDependency {
  name: string;
  version: string;
  isDev?: boolean;
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: unknown;
  description: string;
}

export interface ComponentExample {
  name: string;
  description: string;
  code: string;
  props?: Record<string, unknown>;
}

export interface ComponentPermission {
  type: "wallet" | "rpc" | "devnet";
  required: boolean;
  description: string;
}

export interface ProductionNote {
  type: "error-handling" | "security" | "performance" | "accessibility";
  title: string;
  content: string;
}

export interface HubComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  longDescription?: string;
  thumbnail?: string;
  files: ComponentFile[];
  dependencies: ComponentDependency[];
  props: ComponentProp[];
  examples: ComponentExample[];
  permissions: ComponentPermission[];
  productionNotes: ProductionNote[];
  installCommand: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface ComponentBundle {
  component: HubComponent;
  demoFile?: ComponentFile;
  setupCommands?: string[];
}
