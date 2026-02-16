import { solanaFundamentalsCourse } from './solana-fundamentals';
import { anchorDevelopmentCourse } from './anchor-development';
import { solanaFrontendCourse } from './solana-frontend';
import { defiSolanaCourse } from './defi-solana';
import type { Course } from '@/types/content';

/**
 * Array of all available courses
 * Add new courses here as they are created
 */
export const courses: Course[] = [
  solanaFundamentalsCourse,
  anchorDevelopmentCourse,
  solanaFrontendCourse,
  defiSolanaCourse,
];

/**
 * Export individual courses for direct access
 */
export { solanaFundamentalsCourse, anchorDevelopmentCourse, solanaFrontendCourse, defiSolanaCourse };
