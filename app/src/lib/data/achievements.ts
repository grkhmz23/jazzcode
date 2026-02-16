import type { AchievementDefinition } from "@/types/achievements";

/**
 * All achievement definitions for the platform
 * Easy to add new achievements without code changes
 */
export const achievements: AchievementDefinition[] = [
  // PROGRESS (common → rare)
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "👣",
    category: "progress",
    rarity: "common",
    condition: { type: "first_lesson" },
  },
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Complete 5 lessons",
    icon: "📚",
    category: "progress",
    rarity: "common",
    condition: { type: "lessons_completed", count: 5 },
  },
  {
    id: "dedicated-learner",
    name: "Dedicated Learner",
    description: "Complete 15 lessons",
    icon: "🎓",
    category: "progress",
    rarity: "uncommon",
    condition: { type: "lessons_completed", count: 15 },
  },
  {
    id: "course-completer",
    name: "Course Completer",
    description: "Complete your first course",
    icon: "🏆",
    category: "progress",
    rarity: "uncommon",
    condition: { type: "courses_completed", count: 1 },
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "Complete all available courses",
    icon: "🎯",
    category: "progress",
    rarity: "legendary",
    condition: { type: "all_courses_completed" },
  },

  // STREAKS
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    category: "streaks",
    rarity: "uncommon",
    condition: { type: "streak_reached", days: 7 },
  },
  {
    id: "monthly-master",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "💪",
    category: "streaks",
    rarity: "rare",
    condition: { type: "streak_reached", days: 30 },
  },
  {
    id: "consistency-king",
    name: "Consistency King",
    description: "Maintain a 100-day streak",
    icon: "👑",
    category: "streaks",
    rarity: "legendary",
    condition: { type: "streak_reached", days: 100 },
  },

  // SKILLS (course-specific)
  {
    id: "solana-basics",
    name: "Solana Basics",
    description: "Complete Solana Fundamentals",
    icon: "⚡",
    category: "skills",
    rarity: "uncommon",
    condition: { type: "course_completed", courseSlug: "solana-fundamentals" },
  },
  {
    id: "anchor-expert",
    name: "Anchor Expert",
    description: "Complete Anchor Development",
    icon: "⚓",
    category: "skills",
    rarity: "rare",
    condition: { type: "course_completed", courseSlug: "anchor-development" },
  },
  {
    id: "frontend-builder",
    name: "Frontend Builder",
    description: "Complete Solana Frontend Development",
    icon: "🖥️",
    category: "skills",
    rarity: "rare",
    condition: { type: "course_completed", courseSlug: "solana-frontend" },
  },
  {
    id: "defi-degen",
    name: "DeFi Degen",
    description: "Complete DeFi on Solana",
    icon: "💰",
    category: "skills",
    rarity: "epic",
    condition: { type: "course_completed", courseSlug: "defi-solana" },
  },
  {
    id: "full-stack-solana",
    name: "Full Stack Solana",
    description: "Complete all 4 courses",
    icon: "🌟",
    category: "skills",
    rarity: "legendary",
    condition: { type: "all_courses_completed" },
  },

  // XP & LEVEL milestones
  {
    id: "xp-100",
    name: "Century",
    description: "Earn 100 XP",
    icon: "💯",
    category: "progress",
    rarity: "common",
    condition: { type: "xp_reached", amount: 100 },
  },
  {
    id: "xp-1000",
    name: "Thousandaire",
    description: "Earn 1,000 XP",
    icon: "🏅",
    category: "progress",
    rarity: "uncommon",
    condition: { type: "xp_reached", amount: 1000 },
  },
  {
    id: "xp-5000",
    name: "XP Master",
    description: "Earn 5,000 XP",
    icon: "💎",
    category: "progress",
    rarity: "epic",
    condition: { type: "xp_reached", amount: 5000 },
  },
  {
    id: "level-5",
    name: "Rising Star",
    description: "Reach Level 5",
    icon: "⭐",
    category: "progress",
    rarity: "uncommon",
    condition: { type: "level_reached", level: 5 },
  },
  {
    id: "level-10",
    name: "Veteran",
    description: "Reach Level 10",
    icon: "🌟",
    category: "progress",
    rarity: "epic",
    condition: { type: "level_reached", level: 10 },
  },
];

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): AchievementDefinition | undefined {
  return achievements.find((a) => a.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(
  category: AchievementDefinition["category"]
): AchievementDefinition[] {
  return achievements.filter((a) => a.category === category);
}

/**
 * Rarity order for sorting
 */
const rarityOrder: Record<AchievementDefinition["rarity"], number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

/**
 * Sort achievements by rarity (common → legendary)
 */
export function sortAchievementsByRarity(
  achievementList: AchievementDefinition[]
): AchievementDefinition[] {
  return [...achievementList].sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
}
