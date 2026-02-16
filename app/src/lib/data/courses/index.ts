import { solanaFundamentalsCourse } from './solana-fundamentals';
import { anchorDevelopmentCourse } from './anchor-development';
import { solanaFrontendCourse } from './solana-frontend';
import { defiSolanaCourse } from './defi-solana';
import { solanaSecurityCourse } from './solana-security';
import { tokenEngineeringCourse } from './token-engineering';
import { solanaMobileCourse } from './solana-mobile';
import { solanaTestingCourse } from './solana-testing';
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
  solanaSecurityCourse,
  tokenEngineeringCourse,
  solanaMobileCourse,
  solanaTestingCourse,
];

if (courses.length !== 8) {
  throw new Error(`Expected 8 courses, received ${courses.length}`);
}

/**
 * Export individual courses for direct access
 */
export {
  solanaFundamentalsCourse,
  anchorDevelopmentCourse,
  solanaFrontendCourse,
  defiSolanaCourse,
  solanaSecurityCourse,
  tokenEngineeringCourse,
  solanaMobileCourse,
  solanaTestingCourse,
};
