import type { PublicKey } from "@solana/web3.js";

// ============================================================================
// Course & Content Types
// ============================================================================

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type LessonType = "content" | "challenge";
export type Language = "en" | "pt-BR" | "es";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: Difficulty;
  durationMinutes: number;
  totalXP: number;
  trackId: string;
  tags: string[];
  modules: Module[];
  instructorName: string;
  instructorAvatar: string;
  enrolledCount: number;
  publishedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  order: number;
  xpReward: number;
  durationMinutes: number;
  content: string;
  challenge?: ChallengeDefinition;
}

export interface ChallengeDefinition {
  language: "typescript" | "rust" | "json";
  instructions: string;
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  hints: string[];
  timeoutMs: number;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

// ============================================================================
// Progress & Gamification Types
// ============================================================================

export interface Progress {
  courseId: string;
  completedLessons: number[];
  totalLessons: number;
  percentComplete: number;
  lastAccessedAt: string;
  currentModuleIndex: number;
  currentLessonIndex: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakCalendar: Record<string, boolean>;
}

export interface Achievement {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: "progress" | "streak" | "skill" | "community" | "special";
  unlockedAt: string | null;
}

export interface XPEvent {
  id: string;
  amount: number;
  reason: string;
  courseId: string | null;
  lessonId: string | null;
  createdAt: string;
}

// ============================================================================
// Leaderboard Types
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  username: string | null;
  avatarUrl: string | null;
  xp: number;
  level: number;
  streak: number;
}

export type LeaderboardTimeframe = "weekly" | "monthly" | "alltime";

// ============================================================================
// Credential / Certificate Types
// ============================================================================

export interface Credential {
  mintAddress: string;
  trackId: string;
  trackName: string;
  level: number;
  imageUri: string;
  metadataUri: string;
  acquiredAt: string;
  verificationUrl: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  recipientName: string;
  recipientWallet: string;
  completedAt: string;
  credentialMint: string | null;
  xpEarned: number;
  verificationUrl: string;
}

// ============================================================================
// User & Auth Types
// ============================================================================

export interface UserProfile {
  id: string;
  username: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  primaryWallet: string | null;
  linkedWallets: string[];
  linkedProviders: string[];
  joinedAt: string;
  isPublic: boolean;
  socialLinks: SocialLinks;
  skills: SkillRadarData;
}

export interface SocialLinks {
  twitter: string | null;
  github: string | null;
  discord: string | null;
  website: string | null;
}

export interface SkillRadarData {
  rust: number;
  anchor: number;
  frontend: number;
  security: number;
  defi: number;
  nft: number;
}

// ============================================================================
// Challenge Runner Types
// ============================================================================

export interface ChallengeRunResult {
  success: boolean;
  testResults: TestResult[];
  output: string;
  error: string | null;
  executionTimeMs: number;
}

export interface TestResult {
  testId: string;
  testName: string;
  passed: boolean;
  actual: string;
  expected: string;
  error: string | null;
}

// ============================================================================
// Analytics Event Types
// ============================================================================

export type AnalyticsEvent =
  | { name: "page_view"; properties: { path: string; locale: string } }
  | { name: "course_view"; properties: { courseId: string; slug: string } }
  | { name: "lesson_start"; properties: { courseId: string; lessonId: string } }
  | { name: "lesson_complete"; properties: { courseId: string; lessonId: string; xpEarned: number } }
  | { name: "challenge_run"; properties: { courseId: string; lessonId: string; passed: boolean } }
  | { name: "course_enroll"; properties: { courseId: string } }
  | { name: "wallet_connect"; properties: { provider: string } }
  | { name: "auth_signin"; properties: { method: string } }
  | { name: "achievement_unlock"; properties: { achievementId: number; slug: string } };

// ============================================================================
// Service Error Types
// ============================================================================

export class NotImplementedError extends Error {
  constructor(method: string) {
    super(`${method} is not yet implemented. This write-path requires on-chain program integration.`);
    this.name = "NotImplementedError";
  }
}

export class OnChainReadError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "OnChainReadError";
  }
}

// ============================================================================
// Utility Types
// ============================================================================

export function deriveLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100));
}

export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel + 1, 2) * 100;
}

export function xpProgressInLevel(xp: number): { current: number; required: number; percent: number } {
  const level = deriveLevel(xp);
  const currentLevelXP = Math.pow(level, 2) * 100;
  const nextLevelXP = Math.pow(level + 1, 2) * 100;
  const current = xp - currentLevelXP;
  const required = nextLevelXP - currentLevelXP;
  return { current, required, percent: required > 0 ? (current / required) * 100 : 0 };
}
