import { PrismaClient } from "@prisma/client";

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

  // Create course progress
  await prisma.courseProgress.upsert({
    where: {
      userId_courseId: {
        userId: demoUser.id,
        courseId: "sol-fundamentals",
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      courseId: "sol-fundamentals",
      completedLessons: [0, 1, 2],
      totalLessons: 8,
      currentModuleIndex: 0,
      currentLessonIndex: 3,
    },
  });

  // Create XP events
  const xpReasons = [
    { amount: 10, reason: "Completed: What is Solana?", courseId: "sol-fundamentals", lessonId: "les-1" },
    { amount: 15, reason: "Completed: Accounts Model", courseId: "sol-fundamentals", lessonId: "les-2" },
    { amount: 50, reason: "Challenge passed: Create Keypair", courseId: "sol-fundamentals", lessonId: "les-3" },
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

  console.log("Seed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
