"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  ExternalLink,
  Share2,
  Loader2,
  Award,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import type { Certificate } from "@/types";

export default function CertificatePage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const t = useTranslations("certificate");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [verification, setVerification] = useState<{ valid: boolean; owner: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCertificate() {
      try {
        const response = await fetch(`/api/certificates/${encodeURIComponent(params.id)}`);
        if (response.ok) {
          const data = (await response.json()) as {
            certificate: Certificate;
            verification: { valid: boolean; owner: string | null };
          };
          setCertificate(data.certificate);
          setVerification(data.verification);
        }
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    }
    void fetchCertificate();
  }, [params.id]);

  const handleShare = useCallback(async () => {
    if (!certificate) return;
    const text = t("shareText", { course: certificate.courseName });
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: t("title"), text, url });
      } catch {
        // User cancelled or not supported
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [certificate, t]);

  const handleCopyMint = useCallback(async () => {
    if (!certificate?.credentialMint) return;
    await navigator.clipboard.writeText(certificate.credentialMint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [certificate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Award className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold">Certificate Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8 md:py-12">
      {/* Visual Certificate */}
      <div ref={certRef}>
        <Card className="relative overflow-hidden border-2">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/5 via-transparent to-solana-green/5" />
          <CardContent className="relative p-8 sm:p-12">
            <div className="text-center">
              {/* Logo */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-solana">
                <Award className="h-8 w-8 text-white" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gradient-solana sm:text-3xl">
                {t("title")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{t("earnedBy")}</p>

              {/* Recipient */}
              <h2 className="mt-4 text-3xl font-display font-bold sm:text-4xl">
                {certificate.recipientName}
              </h2>

              {/* Course */}
              <div className="mt-6 inline-block rounded-lg border bg-muted/50 px-6 py-3">
                <p className="text-lg font-semibold">{certificate.courseName}</p>
              </div>

              {/* Date */}
              <p className="mt-6 text-sm text-muted-foreground">
                {t("completedOn", {
                  date: new Date(certificate.completedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                })}
              </p>

              {/* XP Badge */}
              <Badge variant="solana" className="mt-4">
                {t("xpEarned")}: {certificate.xpEarned.toLocaleString()} XP
              </Badge>

              {/* Verification Status */}
              {verification && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  {verification.valid ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-solana-green" />
                      <span className="text-sm text-solana-green">Verified on Solana</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Pending on-chain verification</span>
                    </>
                  )}
                </div>
              )}

              {/* Wallet Linking Notice */}
              {session?.user && !session.user.walletAddress && (
                <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Link a wallet to mint your certificate on-chain.
                  </p>
                  <Link href="/settings">
                    <Button variant="link" className="h-auto p-0 text-sm text-amber-800 dark:text-amber-200">
                      Go to Settings →
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={handleShare} variant="outline" className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {t("share")}
        </Button>
        {certificate.verificationUrl && (
          <a href={certificate.verificationUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              {t("verifyOnChain")}
            </Button>
          </a>
        )}
      </div>

      {/* Metadata */}
      {certificate.credentialMint && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{t("mintAddress")}</p>
                <code className="text-xs">{certificate.credentialMint}</code>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCopyMint}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
