"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { XPDisplay } from "@/components/gamification/xp-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Shield,
  ExternalLink,
  Settings,
  BookOpen,
  Loader2,
  Calendar,
} from "lucide-react";
import { deriveLevel } from "@/types";
import type { Achievement, Credential, Progress } from "@/types";

interface ProfileData {
  username: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  joinedAt: string;
  isPublic: boolean;
  xp: number;
  achievements: Achievement[];
  credentials: Credential[];
  courseProgress: Progress[];
  primaryWallet: string | null;
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = (await response.json()) as ProfileData;
          setProfileData(data);
        }
      } catch {
        // fail silently, render empty
      } finally {
        setIsLoading(false);
      }
    }
    void fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const name = profileData?.displayName ?? profileData?.username ?? session?.user?.name ?? "Learner";
  const xp = profileData?.xp ?? 0;
  const level = deriveLevel(xp);
  const achievements = profileData?.achievements ?? [];
  const credentials = profileData?.credentials ?? [];
  const courseProgress = profileData?.courseProgress ?? [];
  const completedCourses = courseProgress.filter((cp) => cp.percentComplete === 100);
  const unlockedAchievements = achievements.filter((a) => a.unlockedAt !== null);

  return (
    <div className="container py-8 md:py-12">
      {/* Profile Header */}
      <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profileData?.avatarUrl ?? session?.user?.image ?? undefined} alt={name} />
          <AvatarFallback className="text-2xl">{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <h1 className="text-2xl font-bold">{name}</h1>
            <Badge variant="outline">
              {tc("level")} {level}
            </Badge>
          </div>
          {profileData?.bio && (
            <p className="mt-2 text-muted-foreground">{profileData.bio}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {t("joined", {
                date: profileData?.joinedAt
                  ? new Date(profileData.joinedAt).toLocaleDateString()
                  : "—",
              })}
            </span>
            {profileData?.primaryWallet && (
              <span className="font-mono text-xs">
                {profileData.primaryWallet.slice(0, 4)}...{profileData.primaryWallet.slice(-4)}
              </span>
            )}
          </div>
        </div>
        <Link href="/settings">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            {t("editProfile")}
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{xp.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{tc("xp")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{level}</p>
            <p className="text-xs text-muted-foreground">{tc("level")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{completedCourses.length}</p>
            <p className="text-xs text-muted-foreground">{tc("completed")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
            <p className="text-xs text-muted-foreground">{t("badges")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="badges">
        <TabsList>
          <TabsTrigger value="badges">{t("badges")}</TabsTrigger>
          <TabsTrigger value="credentials">{t("credentials")}</TabsTrigger>
          <TabsTrigger value="courses">{t("completedCourses")}</TabsTrigger>
        </TabsList>

        {/* Badges */}
        <TabsContent value="badges" className="mt-6">
          {achievements.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {t("noBadges")}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((ach) => (
                <Card
                  key={ach.id}
                  className={`transition-all ${
                    ach.unlockedAt ? "" : "opacity-40 grayscale"
                  }`}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
                      {ach.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{ach.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{ach.description}</p>
                      {ach.unlockedAt && (
                        <p className="text-xs text-solana-green">
                          {new Date(ach.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Credentials */}
        <TabsContent value="credentials" className="mt-6">
          {credentials.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                <p>{t("noCredentials")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {credentials.map((cred) => (
                <Card key={cred.mintAddress}>
                  <CardContent className="p-4">
                    {cred.imageUri && (
                      <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-muted">
                        <Shield className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <h3 className="font-medium">{cred.trackName}</h3>
                    <Badge variant="outline" className="mt-1">
                      {t("credentialLevel", { level: cred.level })}
                    </Badge>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(cred.acquiredAt).toLocaleDateString()}
                    </p>
                    <a
                      href={cred.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      {t("verifyOnChain")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Completed Courses */}
        <TabsContent value="courses" className="mt-6">
          {completedCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center text-muted-foreground">
                <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p>{t("noCredentials")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {completedCourses.map((cp) => (
                <Card key={cp.courseId}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <Trophy className="h-5 w-5 text-solana-green" />
                    <div className="flex-1">
                      <p className="font-medium">{cp.courseId}</p>
                      <p className="text-xs text-muted-foreground">
                        {cp.completedLessons.length} {tc("lessons")}
                      </p>
                    </div>
                    <Badge variant="success">{tc("completed")}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
