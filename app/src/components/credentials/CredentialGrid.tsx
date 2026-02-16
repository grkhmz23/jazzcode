"use client";

import { useState, useEffect } from "react";
import { CredentialCard } from "./CredentialCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, AlertCircle } from "lucide-react";
import type { OnChainCredential } from "@/lib/services/onchain";

interface CredentialGridProps {
  walletAddress: string;
}

interface CredentialsData {
  credentials: OnChainCredential[];
  heliusAvailable: boolean;
  error?: string;
  code?: string;
}

export function CredentialGrid({ walletAddress }: CredentialGridProps) {
  const [data, setData] = useState<CredentialsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCredentials() {
      try {
        const response = await fetch(
          `/api/onchain/credentials?wallet=${encodeURIComponent(walletAddress)}`
        );
        if (response.ok) {
          const result = (await response.json()) as { data: CredentialsData };
          setData(result.data);
        } else {
          setData({ credentials: [], heliusAvailable: false });
        }
      } catch (err) {
        console.error("Failed to fetch credentials:", err);
        setData({ credentials: [], heliusAvailable: false });
      } finally {
        setIsLoading(false);
      }
    }

    void fetchCredentials();
  }, [walletAddress]);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4" />
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="mt-4 h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Helius not available (API key not set)
  if (!data?.heliusAvailable) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-muted-foreground">
            On-chain credentials will be visible once the credential program is
            deployed on devnet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // No credentials found
  if (data.credentials.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Shield className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-muted-foreground">
            No credentials found. Complete courses to earn on-chain credentials.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.credentials.map((credential) => (
        <CredentialCard key={credential.id} credential={credential} />
      ))}
    </div>
  );
}
