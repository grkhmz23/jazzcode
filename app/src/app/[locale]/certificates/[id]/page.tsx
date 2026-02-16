"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import {
  ExternalLink,
  Share2,
  Loader2,
  Award,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Shield,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import type { Certificate } from "@/types";
import type { OnChainCredential } from "@/lib/services/onchain";

interface VerificationResult {
  verified: boolean;
  currentOwner: string | null;
  heliusAvailable: boolean;
}

export default function CertificatePage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const t = useTranslations("certificate");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [verification, setVerification] = useState<{ valid: boolean; owner: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  // On-chain credential state
  const [credential, setCredential] = useState<OnChainCredential | null>(null);
  const [isLoadingCredential, setIsLoadingCredential] = useState(true);
  const [credentialError, setCredentialError] = useState<string | null>(null);

  // Ownership verification state
  const [ownershipVerification, setOwnershipVerification] = useState<VerificationResult | null>(null);
  const [isVerifyingOwnership, setIsVerifyingOwnership] = useState(false);

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

          // Fetch on-chain credential if wallet is available
          if (data.certificate.recipientWallet) {
            await fetchOnChainCredential(
              data.certificate.recipientWallet,
              data.certificate.courseId
            );
          } else {
            setIsLoadingCredential(false);
          }
        }
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchOnChainCredential(walletAddress: string, courseId: string) {
      try {
        const response = await fetch(
          `/api/onchain/credentials?wallet=${encodeURIComponent(walletAddress)}`
        );
        if (response.ok) {
          const data = (await response.json()) as {
            data: {
              credentials: OnChainCredential[];
              heliusAvailable: boolean;
            };
          };

          // Find credential matching this course
          // Match by course name in trackName or name
          const matchingCredential = data.data.credentials.find(
            (cred) =>
              cred.trackName.toLowerCase().includes(courseId.toLowerCase()) ||
              cred.name.toLowerCase().includes(courseId.toLowerCase())
          );

          if (matchingCredential) {
            setCredential(matchingCredential);
          }
        }
      } catch (err) {
        console.error("Failed to fetch credential:", err);
        setCredentialError("Failed to fetch on-chain credential");
      } finally {
        setIsLoadingCredential(false);
      }
    }

    void fetchCertificate();
  }, [params.id]);

  const handleShare = useCallback(async () => {
    if (!certificate) return;

    // Track certificate share
    trackEvent("share_certificate", "certificates", params.id);

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
  }, [certificate, params.id, t]);

  const handleCopyMint = useCallback(async () => {
    const mintAddress = credential?.mintAddress || certificate?.credentialMint;
    if (!mintAddress) return;
    await navigator.clipboard.writeText(mintAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [credential?.mintAddress, certificate?.credentialMint]);

  const handleVerifyOnChain = useCallback(async () => {
    if (!credential || !certificate?.recipientWallet) return;

    // Open Solana Explorer to verify
    window.open(
      `https://explorer.solana.com/address/${credential.mintAddress}?cluster=devnet`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [credential, certificate?.recipientWallet]);

  const handleVerifyOwnership = useCallback(async () => {
    if (!credential || !certificate?.recipientWallet) return;

    setIsVerifyingOwnership(true);
    try {
      const response = await fetch(
        `/api/onchain/verify?assetId=${encodeURIComponent(credential.id)}&owner=${encodeURIComponent(certificate.recipientWallet)}`
      );
      if (response.ok) {
        const data = (await response.json()) as { data: VerificationResult };
        setOwnershipVerification(data.data);
      } else {
        setOwnershipVerification({
          verified: false,
          currentOwner: null,
          heliusAvailable: false,
        });
      }
    } catch (err) {
      console.error("Failed to verify ownership:", err);
      setOwnershipVerification({
        verified: false,
        currentOwner: null,
        heliusAvailable: false,
      });
    } finally {
      setIsVerifyingOwnership(false);
    }
  }, [credential, certificate?.recipientWallet]);

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

  const hasOnChainCredential = !!credential;

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
                  {verification.valid || hasOnChainCredential ? (
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

      {/* On-Chain Credential Details */}
      {isLoadingCredential ? (
        <Card className="mt-6">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/3" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      ) : hasOnChainCredential ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-solana-green" />
              On-Chain Credential
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Credential Image */}
            {credential?.imageUrl && (
              <div className="flex justify-center">
                <Image
                  src={credential.imageUrl}
                  alt={credential.name}
                  width={128}
                  height={128}
                  className="rounded-lg object-cover"
                />
              </div>
            )}

            {/* Credential Details */}
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{credential?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Track</span>
                <span className="font-medium">{credential?.trackName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Level</span>
                <Badge variant="outline">{credential?.level}</Badge>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Mint Address</span>
                <code className="text-xs">
                  {credential?.mintAddress.slice(0, 8)}...
                  {credential?.mintAddress.slice(-8)}
                </code>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Owner</span>
                <code className="text-xs">
                  {credential?.owner.slice(0, 8)}...{credential?.owner.slice(-8)}
                </code>
              </div>
              {credential?.collection && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Collection</span>
                  <code className="text-xs">
                    {credential?.collection.slice(0, 8)}...
                    {credential?.collection.slice(-8)}
                  </code>
                </div>
              )}
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">
                  {credential?.compressed ? "Compressed NFT (cNFT)" : "Standard NFT"}
                </span>
              </div>
              {credential?.metadataUri && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Metadata URI</span>
                  <a
                    href={credential.metadataUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    View JSON
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Ownership Verification Section */}
            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-medium">Ownership Verification</h4>
              
              {!ownershipVerification ? (
                <Button
                  onClick={handleVerifyOwnership}
                  disabled={isVerifyingOwnership}
                  variant="outline"
                  className="w-full gap-2"
                >
                  {isVerifyingOwnership ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Verify Ownership
                    </>
                  )}
                </Button>
              ) : ownershipVerification.heliusAvailable ? (
                ownershipVerification.verified ? (
                  <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/30">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Ownership Verified ✓
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Current owner: {ownershipVerification.currentOwner?.slice(0, 8)}...
                        {ownershipVerification.currentOwner?.slice(-8)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950/30">
                    <ShieldAlert className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Could Not Verify
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        {ownershipVerification.currentOwner ? (
                          <>
                            Asset owned by: {ownershipVerification.currentOwner.slice(0, 8)}...
                            {ownershipVerification.currentOwner.slice(-8)}
                          </>
                        ) : (
                          "Asset not found or ownership mismatch"
                        )}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/50">
                  <HelpCircle className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      On-chain verification unavailable
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Helius API key not configured
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleVerifyOnChain}
                variant="outline"
                className="flex-1 gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View on Explorer
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopyMint}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : credentialError ? (
        <Card className="mt-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
          <CardContent className="py-4">
            <p className="text-sm text-red-600 dark:text-red-400">
              {credentialError}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              On-chain verification available after program deployment
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your certificate is saved locally and will be minted once the credential
              program is live on devnet.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Legacy Mint Address (if exists but no full credential data) */}
      {!hasOnChainCredential && certificate.credentialMint && (
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
