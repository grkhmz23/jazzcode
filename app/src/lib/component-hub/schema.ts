/**
 * Component Hub Schema Validation
 * Zod schemas for validating component bundles
 */

import { z } from "zod";

const MAX_BUNDLE_SIZE_BYTES = 200 * 1024; // 200KB
const MAX_FILES = 50;
const MAX_FILE_SIZE_BYTES = 50 * 1024; // 50KB per file

// Valid path regex - no .., no absolute paths, no control chars
const VALID_PATH_REGEX = /^[a-zA-Z0-9_\-\/\.]+$/;
const INVALID_PATH_PATTERNS = /\.\.|^\/|^\\\\|\\0/;

export const componentFileSchema = z.object({
  path: z
    .string()
    .min(1, "Path cannot be empty")
    .max(255, "Path too long")
    .regex(VALID_PATH_REGEX, "Path contains invalid characters")
    .refine(
      (path) => !INVALID_PATH_PATTERNS.test(path),
      "Path cannot contain .., absolute paths, or control characters"
    )
    .refine(
      (path) => !path.includes(".."),
      "Path cannot traverse directories (..)"
    ),
  content: z.string().max(MAX_FILE_SIZE_BYTES, `File exceeds ${MAX_FILE_SIZE_BYTES / 1024}KB limit`),
  language: z.enum(["typescript", "javascript", "css", "json"]),
});

export const componentDependencySchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  isDev: z.boolean().optional(),
});

export const componentPropSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean(),
  defaultValue: z.unknown().optional(),
  description: z.string(),
});

export const componentPermissionSchema = z.object({
  type: z.enum(["wallet", "rpc", "devnet"]),
  required: z.boolean(),
  description: z.string(),
});

export const componentBundleSchema = z.object({
  id: z.string().min(1).max(100).regex(/^[a-z0-9\-]+$/, "ID must be lowercase alphanumeric with hyphens"),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  files: z
    .array(componentFileSchema)
    .min(1, "Bundle must have at least one file")
    .max(MAX_FILES, `Bundle cannot exceed ${MAX_FILES} files`),
  dependencies: z.array(componentDependencySchema).default([]),
  props: z.array(componentPropSchema).default([]),
  permissions: z.array(componentPermissionSchema).default([]),
  defaultProps: z.record(z.unknown()).default({}),
  notes: z.string().max(5000).optional(),
});

export type ValidatedComponentBundle = z.infer<typeof componentBundleSchema>;
export type ValidatedComponentFile = z.infer<typeof componentFileSchema>;

/**
 * Validate a component bundle with full error details
 */
export function validateBundle(
  data: unknown
): { success: true; data: ValidatedComponentBundle } | { success: false; errors: string[] } {
  const result = componentBundleSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => `${err.path.join(".")}: ${err.message}`
    );
    return { success: false, errors };
  }

  // Additional size validation
  const totalSize = result.data.files.reduce(
    (sum, file) => sum + file.content.length,
    0
  );

  if (totalSize > MAX_BUNDLE_SIZE_BYTES) {
    return {
      success: false,
      errors: [
        `Bundle total size (${Math.round(totalSize / 1024)}KB) exceeds ${MAX_BUNDLE_SIZE_BYTES / 1024}KB limit`,
      ],
    };
  }

  return { success: true, data: result.data };
}

/**
 * Quick path validation for individual files
 */
export function isValidPath(path: string): boolean {
  if (!path || path.length > 255) return false;
  if (!VALID_PATH_REGEX.test(path)) return false;
  if (INVALID_PATH_PATTERNS.test(path)) return false;
  if (path.includes("..")) return false;
  return true;
}

/**
 * Sanitize a filename for safe storage
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9_\-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 100);
}
