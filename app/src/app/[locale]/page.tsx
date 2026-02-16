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
  Package,
  Terminal,
  Check,
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

      {/* Component Hub Section */}
      <section className="border-t py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Coming Soon
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Component Hub
            </h2>
            <p className="mt-4 text-muted-foreground">
              Production-ready React components for Solana. Drop-in wallet connectors, 
              token displays, NFT galleries, and more.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Wallet Connect Card */}
            <Card className="group transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">WalletConnectButton</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Beautiful, customizable wallet connection button with automatic wallet detection.
                </p>
                <div className="mt-4 rounded-md bg-muted p-2">
                  <code className="text-xs">npm install @jazzcode/wallet-connect-button</code>
                </div>
              </CardContent>
            </Card>

            {/* Token Balance Card */}
            <Card className="group transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">TokenBalanceCard</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Display SPL token balances with real-time updates and price fetching.
                </p>
                <div className="mt-4 rounded-md bg-muted p-2">
                  <code className="text-xs">npm install @jazzcode/token-balance-card</code>
                </div>
              </CardContent>
            </Card>

            {/* NFT Gallery Card */}
            <Card className="group transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">NFTGallery</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Responsive NFT gallery grid with Metaplex integration.
                </p>
                <div className="mt-4 rounded-md bg-muted p-2">
                  <code className="text-xs">npm install @jazzcode/nft-gallery</code>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Link href="/components">
              <Button variant="outline" className="gap-2">
                View All Components
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Playground Section */}
      <section className="border-t bg-muted/30 py-20 md:py-28">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-4">
                Beta
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Interactive Playground
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Experiment with Solana code in real-time. Test Web3.js snippets, 
                explore Anchor IDLs, and prototype your next dApp.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Live TypeScript execution with Solana mocks",
                  "Pre-built templates for common operations",
                  "Share your code with a URL",
                  "No wallet connection required",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-solana-green" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/playground">
                  <Button variant="solana" className="gap-2">
                    <Terminal className="h-4 w-4" />
                    Open Playground
                  </Button>
                </Link>
              </div>
            </div>

            {/* Code Preview */}
            <div className="relative">
              <div className="rounded-lg border bg-card p-4 shadow-lg">
                <div className="flex items-center gap-2 border-b pb-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground">playground.sol</span>
                </div>
                <pre className="mt-3 overflow-x-auto text-sm">
                  <code className="language-typescript">
                    {`const { Connection, PublicKey } = require('@solana/web3.js');

async function main() {
  const connection = new Connection('https://api.devnet.solana.com');
  const pubkey = new PublicKey('11111111111111111111111111111111');
  
  const balance = await connection.getBalance(pubkey);
  console.log(\`Balance: \${balance / 1e9} SOL\`);
}

main();`}
                  </code>
                </pre>
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-lg bg-gradient-to-br from-solana-purple/20 to-solana-green/20" />
            </div>
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
