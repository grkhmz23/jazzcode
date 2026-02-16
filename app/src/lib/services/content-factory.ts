import type { CourseContentService } from './content';
import { ContentLocalService } from './content-local';

let contentServiceSingleton: CourseContentService | null = null;

export function getContentService(): CourseContentService {
  if (contentServiceSingleton) {
    return contentServiceSingleton;
  }

  const contentSource = process.env.CONTENT_SOURCE;

  switch (contentSource) {
    case 'local':
    case undefined:
    default:
      contentServiceSingleton = new ContentLocalService();
      return contentServiceSingleton;
  }
}

export function resetContentService(): void {
  contentServiceSingleton = null;
}
