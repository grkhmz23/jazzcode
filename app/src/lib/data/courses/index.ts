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
import { defiSwapAggregatorCourse } from './defi-swap-aggregator';
import { defiClmmLiquidityCourse } from './defi-clmm-liquidity';
import { defiLendingRiskCourse } from './defi-lending-risk';
import { defiPerpsRiskConsoleCourse } from './defi-perps-risk-console';
import { defiTxOptimizerCourse } from './defi-tx-optimizer';
import { solanaMobileSigningCourse } from './solana-mobile-signing';
import { solanaPayCommerceCourse } from './solana-pay-commerce';
import { walletUxEngineeringCourse } from './wallet-ux-engineering';
import { signInWithSolanaCourse } from './sign-in-with-solana';
import { priorityFeesComputeBudgetCourse } from './priority-fees-compute-budget';
import { bundlesAtomicityCourse } from './bundles-atomicity';
import { mempoolUxDefenseCourse } from './mempool-ux-defense';
import { indexingWebhooksPipelinesCourse } from './indexing-webhooks-pipelines';
import { rpcReliabilityLatencyCourse } from './rpc-reliability-latency';
import { rustDataLayoutBorshCourse } from './rust-data-layout-borsh';
import { rustErrorsInvariantsCourse } from './rust-errors-invariants';
import { rustPerfOnchainThinkingCourse } from './rust-perf-onchain-thinking';
import { rustAsyncIndexerPipelineCourse } from './rust-async-indexer-pipeline';
import { rustProcMacrosCodegenSafetyCourse } from './rust-proc-macros-codegen-safety';
import { anchorUpgradesMigrationsCourse } from './anchor-upgrades-migrations';
import { solanaCourses10To18 } from './solana-courses-10-18';
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
  defiSwapAggregatorCourse,
  defiClmmLiquidityCourse,
  defiLendingRiskCourse,
  defiPerpsRiskConsoleCourse,
  defiTxOptimizerCourse,
  solanaMobileSigningCourse,
  solanaPayCommerceCourse,
  walletUxEngineeringCourse,
  signInWithSolanaCourse,
  priorityFeesComputeBudgetCourse,
  bundlesAtomicityCourse,
  mempoolUxDefenseCourse,
  indexingWebhooksPipelinesCourse,
  rpcReliabilityLatencyCourse,
  rustDataLayoutBorshCourse,
  rustErrorsInvariantsCourse,
  rustPerfOnchainThinkingCourse,
  rustAsyncIndexerPipelineCourse,
  rustProcMacrosCodegenSafetyCourse,
  anchorUpgradesMigrationsCourse,
  ...solanaCourses10To18,
];

if (courses.length !== 42) {
  throw new Error(`Expected 42 courses, received ${courses.length}`);
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
  defiSwapAggregatorCourse,
  defiClmmLiquidityCourse,
  defiLendingRiskCourse,
  defiPerpsRiskConsoleCourse,
  defiTxOptimizerCourse,
  solanaMobileSigningCourse,
  solanaPayCommerceCourse,
  walletUxEngineeringCourse,
  signInWithSolanaCourse,
  priorityFeesComputeBudgetCourse,
  bundlesAtomicityCourse,
  mempoolUxDefenseCourse,
  indexingWebhooksPipelinesCourse,
  rpcReliabilityLatencyCourse,
  rustDataLayoutBorshCourse,
  rustErrorsInvariantsCourse,
  rustPerfOnchainThinkingCourse,
  rustAsyncIndexerPipelineCourse,
  rustProcMacrosCodegenSafetyCourse,
  anchorUpgradesMigrationsCourse,
};
