import { z } from "zod";

// Course manifests define lesson sequencing and runtime behavior for Learn V2.
export type LessonType =
  | "interactive-code"
  | "visual-explorer"
  | "quiz"
  | "project-checkpoint"
  | "multi-file-challenge"
  | "devnet-challenge";

export type LessonObjective = {
  id: string;
  text: string;
  type: "terminal" | "file" | "quiz";
};

export type TerminalScriptStep = {
  command: string;
  expectedOutputIncludes: string[];
};

export type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  mdx: string;
  objectives: LessonObjective[];
  checkpointId?: string;
  terminalScript?: TerminalScriptStep[];
};

export type CourseManifest = {
  courseId: string;
  slug: string;
  title: string;
  version: number;
  lessons: Lesson[];
};

const lessonTypeSchema = z.enum([
  "interactive-code",
  "visual-explorer",
  "quiz",
  "project-checkpoint",
  "multi-file-challenge",
  "devnet-challenge",
]);

const objectiveSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  type: z.enum(["terminal", "file", "quiz"]),
});

const terminalScriptStepSchema = z.object({
  command: z.string().min(1),
  expectedOutputIncludes: z.array(z.string().min(1)).min(1),
});

const lessonSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    type: lessonTypeSchema,
    mdx: z.string().min(1),
    objectives: z.array(objectiveSchema).min(1),
    checkpointId: z.string().min(1).optional(),
    terminalScript: z.array(terminalScriptStepSchema).optional(),
  })
  .superRefine((lesson, ctx) => {
    if (lesson.type === "project-checkpoint" && !lesson.checkpointId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Lesson '${lesson.id}' must define checkpointId for project-checkpoint type`,
        path: ["checkpointId"],
      });
    }
  });

const courseManifestSchema = z.object({
  courseId: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  version: z.number().int().positive(),
  lessons: z.array(lessonSchema).min(1),
});

export function parseCourseManifest(input: unknown): CourseManifest {
  const parsed = courseManifestSchema.safeParse(input);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid course manifest: ${errorDetails}`);
  }
  return parsed.data;
}

const solanaFundamentalsManifestInput: CourseManifest = {
  courseId: "solana-fundamentals-v2",
  slug: "solana-fundamentals",
  title: "Solana Fundamentals V2",
  version: 1,
  lessons: [
    {
      id: "sf2-lesson-1",
      title: "CLI Setup and Identity",
      type: "interactive-code",
      mdx: `# CLI Setup and Identity\n\nUse the terminal to create your first Solana identity.\n\n<InteractiveCodeBlock filePath=\"scripts/setup.ts\" language=\"typescript\" />`,
      objectives: [
        { id: "sf2-l1-o1", text: "Set devnet as your RPC cluster", type: "terminal" },
        { id: "sf2-l1-o2", text: "Generate a keypair and print the address", type: "terminal" },
      ],
      terminalScript: [
        {
          command: "solana config set --url devnet",
          expectedOutputIncludes: ["Config File", "devnet"],
        },
        {
          command: "solana-keygen new --outfile ~/.config/solana/id.json",
          expectedOutputIncludes: ["Wrote new keypair", "pubkey:"],
        },
        {
          command: "solana address",
          expectedOutputIncludes: ["111"],
        },
      ],
    },
    {
      id: "sf2-lesson-2",
      title: "PDA Visual Explorer",
      type: "visual-explorer",
      mdx: `# PDA Explorer\n\nUnderstand deterministic account derivation.\n\n<Visualizer type=\"pda\" />`,
      objectives: [
        { id: "sf2-l2-o1", text: "Compute a PDA with at least 2 seeds", type: "file" },
      ],
    },
    {
      id: "sf2-lesson-3",
      title: "Knowledge Check",
      type: "quiz",
      mdx: `# Quiz\n\n<Quiz id=\"sf2-quiz-1\" />`,
      objectives: [
        { id: "sf2-l3-o1", text: "Pass the quiz", type: "quiz" },
      ],
    },
    {
      id: "sf2-lesson-4",
      title: "Checkpoint: Wallet & Airdrop",
      type: "project-checkpoint",
      checkpointId: "sf2-checkpoint-1",
      mdx: `# Checkpoint\n\nYou should have a funded devnet wallet and a saved workspace snapshot.`,
      objectives: [
        { id: "sf2-l4-o1", text: "Airdrop at least 1 SOL", type: "terminal" },
      ],
      terminalScript: [
        {
          command: "solana airdrop 1",
          expectedOutputIncludes: ["Signature:", "1 SOL"],
        },
      ],
    },
  ],
};

export const solanaFundamentalsManifest = parseCourseManifest(
  solanaFundamentalsManifestInput
);

const manifestRegistry: Record<string, CourseManifest> = {
  [solanaFundamentalsManifest.slug]: solanaFundamentalsManifest,
};

export function getCourseManifest(slug: string): CourseManifest | null {
  return manifestRegistry[slug] ?? null;
}
