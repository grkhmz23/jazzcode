"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle2, ImageOff } from "lucide-react";
import Image from "next/image";
import type { OnChainCredential } from "@/lib/services/onchain";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CredentialCardProps {
  credential: OnChainCredential;
  className?: string;
}

// Level color mapping
const levelColors: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-600 border-green-500/20",
  Intermediate: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Advanced: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Expert: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export function CredentialCard({ credential, className }: CredentialCardProps) {
  const t = useTranslations("credentials");
  const [imageError, setImageError] = useState(false);

  const handleViewOnExplorer = () => {
    window.open(
      `https://explorer.solana.com/address/${credential.mintAddress}?cluster=devnet`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleViewMetadata = () => {
    if (credential.metadataUri) {
      window.open(credential.metadataUri, "_blank", "noopener,noreferrer");
    }
  };

  // Get level badge color
  const levelBadgeClass =
    levelColors[credential.level] ||
    "bg-muted text-muted-foreground border-muted";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      </div>

      <CardContent className="relative p-0">
        {/* Image Section */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {credential.imageUrl && !imageError ? (
            <Image
              src={credential.imageUrl}
              alt={credential.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <ImageOff className="h-12 w-12 text-muted-foreground/30" />
              <span className="mt-2 text-xs text-muted-foreground">
                {t("noImageAvailable")}
              </span>
            </div>
          )}

          {/* cNFT Badge */}
          {credential.compressed && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-solana-green/90 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              <CheckCircle2 className="h-3 w-3" />
              {t("verified")}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Name */}
          <h3 className="font-semibold leading-tight">{credential.name}</h3>

          {/* Badges */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {credential.trackName && (
              <Badge variant="outline" className="text-xs">
                {credential.trackName}
              </Badge>
            )}
            {credential.level && (
              <Badge variant="outline" className={cn("text-xs", levelBadgeClass)}>
                {credential.level}
              </Badge>
            )}
          </div>

          {/* Description (truncated) */}
          {credential.description && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
              {credential.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1 text-xs"
              onClick={handleViewOnExplorer}
            >
              <ExternalLink className="h-3 w-3" />
              {t("viewOnExplorer")}
            </Button>
            {credential.metadataUri && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handleViewMetadata}
              >
                {t("viewMetadata")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
