"use client";

import { useState, useMemo } from "react";
import { componentRegistry, categories, getFeaturedComponents, HubComponent, ComponentCategory } from "@/lib/component-hub/registry";
import { ComponentCard } from "@/components/solana/ComponentCard";
import { ComponentDetail } from "@/components/solana/ComponentDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Wrench, Coins, Image, BarChart3, ArrowRightLeft } from "lucide-react";

const categoryIcons: Record<ComponentCategory, typeof Search> = {
  wallet: Wrench,
  tokens: Coins,
  swap: ArrowRightLeft,
  nfts: Image,
  "dev-tools": Wrench,
  analytics: BarChart3,
};

export default function ComponentsPage() {
  const [selectedComponent, setSelectedComponent] = useState<HubComponent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | "all">("all");

  const filteredComponents = useMemo(() => {
    let filtered = componentRegistry;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const featuredComponents = useMemo(() => getFeaturedComponents(), []);

  if (selectedComponent) {
    return (
      <ComponentDetail
        component={selectedComponent}
        onBack={() => setSelectedComponent(null)}
      />
    );
  }

  return (
    <section className="container py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Component Hub</h1>
        <p className="mt-2 text-zinc-400">
          Production-ready Solana components. Copy, install, or open in Playground.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={selectedCategory}
        onValueChange={(v) => setSelectedCategory(v as ComponentCategory | "all")}
        className="mb-8"
      >
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id];
            return (
              <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {cat.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Featured Section (only on 'all' tab) */}
        {selectedCategory === "all" && !searchQuery && (
          <TabsContent value="all" className="mt-6">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-white">Featured Components</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featuredComponents.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    onClick={() => setSelectedComponent(component)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        )}

        {/* All Components Grid */}
        <TabsContent value={selectedCategory} className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {selectedCategory === "all" ? "All Components" : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <Badge variant="secondary">{filteredComponents.length}</Badge>
          </div>

          {filteredComponents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center">
              <p className="text-zinc-500">No components found</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredComponents.map((component) => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  onClick={() => setSelectedComponent(component)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
