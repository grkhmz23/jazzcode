import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import { ContentLocalService } from "../src/lib/services/content-local";
import { defaultLocale, locales, type Locale } from "../src/lib/i18n/routing";

type UiFinding = {
  file: string;
  line: number;
  kind: "jsx_text" | "jsx_attr";
  text: string;
};

type LocaleReport = {
  locale: Locale;
  exactEnglishMatches: Array<{ path: string; text: string }>;
  englishLikeMatches: Array<{ path: string; englishWordCount: number; excerpt: string }>;
  totals: {
    exactEnglishCount: number;
    englishLikeCount: number;
  };
};

type AuditReport = {
  generatedAt: string;
  locales: LocaleReport[];
  uiHardcodedStrings: UiFinding[];
  summary: {
    uiHardcodedCount: number;
    byLocale: Record<string, { exactEnglishCount: number; englishLikeCount: number }>;
  };
};

const WORKSPACE_APP = process.cwd();
const MAX_TEXT_PREVIEW = 220;
const ENGLISH_WORD_RE = /\b[A-Za-z]{3,}\b/g;
const USER_ATTRS = new Set([
  "placeholder",
  "title",
  "alt",
  "aria-label",
  "aria-description",
  "aria-placeholder",
  "label",
]);
const EXCLUDED_ATTRS = new Set([
  "className",
  "id",
  "key",
  "name",
  "type",
  "value",
  "variant",
  "size",
  "href",
  "src",
  "role",
  "target",
  "rel",
]);

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function clip(text: string): string {
  const normalized = normalize(text);
  return normalized.length > MAX_TEXT_PREVIEW
    ? `${normalized.slice(0, MAX_TEXT_PREVIEW)}...`
    : normalized;
}

function countEnglishWords(text: string): number {
  const words = text.match(ENGLISH_WORD_RE);
  return words ? words.length : 0;
}

function shouldTrackEnglishLike(locale: Locale, text: string): boolean {
  if (locale === "en") return false;
  const count = countEnglishWords(text);
  return count >= 12;
}

function shouldSkipPath(path: string): boolean {
  return (
    /\.(id|slug|language|starterCode|solution|cmd|path|href|src|url|uri|mint|owner|address|programId|signature|hash|file|filename|ext|type|kind|label|name|key|value|input|output|expected|actual|imageUrl)$/.test(
      path
    ) ||
    /\.testCases(\[|$)/.test(path)
  );
}

function walkCompare(
  locale: Locale,
  localizedValue: unknown,
  englishValue: unknown,
  path: string,
  exactEnglishMatches: Array<{ path: string; text: string }>,
  englishLikeMatches: Array<{ path: string; englishWordCount: number; excerpt: string }>
): void {
  if (typeof localizedValue === "string" && typeof englishValue === "string") {
    if (shouldSkipPath(path)) {
      return;
    }

    const loc = normalize(localizedValue);
    const en = normalize(englishValue);

    if (loc.length === 0 || en.length === 0) {
      return;
    }

    if (loc === en && countEnglishWords(loc) >= 4) {
      exactEnglishMatches.push({ path, text: clip(localizedValue) });
      return;
    }

    if (shouldTrackEnglishLike(locale, localizedValue)) {
      englishLikeMatches.push({
        path,
        englishWordCount: countEnglishWords(localizedValue),
        excerpt: clip(localizedValue),
      });
    }

    return;
  }

  if (Array.isArray(localizedValue) && Array.isArray(englishValue)) {
    const len = Math.min(localizedValue.length, englishValue.length);
    for (let i = 0; i < len; i += 1) {
      walkCompare(
        locale,
        localizedValue[i],
        englishValue[i],
        `${path}[${i}]`,
        exactEnglishMatches,
        englishLikeMatches
      );
    }
    return;
  }

  if (
    localizedValue &&
    englishValue &&
    typeof localizedValue === "object" &&
    typeof englishValue === "object"
  ) {
    const localizedEntries = localizedValue as Record<string, unknown>;
    const englishEntries = englishValue as Record<string, unknown>;
    for (const key of Object.keys(localizedEntries)) {
      if (!(key in englishEntries)) continue;
      walkCompare(
        locale,
        localizedEntries[key],
        englishEntries[key],
        `${path}.${key}`,
        exactEnglishMatches,
        englishLikeMatches
      );
    }
  }
}

function listFilesRecursively(root: string): string[] {
  const out: string[] = [];
  const stack = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
        out.push(fullPath);
      }
    }
  }

  return out;
}

function looksUserFacing(text: string): boolean {
  const trimmed = normalize(text);
  if (trimmed.length < 2) return false;
  if (!/[A-Za-z]/.test(trimmed)) return false;
  if (/^[A-Za-z0-9_./:-]+$/.test(trimmed) && !trimmed.includes(" ")) return false;
  return true;
}

function collectUiHardcodedStrings(): UiFinding[] {
  const targets = [
    join(WORKSPACE_APP, "src", "app", "[locale]"),
    join(WORKSPACE_APP, "src", "components"),
  ];

  const findings: UiFinding[] = [];

  for (const target of targets) {
    const files = listFilesRecursively(target);

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

      function visit(node: ts.Node): void {
        if (ts.isJsxText(node)) {
          const text = normalize(node.getText(sf));
          if (looksUserFacing(text)) {
            const pos = sf.getLineAndCharacterOfPosition(node.getStart(sf));
            findings.push({
              file: relative(WORKSPACE_APP, file),
              line: pos.line + 1,
              kind: "jsx_text",
              text,
            });
          }
        }

        if (ts.isJsxAttribute(node)) {
          const attrName = node.name.getText(sf);
          const init = node.initializer;

          if (!init || !ts.isStringLiteral(init)) {
            ts.forEachChild(node, visit);
            return;
          }

          const value = normalize(init.text);
          if (!looksUserFacing(value)) {
            ts.forEachChild(node, visit);
            return;
          }

          if (EXCLUDED_ATTRS.has(attrName)) {
            ts.forEachChild(node, visit);
            return;
          }

          if (!USER_ATTRS.has(attrName)) {
            ts.forEachChild(node, visit);
            return;
          }

          const pos = sf.getLineAndCharacterOfPosition(node.getStart(sf));
          findings.push({
            file: relative(WORKSPACE_APP, file),
            line: pos.line + 1,
            kind: "jsx_attr",
            text: `${attrName}=${value}`,
          });
        }

        ts.forEachChild(node, visit);
      }

      visit(sf);
    }
  }

  // De-duplicate exact same finding instances.
  const seen = new Set<string>();
  return findings.filter((item) => {
    const key = `${item.file}:${item.line}:${item.kind}:${item.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function run(): Promise<void> {
  const service = new ContentLocalService();
  const englishCourses = await service.getCourses(defaultLocale);
  const englishBySlug = new Map(englishCourses.map((course) => [course.slug, course]));

  const localeReports: LocaleReport[] = [];

  for (const locale of locales) {
    if (locale === defaultLocale) continue;

    const localizedCourses = await service.getCourses(locale);
    const exactEnglishMatches: Array<{ path: string; text: string }> = [];
    const englishLikeMatches: Array<{ path: string; englishWordCount: number; excerpt: string }> = [];

    for (const localizedCourse of localizedCourses) {
      const englishCourse = englishBySlug.get(localizedCourse.slug);
      if (!englishCourse) continue;

      walkCompare(
        locale,
        localizedCourse,
        englishCourse,
        `courses.${localizedCourse.slug}`,
        exactEnglishMatches,
        englishLikeMatches
      );
    }

    localeReports.push({
      locale,
      exactEnglishMatches,
      englishLikeMatches,
      totals: {
        exactEnglishCount: exactEnglishMatches.length,
        englishLikeCount: englishLikeMatches.length,
      },
    });
  }

  const uiHardcodedStrings = collectUiHardcodedStrings();

  const report: AuditReport = {
    generatedAt: new Date().toISOString(),
    locales: localeReports,
    uiHardcodedStrings,
    summary: {
      uiHardcodedCount: uiHardcodedStrings.length,
      byLocale: Object.fromEntries(
        localeReports.map((item) => [
          item.locale,
          {
            exactEnglishCount: item.totals.exactEnglishCount,
            englishLikeCount: item.totals.englishLikeCount,
          },
        ])
      ),
    },
  };

  const outputDir = join(WORKSPACE_APP, "tmp", "reports");
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, "localization-smoke-audit.json");
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Wrote ${outputPath}`);
  console.log(`UI hardcoded strings: ${report.summary.uiHardcodedCount}`);
  for (const localeReport of report.locales) {
    console.log(
      `${localeReport.locale}: exactEnglish=${localeReport.totals.exactEnglishCount}, englishLike=${localeReport.totals.englishLikeCount}`
    );
  }
}

run().catch((error) => {
  console.error("Localization smoke audit failed:", error);
  process.exit(1);
});
