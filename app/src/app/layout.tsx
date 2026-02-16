import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Superteam Academy - Interactive Solana Developer Education",
    template: "%s | Superteam Academy",
  },
  description:
    "Master Solana development with interactive courses, on-chain credentials, and gamified progression. From zero to production-ready dApps.",
  keywords: ["Solana", "blockchain", "education", "Web3", "developer", "learn", "courses"],
  openGraph: {
    title: "Superteam Academy",
    description: "Interactive Solana Developer Education Platform",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
