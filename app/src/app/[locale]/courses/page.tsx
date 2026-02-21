"use client";

import { useState, useMemo, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { GlassCard, LuxuryBadge } from "@/components/luxury/primitives";
import { Search, Clock, BookOpen, Zap, Filter, Loader2 } from "lucide-react";
import type { Course, CourseDifficulty } from "@/types/content";

type CatalogCategory =
  | "solana"
  | "anchor"
  | "defi"
  | "security"
  | "rust"
  | "infra"
  | "wallet"
  | "mobile"
  | "payments"
  | "frontend";

function inferCourseCategory(course: Course): CatalogCategory {
  const tags = new Set(course.tags.map((tag) => tag.toLowerCase()));
  const slug = course.slug.toLowerCase();

  if (tags.has("rust")) {
    return "rust";
  }
  if (tags.has("anchor") || slug.includes("anchor")) {
    return "anchor";
  }
  if (tags.has("defi") || slug.includes("defi")) {
    return "defi";
  }
  if (tags.has("security") || tags.has("audit") || slug.includes("security")) {
    return "security";
  }
  if (
    tags.has("rpc") ||
    tags.has("indexing") ||
    tags.has("reliability") ||
    tags.has("mempool") ||
    tags.has("fees")
  ) {
    return "infra";
  }
  if (tags.has("wallet") || tags.has("siws") || slug.includes("wallet")) {
    return "wallet";
  }
  if (tags.has("mobile")) {
    return "mobile";
  }
  if (tags.has("payments") || tags.has("solana-pay") || tags.has("commerce")) {
    return "payments";
  }
  if (tags.has("frontend")) {
    return "frontend";
  }
  return "solana";
}

function categoryLabel(
  category: CatalogCategory,
  t: ReturnType<typeof useTranslations>
): string {
  switch (category) {
    case "solana":
      return t("categories.solana");
    case "anchor":
      return t("categories.anchor");
    case "defi":
      return t("categories.defi");
    case "security":
      return t("categories.security");
    case "rust":
      return t("categories.rust");
    case "infra":
      return t("categories.infra");
    case "wallet":
      return t("categories.wallet");
    case "mobile":
      return t("categories.mobile");
    case "payments":
      return t("categories.payments");
    case "frontend":
      return t("categories.frontend");
  }
}

export default function CourseCatalogPage() {
  const t = useTranslations("courses");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch(`/api/courses?locale=${encodeURIComponent(locale)}`);
        if (res.ok) {
          const data = (await res.json()) as { courses: Course[] };
          setCourses(data.courses);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setIsLoading(false);
      }
    }
    void fetchCourses();
  }, [locale]);

  const filtered = useMemo(() => {
    let result = courses;
    if (difficulty !== "all") {
      result = result.filter((c) => c.difficulty === difficulty);
    }
    if (category !== "all") {
      result = result.filter((c) => inferCourseCategory(c) === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          categoryLabel(inferCourseCategory(c), t).toLowerCase().includes(q)
      );
    }
    return result;
  }, [courses, search, difficulty, category, t]);

  const difficultyFilters = [
    { value: "all", label: t("filterAll") },
    { value: "beginner", label: t("filterBeginner") },
    { value: "intermediate", label: t("filterIntermediate") },
    { value: "advanced", label: t("filterAdvanced") },
  ];

  const categoryFilters = useMemo(() => {
    const ordered: CatalogCategory[] = [
      "solana",
      "anchor",
      "defi",
      "security",
      "rust",
      "infra",
      "wallet",
      "mobile",
      "payments",
      "frontend",
    ];
    const present = new Set(courses.map((course) => inferCourseCategory(course)));
    return [
      { value: "all", label: t("categories.all") },
      ...ordered
        .filter((entry) => present.has(entry))
        .map((entry) => ({ value: entry, label: categoryLabel(entry, t) })),
    ];
  }, [courses, t]);

  const totalLessons = (c: Course) => c.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  const difficultyColor = (d: CourseDifficulty) => {
    switch (d) {
      case "beginner":
        return "text-emerald-500 bg-emerald-500/10";
      case "intermediate":
        return "text-amber-500 bg-amber-500/10";
      case "advanced":
        return "text-red-500 bg-red-500/10";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="academy-fade-up container py-8 md:py-10">
      <div className="mb-8 rounded-3xl border border-border bg-gradient-to-r from-card to-muted p-8 md:p-10">
        <LuxuryBadge color="amber">{t("title")}</LuxuryBadge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {t("subtitle")}
        </h1>
      </div>

      <GlassCard className="mb-8 p-5 md:p-6" glowColor="purple">
        <div className="flex flex-col gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {difficultyFilters.map((f) => (
              <Button
                key={f.value}
                variant="ghost"
                size="sm"
                onClick={() => setDifficulty(f.value)}
                className={
                  difficulty === f.value
                    ? "border border-primary bg-primary/10 text-primary"
                    : ""
                }
              >
                {f.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((f) => (
              <Button
                key={f.value}
                variant="ghost"
                size="sm"
                onClick={() => setCategory(f.value)}
                className={
                  category === f.value
                    ? "border border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : ""
                }
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      </GlassCard>

      {filtered.length === 0 ? (
        <GlassCard className="py-16 text-center" glowColor="slate">
          <div className="flex flex-col items-center justify-center text-center">
            <Filter className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-foreground">{tc("noResults")}</p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <GlassCard
                className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                glowColor="indigo"
              >
                <div className="flex h-full flex-col p-6">
                  <div className="mb-4 flex h-32 items-center justify-center rounded-xl border border-border bg-muted/50">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`text-xs ${difficultyColor(course.difficulty)}`}>
                      {tc(course.difficulty)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {categoryLabel(inferCourseCategory(course), t)}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold text-foreground transition-colors group-hover:text-primary">
                    {course.title}
                  </h3>
                  <p className="mt-1 flex-1 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-500" />
                      {t("xpReward", { xp: course.totalXP })}
                    </span>
                    <span>
                      {totalLessons(course)} {tc("lessons")}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Progress value={0} className="h-1.5" />
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
