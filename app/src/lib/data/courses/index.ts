import { solanaFundamentalsCourse } from './solana-fundamentals';
import { anchorDevelopmentCourse } from './anchor-development';
import { solanaFrontendCourse } from './solana-frontend';
import { defiSolanaCourse } from './defi-solana';
import { solanaSecurityCourse } from './solana-security';
import { tokenEngineeringCourse } from './token-engineering';
import { solanaMobileCourse } from './solana-mobile';
import { solanaTestingCourse } from './solana-testing';
import { solanaIndexingCourse } from './solana-indexing';
import { solanaPaymentsCourse } from './solana-payments';
import { solanaNftCompressionCourse } from './solana-nft-compression';
import { solanaGovernanceMultisigCourse } from './solana-governance-multisig';
import { solanaPerformanceCourse } from './solana-performance';
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
  solanaIndexingCourse,
  solanaPaymentsCourse,
  solanaNftCompressionCourse,
  solanaGovernanceMultisigCourse,
  solanaPerformanceCourse,
];

if (courses.length !== 13) {
  throw new Error(`Expected 13 courses, received ${courses.length}`);
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
  solanaIndexingCourse,
  solanaPaymentsCourse,
  solanaNftCompressionCourse,
  solanaGovernanceMultisigCourse,
  solanaPerformanceCourse,
};
