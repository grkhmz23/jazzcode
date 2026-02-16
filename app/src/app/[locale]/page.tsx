import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Shield,
  Zap,
  Users,
  ArrowRight,
  BookOpen,
  Trophy,
  Star,
} from "lucide-react";

export default function LandingPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  const features = [
    { icon: Code2, title: t("featureEditor"), desc: t("featureEditorDesc") },
    { icon: Shield, title: t("featureCredentials"), desc: t("featureCredentialsDesc") },
    { icon: Zap, title: t("featureXP"), desc: t("featureXPDesc") },
    { icon: Users, title: t("featureCommunity"), desc: t("featureCommunityDesc") },
  ];

  const stats = [
    { value: "2,500+", label: t("statsStudents") },
    { value: "15+", label: t("statsCourses") },
    { value: "800+", label: t("statsCredentials") },
    { value: "5,000+", label: t("statsCommunity") },
  ];

  const paths = [
    { title: "Solana Fundamentals", difficulty: tc("beginner"), lessons: 24, icon: BookOpen, color: "text-solana-green" },
    { title: "DeFi Developer", difficulty: tc("intermediate"), lessons: 32, icon: Zap, color: "text-solana-purple" },
    { title: "NFT & Metaplex", difficulty: tc("intermediate"), lessons: 18, icon: Star, color: "text-solana-blue" },
    { title: "Security & Auditing", difficulty: tc("advanced"), lessons: 20, icon: Shield, color: "text-amber-500" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="solana" className="mb-6 px-4 py-1.5 text-sm">
              {tc("free")} · Open Source · Solana Native
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-gradient-solana">{t("heroTitle")}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {t("heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/courses">
                <Button size="xl" variant="solana" className="gap-2">
                  {t("heroCTA")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="xl" variant="outline" className="gap-2">
                  {t("heroSecondaryCTA")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-gradient-solana">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t("featuresTitle")}
            </h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="border-t bg-muted/30 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t("pathsTitle")}
            </h2>
            <p className="mt-4 text-muted-foreground">{t("pathsSubtitle")}</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {paths.map((path) => (
              <Link key={path.title} href="/courses">
                <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardContent className="p-6">
                    <path.icon className={`h-8 w-8 ${path.color}`} />
                    <h3 className="mt-4 font-semibold">{path.title}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{path.difficulty}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {path.lessons} {tc("lessons")}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      {tc("learnMore")} <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-card p-8 text-center md:p-16">
            <div className="absolute inset-0 bg-grid-pattern opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
            <div className="relative">
              <Trophy className="mx-auto h-12 w-12 text-solana-green" />
              <h2 className="mt-6 text-3xl font-bold md:text-4xl">{t("ctaTitle")}</h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("ctaSubtitle")}</p>
              <Link href="/courses" className="mt-8 inline-block">
                <Button size="xl" variant="solana" className="gap-2">
                  {t("ctaButton")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
