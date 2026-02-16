import type { CourseContentService } from './content';
import { LocalContentService } from './content-local';

let contentServiceInstance: CourseContentService | null = null;

/**
 * Factory function to get the appropriate content service
 * Based on process.env.CONTENT_SOURCE environment variable
 * 
 * - "local" or undefined: Returns LocalContentService
 * - "sanity": Throws "Sanity integration not implemented yet" (Phase 7)
 * 
 * @returns CourseContentService instance
 */
export function getContentService(): CourseContentService {
  if (contentServiceInstance) {
    return contentServiceInstance;
  }

  const contentSource = process.env.CONTENT_SOURCE;

  switch (contentSource) {
    case 'sanity':
      throw new Error('Sanity integration not implemented yet');
    case 'local':
    case undefined:
    default:
      contentServiceInstance = new LocalContentService();
      return contentServiceInstance;
  }
}

/**
 * Reset the content service instance
 * Useful for testing
 */
export function resetContentService(): void {
  contentServiceInstance = null;
}
