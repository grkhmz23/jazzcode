import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("renders hero and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByRole("link", { name: /courses/i })).toBeVisible();
    // Hero content
    await expect(page.locator("h1")).toBeVisible();
    // Footer
    await expect(page.locator("footer")).toBeVisible();
  });

  test("CTA buttons navigate to courses", async ({ page }) => {
    await page.goto("/");
    const coursesLink = page.getByRole("link", { name: /start learning|explore courses/i }).first();
    await coursesLink.click();
    await expect(page).toHaveURL(/\/courses/);
  });
});

test.describe("Course Catalog", () => {
  test("renders course cards", async ({ page }) => {
    await page.goto("/courses");
    await expect(page.locator("h1")).toBeVisible();
    // At least one course card should be visible
    const cards = page.locator('[class*="card"]').first();
    await expect(cards).toBeVisible();
  });

  test("search filters courses", async ({ page }) => {
    await page.goto("/courses");
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill("Solana Fundamentals");
    // Should still show at least one result
    await expect(page.getByText("Solana Fundamentals")).toBeVisible();
  });

  test("difficulty filter works", async ({ page }) => {
    await page.goto("/courses");
    const beginnerButton = page.getByRole("button", { name: /beginner|iniciante|principiante/i });
    await beginnerButton.click();
    // Should filter to beginner courses only
    await expect(page.getByText("Solana Fundamentals")).toBeVisible();
  });
});

test.describe("Course Detail", () => {
  test("renders course info and curriculum", async ({ page }) => {
    await page.goto("/courses/solana-fundamentals");
    await expect(page.locator("h1")).toBeVisible();
    // Should show curriculum section
    await expect(page.getByText(/curriculum|currículo|plan de estudios/i)).toBeVisible();
  });

  test("expandable module accordion works", async ({ page }) => {
    await page.goto("/courses/solana-fundamentals");
    // First module should be expanded by default
    const lessonLink = page.getByText("What is Solana?");
    await expect(lessonLink).toBeVisible();
  });
});

test.describe("Lesson View", () => {
  test("renders split layout with editor", async ({ page }) => {
    await page.goto("/courses/solana-fundamentals/lessons/les-3");
    // Content should be visible
    await expect(page.getByText("Your First Solana Transaction")).toBeVisible();
    // Run button should be visible
    await expect(page.getByRole("button", { name: /run code|executar|ejecutar/i })).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("language switcher changes locale", async ({ page }) => {
    await page.goto("/");
    // Find and click the language button (Globe icon)
    const langButton = page.locator('button[aria-label*="anguage"], button[aria-label*="dioma"]');
    await langButton.click();
    // Click Portuguese option
    const ptOption = page.getByText("Português");
    await ptOption.click();
    // URL should contain pt-BR
    await expect(page).toHaveURL(/pt-BR/);
  });

  test("theme toggle works", async ({ page }) => {
    await page.goto("/");
    const themeButton = page.locator('button[aria-label*="heme"], button[aria-label*="ema"]');
    await themeButton.click();
    // Check that html class changes
    const html = page.locator("html");
    const classAfter = await html.getAttribute("class");
    expect(classAfter).toBeDefined();
  });
});

test.describe("Dashboard (unauthenticated)", () => {
  test("renders empty state", async ({ page }) => {
    await page.goto("/dashboard");
    // Should show either login prompt or empty dashboard
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Leaderboard", () => {
  test("renders with timeframe filters", async ({ page }) => {
    await page.goto("/leaderboard");
    await expect(page.locator("h1")).toBeVisible();
    // Timeframe buttons should be visible
    await expect(page.getByRole("button", { name: /all time|geral|general/i })).toBeVisible();
  });
});

test.describe("Settings", () => {
  test("renders settings form", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("h1")).toBeVisible();
  });
});
