import { z, ZodError, ZodSchema } from "zod";
import { Errors } from "./errors";

/**
 * Format ZodError into a Record<string, string[]> for API responses
 */
export function formatZodError(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }
  
  return formatted;
}

/**
 * Validate data against a Zod schema
 * Returns the parsed data or throws an ApiError
 */
export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const details = formatZodError(result.error);
    throw Errors.validation("Validation failed", details);
  }
  
  return result.data;
}

/**
 * Validate query parameters from URLSearchParams
 */
export function validateQuery<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  searchParams: URLSearchParams
): z.infer<z.ZodObject<T>> {
  // Convert URLSearchParams to plain object
  const data: Record<string, unknown> = {};
  
  for (const key of Object.keys(schema.shape)) {
    const value = searchParams.get(key);
    if (value !== null) {
      // Try to parse as number if the schema expects it
      const shape = schema.shape[key];
      if (shape instanceof z.ZodNumber) {
        const num = Number(value);
        data[key] = isNaN(num) ? value : num;
      } else if (shape instanceof z.ZodBoolean) {
        data[key] = value === "true" || value === "1";
      } else {
        data[key] = value;
      }
    }
  }
  
  return validate(schema, data);
}

/**
 * Common validation schemas
 */
export const Schemas = {
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
  
  // Wallet address (Solana base58)
  walletAddress: z.string()
    .min(32, "Wallet address too short")
    .max(44, "Wallet address too long")
    .regex(/^[1-9A-HJ-NP-Za-km-z]+$/, "Invalid wallet address format"),
  
  // Timeframe for leaderboards
  timeframe: z.enum(["weekly", "monthly", "alltime"]).optional().default("alltime"),
  
  // MongoDB/ObjectId style ID
  objectId: z.string().regex(/^[a-f0-9]{24}$/, "Invalid ID format"),
  
  // UUID
  uuid: z.string().uuid("Invalid UUID format"),
  
  // Locale
  locale: z.enum(["en", "pt-BR", "es"]),
  
  // Course slug
  slug: z.string()
    .min(1, "Slug is required")
    .max(100, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
};

/**
 * Type inference helpers
 */
export type PaginationParams = z.infer<typeof Schemas.pagination>;
