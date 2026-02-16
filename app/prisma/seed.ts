import { PrismaClient } from "@prisma/client";
import { courses } from "../src/lib/data/courses";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@superteam.academy" },
    update: {},
    create: {
      email: "demo@superteam.academy",
      username: "demo_learner",
      displayName: "Demo Learner",
      bio: "Learning Solana development step by step.",
      isPublic: true,
      preferredLocale: "en",
      theme: "dark",
      githubHandle: "demo-learner",
      twitterHandle: "demo_learner",
    },
  });

  console.log(`Created demo user: ${demoUser.id}`);

  // Seed course progress for each course
  const courseProgressData = [
    {
      courseId: "course-solana-fundamentals",
      completedLessons: [0, 1],
      totalLessons: 8,
      currentModuleIndex: 0,
      currentLessonIndex: 2,
    },
    {
      courseId: "course-anchor-development",
      completedLessons: [0],
      totalLessons: 6,
      currentModuleIndex: 0,
      currentLessonIndex: 1,
    },
  ];

  for (const progress of courseProgressData) {
    await prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId: demoUser.id,
          courseId: progress.courseId,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        courseId: progress.courseId,
        completedLessons: progress.completedLessons,
        totalLessons: progress.totalLessons,
        currentModuleIndex: progress.currentModuleIndex,
        currentLessonIndex: progress.currentLessonIndex,
      },
    });
  }

  console.log(`Seeded ${courseProgressData.length} course progress records`);

  // Create XP events
  const xpReasons = [
    { amount: 20, reason: "Completed: What is Solana?", courseId: "course-solana-fundamentals", lessonId: "lesson-1-what-is-solana" },
    { amount: 20, reason: "Completed: The Accounts Model", courseId: "course-solana-fundamentals", lessonId: "lesson-2-accounts-model" },
    { amount: 50, reason: "Challenge passed: Your First Transaction", courseId: "course-solana-fundamentals", lessonId: "lesson-4-first-transaction" },
    { amount: 25, reason: "Daily login bonus", courseId: null, lessonId: null },
    { amount: 10, reason: "Streak bonus (7 days)", courseId: null, lessonId: null },
  ];

  for (const xp of xpReasons) {
    await prisma.xPEvent.create({
      data: {
        userId: demoUser.id,
        amount: xp.amount,
        reason: xp.reason,
        courseId: xp.courseId,
        lessonId: xp.lessonId,
      },
    });
  }

  console.log(`Seeded ${xpReasons.length} XP events`);

  // Create streak
  await prisma.streakRecord.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      currentStreak: 7,
      longestStreak: 12,
      lastActivityDate: new Date(),
    },
  });

  // Unlock some achievements
  const achievements = [
    { achievementId: 1 }, // First lesson
    { achievementId: 2 }, // First challenge
    { achievementId: 4 }, // 7-day streak
  ];

  for (const ach of achievements) {
    await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId: demoUser.id,
          achievementId: ach.achievementId,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        achievementId: ach.achievementId,
      },
    });
  }

  // Log available courses
  console.log("\nAvailable courses in content service:");
  for (const course of courses) {
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    console.log(`  - ${course.title} (${course.slug}): ${course.modules.length} modules, ${totalLessons} lessons`);
  }

  console.log("\nSeed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
