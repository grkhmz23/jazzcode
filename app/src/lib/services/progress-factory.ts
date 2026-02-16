import type { LearningProgressService } from "./progress";
import { PrismaLearningProgressService } from "./progress-local";

let progressServiceInstance: LearningProgressService | null = null;

/**
 * Get the singleton instance of LearningProgressService
 * Returns a Prisma-backed implementation
 */
export function getProgressService(): LearningProgressService {
  if (!progressServiceInstance) {
    progressServiceInstance = new PrismaLearningProgressService();
  }
  return progressServiceInstance;
}

/**
 * Reset the service singleton (useful for testing)
 */
export function resetProgressService(): void {
  progressServiceInstance = null;
}
