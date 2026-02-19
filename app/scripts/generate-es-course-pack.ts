import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import * as courseModule from "../src/lib/data/courses/index";
import type { Course } from "../src/types/content";
import type { CourseTranslationMap } from "../src/lib/i18n/course-translations/types";

const source = courseModule as unknown as {
  courses?: Course[];
  default?: { courses?: Course[] };
  "module.exports"?: { courses?: Course[] };
};

const sourceCourses =
  source.courses ?? source.default?.courses ?? source["module.exports"]?.courses ?? [];

if (sourceCourses.length === 0) {
  throw new Error("Unable to load course dataset for Spanish generation.");
}

const phraseMap: Array<[string, string]> = [
  ["mental model", "modelo mental"],
  ["Program Derived Addresses", "Direcciones Derivadas de Programa"],
  ["Program Derived Address", "Direccion Derivada de Programa"],
  ["cross-program invocation", "invocacion entre programas"],
  ["Cross-Program Invocation", "Invocacion entre Programas"],
  ["transaction", "transaccion"],
  ["transactions", "transacciones"],
  ["instruction", "instruccion"],
  ["instructions", "instrucciones"],
  ["account model", "modelo de cuentas"],
  ["accounts model", "modelo de cuentas"],
  ["account", "cuenta"],
  ["accounts", "cuentas"],
  ["wallet", "cartera"],
  ["wallets", "carteras"],
  ["validator", "validador"],
  ["validators", "validadores"],
  ["governance", "gobernanza"],
  ["staking", "staking"],
  ["liquidity", "liquidez"],
  ["slippage", "deslizamiento"],
  ["price impact", "impacto de precio"],
  ["fees", "comisiones"],
  ["fee", "comision"],
  ["risk", "riesgo"],
  ["reliability", "confiabilidad"],
  ["performance", "rendimiento"],
  ["security", "seguridad"],
  ["safety", "seguridad"],
  ["checkpoint", "checkpoint"],
  ["challenge", "desafio"],
  ["challenges", "desafios"],
  ["lesson", "leccion"],
  ["lessons", "lecciones"],
  ["module", "modulo"],
  ["modules", "modulos"],
  ["course", "curso"],
  ["courses", "cursos"],
  ["beginner", "principiante"],
  ["intermediate", "intermedio"],
  ["advanced", "avanzado"],
  ["overview", "vision general"],
  ["basics", "fundamentos"],
  ["deep dive", "analisis profundo"],
  ["why", "por que"],
  ["what", "que"],
  ["how", "como"],
  ["build", "construir"],
  ["testing", "pruebas"],
  ["deployment", "despliegue"],
  ["tooling", "herramientas"],
  ["design", "diseno"],
  ["state", "estado"],
  ["proof", "prueba"],
  ["report", "reporte"],
  ["optimization", "optimizacion"],
  ["pipeline", "pipeline"],
  ["indexing", "indexacion"],
  ["latency", "latencia"],
  ["throughput", "rendimiento"],
  ["debugging", "depuracion"],
  ["runtime", "runtime"],
  ["error", "error"],
  ["errors", "errores"],
  ["warning", "advertencia"],
  ["warnings", "advertencias"],
];

const wordMap: Record<string, string> = {
  the: "el",
  and: "y",
  or: "o",
  with: "con",
  without: "sin",
  for: "para",
  from: "desde",
  to: "a",
  in: "en",
  on: "en",
  by: "por",
  of: "de",
  this: "este",
  that: "ese",
  these: "estos",
  those: "esos",
  use: "usa",
  using: "usando",
  used: "usado",
  learn: "aprende",
  understanding: "comprension",
  practical: "practico",
  real: "real",
  production: "produccion",
  systems: "sistemas",
  system: "sistema",
  data: "datos",
  model: "modelo",
  patterns: "patrones",
  pattern: "patron",
  flows: "flujos",
  flow: "flujo",
  quality: "calidad",
  robust: "robusto",
  reliable: "confiable",
  secure: "seguro",
};

function replacePhrases(text: string): string {
  let output = text;
  for (const [from, to] of phraseMap) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    output = output.replace(new RegExp(escaped, "gi"), (match) => {
      if (match === match.toUpperCase()) {
        return to.toUpperCase();
      }
      if (match[0] === match[0].toUpperCase()) {
        return to[0].toUpperCase() + to.slice(1);
      }
      return to;
    });
  }
  return output;
}

function replaceWords(text: string): string {
  return text.replace(/\b([A-Za-z]+)\b/g, (token) => {
    const lower = token.toLowerCase();
    const translated = wordMap[lower];
    if (!translated) {
      return token;
    }
    if (token === token.toUpperCase()) {
      return translated.toUpperCase();
    }
    if (token[0] === token[0].toUpperCase()) {
      return translated[0].toUpperCase() + translated.slice(1);
    }
    return translated;
  });
}

function translateSegment(text: string): string {
  return replaceWords(replacePhrases(text));
}

function translateMarkdown(text: string): string {
  const fenceParts = text.split(/(```[\s\S]*?```)/g);
  return fenceParts
    .map((part) => {
      if (part.startsWith("```")) {
        return part;
      }
      const inlineParts = part.split(/(`[^`]*`)/g);
      return inlineParts
        .map((inline) => (inline.startsWith("`") && inline.endsWith("`") ? inline : translateSegment(inline)))
        .join("");
    })
    .join("");
}

function buildSpanishPack(): CourseTranslationMap {
  const pack: CourseTranslationMap = {};

  for (const course of sourceCourses) {
    pack[course.slug] = {
      title: translateSegment(course.title),
      description: translateSegment(course.description),
      duration: course.duration,
      tags: course.tags,
      modules: Object.fromEntries(
        course.modules.map((moduleItem) => [
          moduleItem.id,
          {
            title: translateSegment(moduleItem.title),
            description: translateSegment(moduleItem.description),
            lessons: Object.fromEntries(
              moduleItem.lessons.map((lesson) => [
                lesson.id,
                {
                  title: translateSegment(lesson.title),
                  content: translateMarkdown(lesson.content),
                  duration: lesson.duration,
                },
              ])
            ),
          },
        ])
      ),
    };
  }

  return pack;
}

const output = resolve(process.cwd(), "src/lib/i18n/course-translations/es.generated.ts");
mkdirSync(dirname(output), { recursive: true });

const generated = buildSpanishPack();
const fileContents = `import type { CourseTranslationMap } from "./types";\n\nexport const esGeneratedCourseTranslations: CourseTranslationMap = ${JSON.stringify(generated, null, 2)};\n`;
writeFileSync(output, fileContents);

console.log(`Generated Spanish course pack: ${output}`);
