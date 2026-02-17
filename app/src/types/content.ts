export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type LessonType =
  | 'content'
  | 'challenge'
  | 'multi-file-challenge'
  | 'devnet-challenge';
export type ChallengeLanguage = 'typescript' | 'rust';
export type ExplorerType = 'AccountExplorer' | 'PDADerivationExplorer';

export interface TestCase {
  name: string;
  input: string;
  expectedOutput: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface TerminalStep {
  cmd: string;
  output: string;
  note?: string;
}

export interface AccountExplorerSample {
  label: string;
  address: string;
  lamports: number;
  owner: string;
  executable: boolean;
  dataLen: number;
}

export interface PDADerivationExplorerProps {
  programId: string;
  seeds: string[];
}

export interface QuizBlock {
  type: 'quiz';
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface TerminalBlock {
  type: 'terminal';
  id: string;
  title: string;
  steps: TerminalStep[];
}

export interface AccountExplorerBlock {
  type: 'explorer';
  id: string;
  title: string;
  explorer: 'AccountExplorer';
  props: {
    samples: AccountExplorerSample[];
  };
}

export interface PDADerivationExplorerBlock {
  type: 'explorer';
  id: string;
  title: string;
  explorer: 'PDADerivationExplorer';
  props: PDADerivationExplorerProps;
}

export type LessonBlock =
  | QuizBlock
  | TerminalBlock
  | AccountExplorerBlock
  | PDADerivationExplorerBlock;

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  type: LessonType;
  content: string;
  blocks?: LessonBlock[];
  xpReward: number;
  duration: string;
}

export interface Challenge extends Lesson {
  starterCode: string;
  language: ChallengeLanguage;
  testCases: TestCase[];
  hints: string[];
  solution: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: CourseDifficulty;
  duration: string;
  totalXP: number;
  tags: string[];
  imageUrl: string;
  modules: Module[];
}
