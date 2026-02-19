import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import * as courseModule from "../src/lib/data/courses/index";
import type { Course } from "../src/types/content";
import type { CourseTranslationMap } from "../src/lib/i18n/course-translations/types";

type SupportedLocale = "es" | "pt-BR" | "fr" | "it" | "de" | "zh-CN" | "ar";

const supportedLocales: SupportedLocale[] = ["es", "pt-BR", "fr", "it", "de", "zh-CN", "ar"];

const source = courseModule as unknown as {
  courses?: Course[];
  default?: { courses?: Course[] };
  "module.exports"?: { courses?: Course[] };
};

const sourceCourses =
  source.courses ?? source.default?.courses ?? source["module.exports"]?.courses ?? [];

if (sourceCourses.length === 0) {
  throw new Error("Unable to load course dataset for localization generation.");
}

interface LocaleConfig {
  phraseMap: Array<[string, string]>;
  wordMap: Record<string, string>;
}

const localeConfigs: Record<SupportedLocale, LocaleConfig> = {
  es: {
    phraseMap: [
      ["Program Derived Addresses", "Direcciones Derivadas de Programa"],
      ["Program Derived Address", "Direccion Derivada de Programa"],
      ["Cross-Program Invocation", "Invocacion entre Programas"],
      ["cross-program invocation", "invocacion entre programas"],
      ["mental model", "modelo mental"],
      ["deep dive", "analisis profundo"],
      ["account model", "modelo de cuentas"],
      ["price impact", "impacto de precio"],
      ["getting started", "primeros pasos"],
      ["best practices", "mejores practicas"],
    ],
    wordMap: {
      course: "curso",
      courses: "cursos",
      module: "modulo",
      modules: "modulos",
      lesson: "leccion",
      lessons: "lecciones",
      beginner: "principiante",
      intermediate: "intermedio",
      advanced: "avanzado",
      basics: "fundamentos",
      overview: "vision general",
      learn: "aprende",
      practical: "practico",
      security: "seguridad",
      testing: "pruebas",
      deployment: "despliegue",
      performance: "rendimiento",
      design: "diseno",
      governance: "gobernanza",
      wallet: "cartera",
      wallets: "carteras",
      transaction: "transaccion",
      transactions: "transacciones",
      instruction: "instruccion",
      instructions: "instrucciones",
      account: "cuenta",
      accounts: "cuentas",
      validator: "validador",
      validators: "validadores",
      and: "y",
      with: "con",
      for: "para",
    },
  },
  "pt-BR": {
    phraseMap: [
      ["Program Derived Addresses", "Enderecos Derivados de Programa"],
      ["Program Derived Address", "Endereco Derivado de Programa"],
      ["Cross-Program Invocation", "Invocacao entre Programas"],
      ["cross-program invocation", "invocacao entre programas"],
      ["mental model", "modelo mental"],
      ["deep dive", "analise profunda"],
      ["account model", "modelo de contas"],
      ["price impact", "impacto no preco"],
      ["getting started", "primeiros passos"],
      ["best practices", "boas praticas"],
    ],
    wordMap: {
      course: "curso",
      courses: "cursos",
      module: "modulo",
      modules: "modulos",
      lesson: "licao",
      lessons: "licoes",
      beginner: "iniciante",
      intermediate: "intermediario",
      advanced: "avancado",
      basics: "fundamentos",
      overview: "visao geral",
      learn: "aprenda",
      practical: "pratico",
      security: "seguranca",
      testing: "testes",
      deployment: "implantacao",
      performance: "desempenho",
      design: "design",
      governance: "governanca",
      wallet: "carteira",
      wallets: "carteiras",
      transaction: "transacao",
      transactions: "transacoes",
      instruction: "instrucao",
      instructions: "instrucoes",
      account: "conta",
      accounts: "contas",
      validator: "validador",
      validators: "validadores",
      and: "e",
      with: "com",
      for: "para",
    },
  },
  fr: {
    phraseMap: [
      ["Program Derived Addresses", "Adresses Derivees de Programme"],
      ["Program Derived Address", "Adresse Derivee de Programme"],
      ["Cross-Program Invocation", "Invocation Inter-Programme"],
      ["cross-program invocation", "invocation inter-programme"],
      ["mental model", "modele mental"],
      ["deep dive", "analyse approfondie"],
      ["account model", "modele de compte"],
      ["price impact", "impact sur le prix"],
      ["getting started", "demarrage"],
      ["best practices", "bonnes pratiques"],
    ],
    wordMap: {
      course: "cours",
      courses: "cours",
      module: "module",
      modules: "modules",
      lesson: "lecon",
      lessons: "lecons",
      beginner: "debutant",
      intermediate: "intermediaire",
      advanced: "avance",
      basics: "bases",
      overview: "vue d'ensemble",
      learn: "apprenez",
      practical: "pratique",
      security: "securite",
      testing: "tests",
      deployment: "deploiement",
      performance: "performance",
      design: "conception",
      governance: "gouvernance",
      wallet: "portefeuille",
      wallets: "portefeuilles",
      transaction: "transaction",
      transactions: "transactions",
      instruction: "instruction",
      instructions: "instructions",
      account: "compte",
      accounts: "comptes",
      validator: "validateur",
      validators: "validateurs",
      and: "et",
      with: "avec",
      for: "pour",
    },
  },
  it: {
    phraseMap: [
      ["Program Derived Addresses", "Indirizzi Derivati dal Programma"],
      ["Program Derived Address", "Indirizzo Derivato dal Programma"],
      ["Cross-Program Invocation", "Invocazione tra Programmi"],
      ["cross-program invocation", "invocazione tra programmi"],
      ["mental model", "modello mentale"],
      ["deep dive", "analisi approfondita"],
      ["account model", "modello degli account"],
      ["price impact", "impatto sul prezzo"],
      ["getting started", "primi passi"],
      ["best practices", "best practice"],
    ],
    wordMap: {
      course: "corso",
      courses: "corsi",
      module: "modulo",
      modules: "moduli",
      lesson: "lezione",
      lessons: "lezioni",
      beginner: "principiante",
      intermediate: "intermedio",
      advanced: "avanzato",
      basics: "fondamenti",
      overview: "panoramica",
      learn: "impara",
      practical: "pratico",
      security: "sicurezza",
      testing: "test",
      deployment: "distribuzione",
      performance: "prestazioni",
      design: "progettazione",
      governance: "governance",
      wallet: "wallet",
      wallets: "wallet",
      transaction: "transazione",
      transactions: "transazioni",
      instruction: "istruzione",
      instructions: "istruzioni",
      account: "account",
      accounts: "account",
      validator: "validatore",
      validators: "validatori",
      and: "e",
      with: "con",
      for: "per",
    },
  },
  de: {
    phraseMap: [
      ["Program Derived Addresses", "Programmabgeleitete Adressen"],
      ["Program Derived Address", "Programmabgeleitete Adresse"],
      ["Cross-Program Invocation", "Programmuebergreifender Aufruf"],
      ["cross-program invocation", "programmuebergreifender aufruf"],
      ["mental model", "mentales modell"],
      ["deep dive", "tiefenanalyse"],
      ["account model", "kontenmodell"],
      ["price impact", "preiseinfluss"],
      ["getting started", "erste schritte"],
      ["best practices", "best practices"],
    ],
    wordMap: {
      course: "kurs",
      courses: "kurse",
      module: "modul",
      modules: "module",
      lesson: "lektion",
      lessons: "lektionen",
      beginner: "anfaenger",
      intermediate: "mittelstufe",
      advanced: "fortgeschritten",
      basics: "grundlagen",
      overview: "ueberblick",
      learn: "lerne",
      practical: "praktisch",
      security: "sicherheit",
      testing: "tests",
      deployment: "bereitstellung",
      performance: "leistung",
      design: "design",
      governance: "governance",
      wallet: "wallet",
      wallets: "wallets",
      transaction: "transaktion",
      transactions: "transaktionen",
      instruction: "anweisung",
      instructions: "anweisungen",
      account: "konto",
      accounts: "konten",
      validator: "validator",
      validators: "validatoren",
      and: "und",
      with: "mit",
      for: "fuer",
    },
  },
  "zh-CN": {
    phraseMap: [
      ["Program Derived Addresses", "程序派生地址"],
      ["Program Derived Address", "程序派生地址"],
      ["Cross-Program Invocation", "跨程序调用"],
      ["cross-program invocation", "跨程序调用"],
      ["mental model", "思维模型"],
      ["deep dive", "深入解析"],
      ["account model", "账户模型"],
      ["price impact", "价格影响"],
      ["getting started", "快速入门"],
      ["best practices", "最佳实践"],
    ],
    wordMap: {
      course: "课程",
      courses: "课程",
      module: "模块",
      modules: "模块",
      lesson: "课时",
      lessons: "课时",
      beginner: "初级",
      intermediate: "中级",
      advanced: "高级",
      basics: "基础",
      overview: "概览",
      learn: "学习",
      practical: "实战",
      security: "安全",
      testing: "测试",
      deployment: "部署",
      performance: "性能",
      design: "设计",
      governance: "治理",
      wallet: "钱包",
      wallets: "钱包",
      transaction: "交易",
      transactions: "交易",
      instruction: "指令",
      instructions: "指令",
      account: "账户",
      accounts: "账户",
      validator: "验证者",
      validators: "验证者",
      and: "和",
      with: "使用",
      for: "用于",
    },
  },
  ar: {
    phraseMap: [
      ["Program Derived Addresses", "عناوين مشتقة من البرنامج"],
      ["Program Derived Address", "عنوان مشتق من البرنامج"],
      ["Cross-Program Invocation", "استدعاء بين البرامج"],
      ["cross-program invocation", "استدعاء بين البرامج"],
      ["mental model", "النموذج الذهني"],
      ["deep dive", "تحليل معمق"],
      ["account model", "نموذج الحسابات"],
      ["price impact", "تأثير السعر"],
      ["getting started", "البدء"],
      ["best practices", "افضل الممارسات"],
    ],
    wordMap: {
      course: "دورة",
      courses: "دورات",
      module: "وحدة",
      modules: "وحدات",
      lesson: "درس",
      lessons: "دروس",
      beginner: "مبتدئ",
      intermediate: "متوسط",
      advanced: "متقدم",
      basics: "الاساسيات",
      overview: "نظرة عامة",
      learn: "تعلم",
      practical: "عملي",
      security: "الامان",
      testing: "الاختبار",
      deployment: "النشر",
      performance: "الاداء",
      design: "التصميم",
      governance: "الحوكمة",
      wallet: "محفظة",
      wallets: "محافظ",
      transaction: "معاملة",
      transactions: "معاملات",
      instruction: "تعليمة",
      instructions: "تعليمات",
      account: "حساب",
      accounts: "حسابات",
      validator: "مدقق",
      validators: "مدققون",
      and: "و",
      with: "مع",
      for: "ل",
    },
  },
};

function replacePhrases(text: string, phraseMap: Array<[string, string]>): string {
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

function replaceWords(text: string, wordMap: Record<string, string>): string {
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

function translateSegment(text: string, config: LocaleConfig): string {
  return replaceWords(replacePhrases(text, config.phraseMap), config.wordMap);
}

function translateMarkdown(text: string, config: LocaleConfig): string {
  const fenceParts = text.split(/(```[\s\S]*?```)/g);
  return fenceParts
    .map((part) => {
      if (part.startsWith("```")) {
        return part;
      }

      const inlineParts = part.split(/(`[^`]*`)/g);
      return inlineParts
        .map((inline) =>
          inline.startsWith("`") && inline.endsWith("`")
            ? inline
            : translateSegment(inline, config)
        )
        .join("");
    })
    .join("");
}

function buildCoursePack(locale: SupportedLocale): CourseTranslationMap {
  const config = localeConfigs[locale];
  const pack: CourseTranslationMap = {};

  for (const course of sourceCourses) {
    pack[course.slug] = {
      title: translateSegment(course.title, config),
      description: translateSegment(course.description, config),
      duration: course.duration,
      tags: course.tags,
      modules: Object.fromEntries(
        course.modules.map((moduleItem) => [
          moduleItem.id,
          {
            title: translateSegment(moduleItem.title, config),
            description: translateSegment(moduleItem.description, config),
            lessons: Object.fromEntries(
              moduleItem.lessons.map((lesson) => [
                lesson.id,
                {
                  title: translateSegment(lesson.title, config),
                  content: translateMarkdown(lesson.content, config),
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

const generatedConstantNames: Record<SupportedLocale, string> = {
  es: "esGeneratedCourseTranslations",
  "pt-BR": "ptBrGeneratedCourseTranslations",
  fr: "frGeneratedCourseTranslations",
  it: "itGeneratedCourseTranslations",
  de: "deGeneratedCourseTranslations",
  "zh-CN": "zhCnGeneratedCourseTranslations",
  ar: "arGeneratedCourseTranslations",
};

function generateLocale(locale: SupportedLocale): void {
  const output = resolve(process.cwd(), `src/lib/i18n/course-translations/${locale}.generated.ts`);
  mkdirSync(dirname(output), { recursive: true });

  const generated = buildCoursePack(locale);
  const constName = generatedConstantNames[locale];
  const fileContents = `import type { CourseTranslationMap } from "./types";\n\nexport const ${constName}: CourseTranslationMap = ${JSON.stringify(generated, null, 2)};\n`;
  writeFileSync(output, fileContents);
  console.log(`Generated ${locale} course pack: ${output}`);
}

const args = process.argv.slice(2);
const target = args[0];

if (!target || target === "all") {
  supportedLocales.forEach(generateLocale);
} else {
  if (!supportedLocales.includes(target as SupportedLocale)) {
    throw new Error(`Unsupported locale "${target}". Expected one of: ${supportedLocales.join(", ")}`);
  }
  generateLocale(target as SupportedLocale);
}
