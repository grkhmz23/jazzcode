"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { HubComponent } from "@/lib/component-hub/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, Play, Package, Code, FileCode, Terminal, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ComponentDetailProps {
  component: HubComponent;
  onBack: () => void;
}

export function ComponentDetail({ component, onBack }: ComponentDetailProps) {
  const t = useTranslations("components");
  const tc = useTranslations("common");
  // All hooks must be at the top level
  const [selectedFile, setSelectedFile] = useState(component.files[0]?.path || "");
  const [copied, setCopied] = useState(false);
  const [isCreatingShare, setIsCreatingShare] = useState(false);
  const [activeProps, setActiveProps] = useState<Record<string, unknown>>(() => {
    // Initialize props with defaults
    const defaults: Record<string, unknown> = {};
    component.props.forEach((prop) => {
      if (prop.defaultValue !== undefined) {
        defaults[prop.name] = prop.defaultValue;
      }
    });
    return defaults;
  });

  const selectedFileContent = useMemo(() => {
    return component.files.find((f) => f.path === selectedFile)?.content || "";
  }, [component.files, selectedFile]);

  const installCommand = `jazzcode add ${component.id}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(selectedFileContent);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const copyInstallCommand = async () => {
    await navigator.clipboard.writeText(installCommand);
    toast.success("Install command copied!");
  };

  const openInPlayground = async () => {
    setIsCreatingShare(true);
    try {
      // Build bundle from component
      const bundle = {
        id: component.id,
        title: component.name,
        description: component.description,
        files: component.files,
        dependencies: component.dependencies,
        props: component.props,
        permissions: component.permissions,
        defaultProps: activeProps,
        notes: component.productionNotes?.map(n => `${n.title}: ${n.content}`).join("\n"),
      };

      // Create share via API
      const response = await fetch("/api/playground/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bundle),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create share");
      }

      const { shareId } = await response.json();
      window.open(`/playground?share=${shareId}`, "_blank");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to open in playground";
      toast.error(message);
    } finally {
      setIsCreatingShare(false);
    }
  };

  const renderPropsPanel = () => (
    <div className="space-y-4">
      {component.props.length === 0 ? (
        <p className="text-sm text-zinc-500">{t("noPropsAvailable")}</p>
      ) : (
        component.props.map((prop) => (
          <div key={prop.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">{prop.name}</label>
              <div className="flex items-center gap-2">
                <code className="text-xs text-purple-400">{prop.type}</code>
                {prop.required && <Badge className="text-xs bg-red-500/20 text-red-400">Required</Badge>}
              </div>
            </div>
            <p className="text-xs text-zinc-500">{prop.description}</p>
            {prop.type === "boolean" ? (
              <select
                value={String(activeProps[prop.name] ?? prop.defaultValue ?? false)}
                onChange={(e) =>
                  setActiveProps({ ...activeProps, [prop.name]: e.target.value === "true" })
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            ) : prop.type === "number" ? (
              <input
                type="number"
                value={(activeProps[prop.name] as number) ?? prop.defaultValue ?? ""}
                onChange={(e) =>
                  setActiveProps({ ...activeProps, [prop.name]: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
              />
            ) : (
              <input
                type="text"
                value={(activeProps[prop.name] as string) ?? prop.defaultValue ?? ""}
                onChange={(e) =>
                  setActiveProps({ ...activeProps, [prop.name]: e.target.value })
                }
                placeholder={prop.defaultValue?.toString()}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600"
              />
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tc("back")}
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{component.name}</h1>
            {component.isNew && <Badge className="bg-green-500/20 text-green-400">New</Badge>}
            {component.isFeatured && <Badge className="bg-amber-500/20 text-amber-400">Featured</Badge>}
          </div>
          <p className="text-zinc-400">{component.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={copyInstallCommand}>
            <Package className="mr-2 h-4 w-4" />
            {t("copyInstall")}
          </Button>
          <Button 
            onClick={openInPlayground} 
            disabled={isCreatingShare}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isCreatingShare ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {t("openInPlayground")}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Preview & Code - 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">
                <Play className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code">
                <Code className="mr-2 h-4 w-4" />
                Code
              </TabsTrigger>
              <TabsTrigger value="install">
                <Terminal className="mr-2 h-4 w-4" />
                Install
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 min-h-[400px]">
                <div className="flex items-center justify-center h-full text-zinc-500">
                  <div className="text-center">
                    <Play className="mx-auto h-12 w-12 mb-4 text-zinc-700" />
                    <p>{t("interactivePreviewSoon")}</p>
                    <p className="text-sm">{t("openInPlaygroundForLivePreview")}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="mt-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950">
                <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
                  <div className="flex items-center gap-2">
                    {component.files.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFile(file.path)}
                        className={`flex items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors ${
                          selectedFile === file.path
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <FileCode className="h-3.5 w-3.5" />
                        {file.path}
                      </button>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={copyCode}>
                    {copied ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                        {t("copied")}
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        {tc("copy")}
                      </>
                    )}
                  </Button>
                </div>
                <pre className="overflow-auto p-4 text-sm">
                  <code className="text-zinc-300">{selectedFileContent}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="install" className="mt-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                <h3 className="mb-4 font-semibold text-white">{t("installTitle")}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm text-zinc-400">{t("cliInstall")}</label>
                    <div className="flex gap-2">
                      <code className="flex-1 rounded-lg bg-zinc-900 px-4 py-3 font-mono text-sm text-white">
                        {installCommand}
                      </code>
                      <Button variant="outline" onClick={copyInstallCommand}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-zinc-400">{t("dependencies")}</label>
                    <div className="flex flex-wrap gap-2">
                      {component.dependencies.map((dep) => (
                        <Badge key={dep.name} variant="secondary" className="text-xs">
                          {dep.name}@{dep.version}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-zinc-400">{t("requiredPermissions")}</label>
                    <div className="flex flex-wrap gap-2">
                      {component.permissions.map((perm) => (
                        <Badge
                          key={perm.type}
                          className={`text-xs ${
                            perm.required
                              ? "bg-red-500/20 text-red-400"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {perm.type}
                          {perm.required && " *"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Production Notes */}
          {component.productionNotes.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
              <h3 className="mb-4 font-semibold text-white">{t("productionNotes")}</h3>
              <div className="space-y-3">
                {component.productionNotes.map((note, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border p-4 ${
                      note.type === "security"
                        ? "border-red-500/20 bg-red-500/10"
                        : note.type === "performance"
                        ? "border-amber-500/20 bg-amber-500/10"
                        : "border-blue-500/20 bg-blue-500/10"
                    }`}
                  >
                    <h4
                      className={`text-sm font-medium ${
                        note.type === "security"
                          ? "text-red-400"
                          : note.type === "performance"
                          ? "text-amber-400"
                          : "text-blue-400"
                      }`}
                    >
                      {note.title}
                    </h4>
                    <p className="mt-1 text-sm text-zinc-400">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Props Panel - 1/3 width */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="mb-4 font-semibold text-white">Props</h3>
            {renderPropsPanel()}
          </div>

          {/* Examples */}
          {component.examples.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
              <h3 className="mb-4 font-semibold text-white">Examples</h3>
              <div className="space-y-3">
                {component.examples.map((example, i) => (
                  <div key={i} className="rounded-lg bg-zinc-900 p-3">
                    <h4 className="text-sm font-medium text-white">{example.name}</h4>
                    <p className="text-xs text-zinc-500">{example.description}</p>
                    <pre className="mt-2 overflow-auto rounded bg-zinc-950 p-2 text-xs">
                      <code className="text-zinc-400">{example.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
