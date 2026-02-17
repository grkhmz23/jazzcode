"use client";

import { HubComponent } from "@/lib/component-hub/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpRight, Sparkles, Wrench, Coins, Image, BarChart3, ArrowRightLeft } from "lucide-react";

const categoryIcons = {
  wallet: Wrench,
  tokens: Coins,
  swap: ArrowRightLeft,
  nfts: Image,
  "dev-tools": Wrench,
  analytics: BarChart3,
};

const categoryColors: Record<string, string> = {
  wallet: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  tokens: "bg-green-500/10 text-green-400 border-green-500/20",
  swap: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  nfts: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "dev-tools": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  analytics: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

interface ComponentCardProps {
  component: HubComponent;
  onClick: () => void;
}

export function ComponentCard({ component, onClick }: ComponentCardProps) {
  const Icon = categoryIcons[component.category];

  return (
    <Card
      className="group cursor-pointer border-zinc-800 bg-zinc-950 transition-all hover:border-zinc-700 hover:bg-zinc-900"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`rounded-lg p-2 ${categoryColors[component.category]}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                {component.name}
              </h3>
              <Badge variant="outline" className="text-xs capitalize border-zinc-700 text-zinc-400">
                {component.category.replace("-", " ")}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {component.isNew && (
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">New</Badge>
            )}
            {component.isFeatured && (
              <Sparkles className="h-4 w-4 text-amber-400" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
          {component.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {component.dependencies.slice(0, 3).map((dep) => (
              <span
                key={dep.name}
                className="text-xs px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500"
              >
                {dep.name.split("/").pop()?.slice(0, 10)}
              </span>
            ))}
            {component.dependencies.length > 3 && (
              <span className="text-xs text-zinc-600">
                +{component.dependencies.length - 3}
              </span>
            )}
          </div>
          <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-purple-400 transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
}
