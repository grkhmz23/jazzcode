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
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="academy-fade-up container py-8 md:py-10">
      <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0F1322] to-[#161230] p-8 md:p-10">
        <LuxuryBadge color="amber">{t("title")}</LuxuryBadge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {t("subtitle")}
        </h1>
      </div>

      <GlassCard className="mb-8 p-5 md:p-6" glowColor="purple">
        <div className="flex flex-col gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-white/10 bg-[#05070D]/70 pl-10 text-slate-200 placeholder:text-slate-500"
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
                    ? "border border-purple-500/40 bg-purple-500/20 text-purple-200"
                    : "border border-white/10 bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
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
                    ? "border border-amber-500/40 bg-amber-500/15 text-amber-200"
                    : "border border-white/10 bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
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
            <Filter className="h-12 w-12 text-slate-600" />
            <p className="mt-4 text-lg font-medium text-slate-200">{tc("noResults")}</p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <GlassCard
                className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30"
                glowColor="indigo"
              >
                <div className="flex h-full flex-col p-6">
                  <div className="mb-4 flex h-32 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                    <BookOpen className="h-12 w-12 text-slate-600" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`text-xs ${difficultyColor(course.difficulty)}`}>
                      {tc(course.difficulty)}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-xs text-slate-300">
                      {categoryLabel(inferCourseCategory(course), t)}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold text-white transition-colors group-hover:text-purple-200">
                    {course.title}
                  </h3>
                  <p className="mt-1 flex-1 line-clamp-2 text-sm text-slate-400">{course.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-400" />
                      {t("xpReward", { xp: course.totalXP })}
                    </span>
                    <span>
                      {totalLessons(course)} {tc("lessons")}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Progress value={0} className="h-1.5 bg-white/10" />
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
