"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Clock,
  Zap,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  Code2,
  ArrowLeft,
  Users,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Course } from "@/types";

const WHAT_YOU_LEARN: Record<string, string[]> = {
  "solana-fundamentals": [
    "Understand Solana's architecture and runtime model",
    "Create and manage accounts on Solana",
    "Build and send transactions",
    "Deploy your first Solana program",
    "Work with SPL tokens and Token-2022",
    "Interact with programs using TypeScript clients",
  ],
  "anchor-development": [
    "Set up and configure an Anchor development environment",
    "Build programs with the Anchor framework DSL",
    "Write comprehensive tests with Anchor's TypeScript library",
    "Understand account constraints and validation",
    "Deploy programs to devnet and mainnet",
  ],
  "defi-builder": [
    "Understand AMM mechanics and constant product formula",
    "Implement token swaps and liquidity pools",
    "Build lending protocols on Solana",
    "Work with Oracle integrations (Pyth, Switchboard)",
    "Understand MEV and transaction ordering",
  ],
  "nft-metaplex": [
    "Create NFTs using the Metaplex Core standard",
    "Build and manage NFT collections",
    "Implement soulbound credentials",
    "Use the DAS API for indexing NFT data",
    "Build marketplaces with Metaplex Auctioneer",
  ],
};

export default function CourseDetailPage() {
  const t = useTranslations("courses");
  const tc = useTranslations("common");
  const params = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${params.slug}`);
        if (res.ok) {
          const data = (await res.json()) as { course: Course };
          setCourse(data.course);
          // Auto-expand the first module
          if (data.course.modules.length > 0) {
            setExpandedModules(new Set([data.course.modules[0].id]));
          }
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
      } finally {
        setIsLoading(false);
      }
    }
    void fetchCourse();
  }, [params.slug]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  if (isLoading || !course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const whatYouLearn = WHAT_YOU_LEARN[course.slug] ?? [];

  return (
    <div className="container py-8 md:py-12">
      <Link href="/courses" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {tc("back")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="outline">{tc(course.difficulty)}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {t("duration", { minutes: course.durationMinutes })}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {t("enrolled", { count: course.enrolledCount })}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{course.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{course.description}</p>
          </div>

          {whatYouLearn.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("whatYouLearn")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {whatYouLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-solana-green" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <h2 className="mb-4 text-xl font-semibold">{t("curriculum")}</h2>
            <div className="space-y-3">
              {course.modules.map((module) => {
                const isExpanded = expandedModules.has(module.id);
                return (
                  <Card key={module.id} className="overflow-hidden">
                    <button
                      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-accent/50"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <h3 className="font-medium">{module.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {module.lessons.length} {tc("lessons")}
                          </p>
                        </div>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="border-t px-4 pb-4">
                        {module.lessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            href={`/courses/${course.slug}/lessons/${lesson.id}`}
                            className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/50"
                          >
                            <Circle className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <span className="text-sm">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.type === "challenge" ? (
                                <Code2 className="h-3.5 w-3.5 text-solana-purple" />
                              ) : (
                                <PlayCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {lesson.durationMinutes} {tc("minutes")}
                              </span>
                              <Badge variant="outline" className="text-[10px]">
                                +{lesson.xpReward} {tc("xp")}
                              </Badge>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="space-y-4 p-6">
              <div className="flex h-40 items-center justify-center rounded-lg bg-muted">
                <BookOpen className="h-16 w-16 text-muted-foreground/30" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{tc("xp")}</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Zap className="h-4 w-4 text-solana-green" />
                    {course.totalXP}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{tc("lessons")}</span>
                  <span className="font-medium">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("instructor")}</span>
                  <span className="font-medium">{course.instructorName}</span>
                </div>
              </div>

              <Separator />

              <Button className="w-full" size="lg" variant="solana">
                {t("enrollCTA")}
              </Button>

              <p className="text-center text-xs text-muted-foreground">{tc("free")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
