"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Clock, BookOpen, Zap, Filter, Loader2 } from "lucide-react";
import type { Course, CourseDifficulty } from "@/types/content";

export default function CourseCatalogPage() {
  const t = useTranslations("courses");
  const tc = useTranslations("common");

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
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
  }, []);

  const filtered = useMemo(() => {
    let result = courses;
    if (difficulty !== "all") {
      result = result.filter((c) => c.difficulty === difficulty);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((tag) => tag.includes(q))
      );
    }
    return result;
  }, [courses, search, difficulty]);

  const difficultyFilters = [
    { value: "all", label: t("filterAll") },
    { value: "beginner", label: t("filterBeginner") },
    { value: "intermediate", label: t("filterIntermediate") },
    { value: "advanced", label: t("filterAdvanced") },
  ];

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
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {difficultyFilters.map((f) => (
            <Button
              key={f.value}
              variant={difficulty === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setDifficulty(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Filter className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium">{tc("noResults")}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className="group h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-muted">
                    <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${difficultyColor(course.difficulty)}`}>
                      {tc(course.difficulty)}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold transition-colors group-hover:text-primary">
                    {course.title}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-solana-green" />
                      {t("xpReward", { xp: course.totalXP })}
                    </span>
                    <span>
                      {totalLessons(course)} {tc("lessons")}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Progress value={0} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
