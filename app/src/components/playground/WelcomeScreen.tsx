"use client";

import { useTranslations } from "next-intl";
import { FileCode2, Github, Upload, FolderUp } from "lucide-react";
import { WorkspaceTemplate } from "@/lib/playground/types";

interface WelcomeScreenProps {
  templates: WorkspaceTemplate[];
  onSelectTemplate: (template: WorkspaceTemplate) => void;
  onNewEmpty: () => void;
  onOpenGithubImport: () => void;
  onOpenFileUpload: () => void;
}

export function WelcomeScreen({
  templates,
  onSelectTemplate,
  onNewEmpty,
  onOpenGithubImport,
  onOpenFileUpload,
}: WelcomeScreenProps) {
  const t = useTranslations("playground");
  return (
    <div className="flex h-full items-center justify-center bg-[#1e1e1e] p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#d4d4d4]">{t("welcomeTitle")}</h1>
          <p className="mt-2 text-sm text-[#9d9d9d]">
            {t("welcomeSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-lg border border-[#323232] bg-[#252526] p-4 text-[#d4d4d4] transition hover:border-[#007acc] hover:bg-[#2a2d2e]"
            onClick={onNewEmpty}
          >
            <FileCode2 className="h-6 w-6 text-[#007acc]" />
            <span className="text-xs font-medium">{t("newEmpty")}</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-lg border border-[#323232] bg-[#252526] p-4 text-[#d4d4d4] transition hover:border-[#007acc] hover:bg-[#2a2d2e]"
            onClick={onOpenGithubImport}
          >
            <Github className="h-6 w-6 text-[#9d9d9d]" />
            <span className="text-xs font-medium">{t("githubImport")}</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-lg border border-[#323232] bg-[#252526] p-4 text-[#d4d4d4] transition hover:border-[#007acc] hover:bg-[#2a2d2e]"
            onClick={onOpenFileUpload}
          >
            <Upload className="h-6 w-6 text-[#9d9d9d]" />
            <span className="text-xs font-medium">{t("uploadFiles")}</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-lg border border-[#323232] bg-[#252526] p-4 text-[#d4d4d4] transition hover:border-[#007acc] hover:bg-[#2a2d2e]"
            onClick={onOpenFileUpload}
          >
            <FolderUp className="h-6 w-6 text-[#9d9d9d]" />
            <span className="text-xs font-medium">{t("uploadFolder")}</span>
          </button>
        </div>

        {templates.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium uppercase tracking-wide text-[#9d9d9d]">
              {t("templates")}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {templates.map((template) => (
                <button
                  type="button"
                  key={template.id}
                  className="rounded-lg border border-[#323232] bg-[#252526] p-3 text-left transition hover:border-[#007acc] hover:bg-[#2a2d2e]"
                  onClick={() => onSelectTemplate(template)}
                >
                  <p className="text-sm font-semibold text-[#d4d4d4]">{template.title}</p>
                  <p className="mt-1 text-xs text-[#9d9d9d]">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
