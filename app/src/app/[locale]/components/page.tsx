"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Copy,
  Check,
  ExternalLink,
  Star,
  Package,
  Wallet,
  Code2,
  Shield,
  Zap,
  Coins,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamic import for CodeEditor to reduce initial bundle size
const CodeEditor = dynamic(
  () => import("@/components/editor/CodeEditor").then((mod) => mod.CodeEditor),
  { ssr: false }
);

interface ComponentDefinition {
  id: string;
  name: string;
  description: string;
  category: "wallet" | "token" | "nft" | "defi" | "security";
  installCommand: string;
  npmPackage: string;
  example: string;
}

const components: ComponentDefinition[] = [
  {
    id: "wallet-connect-button",
    name: "WalletConnectButton",
    description: "Beautiful, customizable wallet connection button with automatic wallet detection and multi-wallet support.",
    category: "wallet",
    npmPackage: "@jazzcode/wallet-connect-button",
    installCommand: "npm install @jazzcode/wallet-connect-button",
    example: `import { WalletConnectButton } from '@jazzcode/wallet-connect-button';

export default function App() {
  return <WalletConnectButton network="devnet" />;
}`,
  },
  {
    id: "token-balance-card",
    name: "TokenBalanceCard",
    description: "Display SPL token balances with real-time updates, price fetching, and historical charts.",
    category: "token",
    npmPackage: "@jazzcode/token-balance-card",
    installCommand: "npm install @jazzcode/token-balance-card",
    example: `import { TokenBalanceCard } from '@jazzcode/token-balance-card';

export default function WalletPage() {
  return (
    <TokenBalanceCard 
      walletAddress={wallet.publicKey}
      showPrices={true}
      network="mainnet"
    />
  );
}`,
  },
  {
    id: "nft-gallery",
    name: "NFTGallery",
    description: "Responsive NFT gallery grid with Metaplex integration, lazy loading, and lightbox preview.",
    category: "nft",
    npmPackage: "@jazzcode/nft-gallery",
    installCommand: "npm install @jazzcode/nft-gallery",
    example: `import { NFTGallery } from '@jazzcode/nft-gallery';

export default function CollectionPage() {
  return (
    <NFTGallery
      ownerAddress={wallet.publicKey}
      collection="degenapes"
      gridCols={3}
    />
  );
}`,
  },
  {
    id: "swap-widget",
    name: "SwapWidget",
    description: "Integrated DEX swap widget supporting Jupiter, Raydium, and Orca with real-time quotes.",
    category: "defi",
    npmPackage: "@jazzcode/swap-widget",
    installCommand: "npm install @jazzcode/swap-widget",
    example: `import { SwapWidget } from '@jazzcode/swap-widget';

export default function SwapPage() {
  return (
    <SwapWidget
      defaultInputMint="SOL"
      defaultOutputMint="USDC"
      slippage={0.5}
    />
  );
}`,
  },
  {
    id: "transaction-history",
    name: "TransactionHistory",
    description: "Beautiful transaction history table with filtering, pagination, and program-specific parsing.",
    category: "wallet",
    npmPackage: "@jazzcode/transaction-history",
    installCommand: "npm install @jazzcode/transaction-history",
    example: `import { TransactionHistory } from '@jazzcode/transaction-history';

export default function ActivityPage() {
  return (
    <TransactionHistory
      walletAddress={wallet.publicKey}
      network="mainnet"
      filters={['transfers', 'nfts', 'defi']}
    />
  );
}`,
  },
  {
    id: "signature-verifier",
    name: "SignatureVerifier",
    description: "Cryptographic signature verification component with visual indicators and error handling.",
    category: "security",
    npmPackage: "@jazzcode/signature-verifier",
    installCommand: "npm install @jazzcode/signature-verifier",
    example: `import { SignatureVerifier } from '@jazzcode/signature-verifier';

export default function VerifyPage() {
  return (
    <SignatureVerifier
      message={message}
      signature={signature}
      publicKey={publicKey}
      onVerify={(valid) => console.log('Valid:', valid)}
    />
  );
}`,
  },
];

interface ComponentCardProps {
  component: ComponentDefinition;
  onPreview: (component: ComponentDefinition) => void;
}

function ComponentCard({ component, onPreview }: ComponentCardProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("components");

  const categoryLabels: Record<string, string> = {
    wallet: t("categoryWallet"),
    token: t("categoryToken"),
    nft: t("categoryNft"),
    defi: t("categoryDefi"),
    security: t("categorySecurity"),
  };

  const categoryIcons: Record<string, typeof Wallet> = {
    wallet: Wallet,
    token: Coins,
    nft: Package,
    defi: Zap,
    security: Shield,
  };

  const categoryColors: Record<string, string> = {
    wallet: "text-blue-500",
    token: "text-green-500",
    nft: "text-purple-500",
    defi: "text-yellow-500",
    security: "text-red-500",
  };

  const CategoryIcon = categoryIcons[component.category];
  const categoryLabel = categoryLabels[component.category];
  const categoryColor = categoryColors[component.category];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(component.installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="group flex h-full flex-col transition-all hover:border-primary/50 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-center gap-2">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-muted", categoryColor)}>
            <CategoryIcon className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {categoryLabel}
          </span>
        </div>
        <CardTitle className="text-lg">{component.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {component.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-end">
        <div className="space-y-3">
          <div className="rounded-md bg-muted p-2">
            <code className="text-xs">{component.npmPackage}</code>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="flex-1 gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        {t("copied")}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        {t("install")}
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("copyCommand")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreview(component)}
                    className="gap-1"
                  >
                    <Code2 className="h-4 w-4" />
                    {t("preview")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("viewExample")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ComponentsPage() {
  const [previewComponent, setPreviewComponent] = useState<ComponentDefinition | null>(null);
  const [showAll, setShowAll] = useState(false);
  const t = useTranslations("components");

  const displayedComponents = showAll ? components : components.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="border-b bg-grid-pattern py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800">
              <Star className="h-4 w-4" />
              {t("comingSoon")}
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {t("title")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <a
                href="https://github.com/superteam-academy/jazzcode"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Star className="h-4 w-4" />
                {t("starOnGitHub")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <div className="border-b bg-blue-50/50 px-4 py-3 text-center">
        <p className="text-sm text-blue-800">
          {t("developmentNotice")}{" "}
          <a
            href="https://github.com/superteam-academy/jazzcode"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline hover:text-blue-900"
          >
            {t("getNotified")}
          </a>
        </p>
      </div>

      {/* Components Grid */}
      <section className="flex-1 py-12">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{t("featuredComponents")}</h2>
              <p className="text-muted-foreground">
                {t("featuredSubtitle")}
              </p>
            </div>
            {!showAll && components.length > 3 && (
              <Button
                variant="ghost"
                onClick={() => setShowAll(true)}
                className="gap-1"
              >
                {t("viewAll", { count: components.length })}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedComponents.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                onPreview={setPreviewComponent}
              />
            ))}
          </div>

          {showAll && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(false)}
              >
                {t("showLess")}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Submit CTA */}
      <section className="border-t bg-muted/30 py-12">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold">{t("submitComponent")}</h2>
            <p className="mt-2 text-muted-foreground">
              {t("submitSubtitle")}
            </p>
            <a href="#submit-component">
              <Button className="mt-6 gap-2">
                <ExternalLink className="h-4 w-4" />
                {t("submitButton")}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      <Dialog
        open={previewComponent !== null}
        onOpenChange={() => setPreviewComponent(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewComponent?.name}</DialogTitle>
            <DialogDescription>
              {previewComponent?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">{t("installLabel")}</h4>
              <div className="flex items-center gap-2 rounded-md bg-muted p-3">
                <code className="flex-1 text-sm">
                  {previewComponent?.installCommand}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (previewComponent) {
                      await navigator.clipboard.writeText(
                        previewComponent.installCommand
                      );
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">{t("exampleLabel")}</h4>
              <div className="h-64 overflow-hidden rounded-md border">
                {previewComponent && (
                  <CodeEditor
                    language="typescript"
                    defaultValue={previewComponent.example}
                    value={previewComponent.example}
                    readOnly
                    height="100%"
                  />
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
