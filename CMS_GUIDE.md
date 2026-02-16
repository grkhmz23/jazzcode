# CMS Guide

Content management documentation for Superteam Academy (JazzCode).

---

## Overview

JazzCode uses a `CourseContentService` abstraction that supports swapping between local data files and a headless CMS. This design allows you to:

1. **Start quickly** with local TypeScript files (no CMS setup required)
2. **Scale seamlessly** to a headless CMS when needed
3. **Switch back** to local files for development/testing

The content service interface ensures that regardless of the source, the data structure remains consistent.

---

## Current Setup: Local Data Files

By default, course content is stored in TypeScript files at:

```
src/lib/data/courses/
├── index.ts              # Course registry
├── solana-fundamentals.ts
├── anchor-development.ts
├── solana-frontend.ts
└── defi-solana.ts
```

### Content Schema

#### Course

```typescript
interface Course {
  id: string;                    // Unique identifier (e.g., "solana-fundamentals")
  title: string;                 // Display title
  slug: string;                  // URL-friendly name (e.g., "solana-fundamentals")
  description: string;           // Short description (1-2 sentences)
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;              // Human-readable duration (e.g., "8 hours")
  totalXP: number;               // Total XP available in course
  thumbnailUrl: string;          // Course thumbnail image URL
  instructor: {
    name: string;
    avatarUrl: string;
    bio: string;
  };
  modules: Module[];             // Array of course modules
  tags: string[];                // Search/filter tags
  language: string;              // Content language code (e.g., "en")
  createdAt: string;             // ISO date string
  updatedAt: string;             // ISO date string
}
```

#### Module

```typescript
interface Module {
  id: string;                    // Unique identifier
  title: string;                 // Module title
  order: number;                 // Display order (0-indexed)
  lessons: Lesson[];             // Array of lessons in this module
}
```

#### Lesson

```typescript
interface Lesson {
  id: string;                    // Unique identifier
  title: string;                 // Lesson title
  slug: string;                  // URL-friendly name
  type: 'content' | 'challenge'; // Lesson type
  content: string;               // Markdown content (min 250 words)
  xpReward: number;              // XP awarded on completion
  order: number;                 // Order within module
  moduleId: string;              // Parent module ID
}
```

#### Challenge (extends Lesson)

```typescript
interface Challenge extends Lesson {
  type: 'challenge';
  starterCode: string;           // Initial code shown to user
  language: 'typescript' | 'rust' | 'json';
  testCases: TestCase[];         // Validation tests
  hints: string[];               // Progressive hints (2-3 recommended)
  solution: string;              // Reference solution
}

interface TestCase {
  name: string;                  // Test name (shown to user)
  input: string;                 // Test input
  expectedOutput: string;        // Expected output
}
```

---

## Adding a New Course

### Step 1: Create Course File

Create a new file at `src/lib/data/courses/your-course.ts`:

```typescript
import type { Course } from "@/types/content";

export const yourCourse: Course = {
  id: "your-course-slug",
  title: "Your Course Title",
  slug: "your-course-slug",
  description: "A compelling description of what learners will build and learn.",
  difficulty: "beginner", // or "intermediate" or "advanced"
  duration: "6 hours",
  totalXP: 500,
  thumbnailUrl: "/images/courses/your-course.png",
  instructor: {
    name: "Instructor Name",
    avatarUrl: "/images/instructors/name.png",
    bio: "Brief bio of the instructor.",
  },
  modules: [
    // Modules go here (see Step 2)
  ],
  tags: ["solana", "beginner", "your-tag"],
  language: "en",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};
```

### Step 2: Define Modules

Add modules to your course:

```typescript
modules: [
  {
    id: "module-1",
    title: "Module 1: Getting Started",
    order: 0,
    lessons: [
      // Lessons go here (see Step 3)
    ],
  },
  {
    id: "module-2",
    title: "Module 2: Core Concepts",
    order: 1,
    lessons: [
      // More lessons...
    ],
  },
]
```

### Step 3: Create Lessons

#### Content Lesson

```typescript
{
  id: "lesson-1-1",
  title: "Introduction to Solana",
  slug: "introduction-to-solana",
  type: "content",
  content: `# Introduction to Solana

Solana is a high-performance blockchain platform designed for decentralized applications...

## Key Features

- **High Throughput**: 65,000+ TPS
- **Low Cost**: Sub-cent transaction fees
- **Fast Finality**: ~400ms block times

## Architecture

The Solana architecture consists of...

[Write at least 250 words of content]`,
  xpReward: 25,
  order: 0,
  moduleId: "module-1",
}
```

#### Challenge Lesson

```typescript
{
  id: "lesson-1-2",
  title: "Your First Transaction",
  slug: "your-first-transaction",
  type: "challenge",
  content: `# Your First Transaction

In this challenge, you'll create and send your first Solana transaction...

## Objectives

- Create a connection to devnet
- Generate a keypair
- Request an airdrop
- Check balance`,
  xpReward: 50,
  order: 1,
  moduleId: "module-1",
  starterCode: `import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

async function main() {
  // TODO: Create connection to devnet
  
  // TODO: Generate a new keypair
  
  // TODO: Request airdrop of 1 SOL
  
  // TODO: Check and log balance
}

main();`,
  language: "typescript",
  testCases: [
    {
      name: "Should create connection",
      input: "test-connection",
      expectedOutput: "connected",
    },
    {
      name: "Should have positive balance",
      input: "test-balance",
      expectedOutput: "1000000000",
    },
  ],
  hints: [
    "Use 'new Connection()' with the devnet URL",
    "Use 'Keypair.generate()' to create a keypair",
    "Use 'connection.requestAirdrop()' to get SOL",
  ],
  solution: `import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

async function main() {
  const connection = new Connection('https://api.devnet.solana.com');
  const keypair = Keypair.generate();
  
  await connection.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL);
  
  const balance = await connection.getBalance(keypair.publicKey);
  console.log('Balance:', balance);
}

main();`,
}
```

### Step 4: Register Course

Add your course to `src/lib/data/courses/index.ts`:

```typescript
import { yourCourse } from "./your-course";

export const allCourses: Course[] = [
  solanaFundamentals,
  anchorDevelopment,
  solanaFrontend,
  defiSolana,
  yourCourse, // Add here
];
```

### Step 5: Add Images

Place course and instructor images in the public directory:

```
public/
├── images/
│   ├── courses/
│   │   └── your-course.png
│   └── instructors/
│       └── name.png
```

---

## Adding a New Lesson to an Existing Course

1. Open the course file (e.g., `solana-fundamentals.ts`)
2. Find the module you want to add to
3. Add the lesson to the `lessons` array
4. Ensure `order` values are sequential
5. Update `totalXP` on the course if needed
6. Update `updatedAt` timestamp

Example:

```typescript
// In solana-fundamentals.ts
modules: [
  {
    id: "module-1",
    title: "Getting Started",
    order: 0,
    lessons: [
      // ... existing lessons
      {
        id: "lesson-1-5", // New unique ID
        title: "New Lesson Title",
        slug: "new-lesson-slug",
        type: "content",
        content: `# New Lesson\n\nContent here...`,
        xpReward: 25,
        order: 4, // Next order number
        moduleId: "module-1",
      },
    ],
  },
]
```

---

## Content Writing Guidelines

### Lesson Content Standards

1. **Minimum Length**: 250 words per lesson
2. **Structure**: Use headers (# ## ###) to organize content
3. **Code Examples**: Include practical, runnable code snippets
4. **Links**: Use relative links for internal navigation
5. **Images**: Use descriptive alt text

### Markdown Features Supported

```markdown
# Headers
## Sub-headers

**Bold text** and *italic text*

- Bullet lists
- With multiple items

1. Numbered lists
2. For sequential steps

\`inline code\` for short snippets

\`\`\`typescript
// Code blocks with syntax highlighting
const connection = new Connection('https://api.devnet.solana.com');
\`\`\`

> Blockquotes for important notes

[Link text](/courses/slug/lessons/id)
```

### Code Example Standards

1. **Use Real APIs**: Code should use actual library APIs
2. **Be Complete**: Include imports and necessary setup
3. **Be Runnable**: Code should execute without errors (if copy-pasted)
4. **Comment**: Explain complex logic with inline comments

**Good Example**:
```typescript
import { Connection, PublicKey } from '@solana/web3.js';

// Create connection to Solana devnet
const connection = new Connection('https://api.devnet.solana.com');

// Define a known program account (System Program)
const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

// Fetch account info
const accountInfo = await connection.getAccountInfo(SYSTEM_PROGRAM_ID);
console.log('Account lamports:', accountInfo?.lamports);
```

**Bad Example**:
```typescript
// Don't do this - incomplete and vague
const connection = new Connection(url);
const result = await connection.getSomething();
```

---

## Challenge Design Guidelines

### Starter Code Principles

1. **Compiles but Incomplete**: Code should run but not pass tests
2. **Clear TODOs**: Mark where students need to write code
3. **Minimal Boilerplate**: Don't overwhelm with setup code
4. **Realistic**: Use patterns seen in actual Solana development

Example:
```typescript
import { Connection, Keypair } from '@solana/web3.js';

async function createWallet() {
  // TODO: Create a connection to devnet
  const connection = 

  // TODO: Generate a new keypair
  const keypair = 

  // TODO: Return the public key as a base58 string
  return 
}

export { createWallet };
```

### Test Case Design

1. **Specific Names**: "Should create valid keypair" not "Test 1"
2. **Clear Input/Output**: Document what is being tested
3. **Progressive Difficulty**: Start simple, build complexity
4. **Edge Cases**: Include boundary conditions

Example:
```typescript
testCases: [
  {
    name: "Should create connection to devnet",
    input: "test-devnet-connection",
    expectedOutput: "https://api.devnet.solana.com",
  },
  {
    name: "Should generate valid public key",
    input: "test-keypair-valid",
    expectedOutput: "valid", // Checker validates format
  },
  {
    name: "Should return base58 string",
    input: "test-keypair-base58",
    expectedOutput: "base58", // Checker validates encoding
  },
]
```

### Hint Guidelines

1. **Progressive Disclosure**: General → Specific
2. **2-3 Hints**: Don't give away the answer immediately
3. **Point to Documentation**: Link to relevant docs

Example:
```typescript
hints: [
  "Use the Connection class from @solana/web3.js with the devnet URL",
  "Keypair.generate() creates a new keypair with a random seed",
  "Use publicKey.toBase58() to get the string representation",
]
```

### Solution Requirements

1. **Passes All Tests**: Must satisfy every test case
2. **Best Practices**: Use recommended patterns
3. **Readable**: Clear variable names and comments
4. **Complete**: Include all necessary imports

---

## Switching to a Headless CMS

### Step 1: Choose Your CMS

Supported options (Phase 7):
- **Sanity**: Recommended for rich content and references
- **Strapi**: Good for self-hosted option
- **Contentful**: Enterprise-grade with strong API

### Step 2: Set Environment Variable

```bash
# In .env.local
CONTENT_SOURCE=sanity
```

### Step 3: Implement CMS Service

Create `src/lib/services/content-sanity.ts`:

```typescript
import type { CourseContentService, Course, Module, Lesson } from "@/types/content";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

export class SanityContentService implements CourseContentService {
  async getAllCourses(): Promise<Course[]> {
    const query = `*[_type == "course"] {
      id,
      title,
      slug,
      description,
      difficulty,
      duration,
      totalXP,
      thumbnailUrl,
      instructor { name, avatarUrl, bio },
      modules[] -> {
        id,
        title,
        order,
        lessons[] -> { ... }
      },
      tags,
      language,
      createdAt,
      updatedAt
    }`;
    return client.fetch(query);
  }

  async getCourse(slug: string): Promise<Course | null> {
    const query = `*[_type == "course" && slug == $slug][0] { ... }`;
    return client.fetch(query, { slug });
  }

  async getCoursesByDifficulty(difficulty: Course['difficulty']): Promise<Course[]> {
    const query = `*[_type == "course" && difficulty == $difficulty] { ... }`;
    return client.fetch(query, { difficulty });
  }
}
```

### Step 4: Update Factory

Modify `src/lib/services/content-factory.ts`:

```typescript
import { SanityContentService } from './content-sanity';

export function getContentService(): CourseContentService {
  if (contentServiceInstance) {
    return contentServiceInstance;
  }

  const contentSource = process.env.CONTENT_SOURCE;

  switch (contentSource) {
    case 'sanity':
      contentServiceInstance = new SanityContentService();
      return contentServiceInstance;
    case 'local':
    case undefined:
    default:
      contentServiceInstance = new LocalContentService();
      return contentServiceInstance;
  }
}
```

### Step 5: CMS Schema Design

For Sanity, create schemas matching your TypeScript types:

```javascript
// sanity/schemas/course.js
export default {
  name: 'course',
  type: 'document',
  fields: [
    { name: 'id', type: 'string', validation: Rule => Rule.required() },
    { name: 'title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', type: 'text' },
    { name: 'difficulty', type: 'string', options: { list: ['beginner', 'intermediate', 'advanced'] } },
    { name: 'duration', type: 'string' },
    { name: 'totalXP', type: 'number' },
    { name: 'thumbnailUrl', type: 'image' },
    { name: 'instructor', type: 'object', fields: [
      { name: 'name', type: 'string' },
      { name: 'avatarUrl', type: 'image' },
      { name: 'bio', type: 'text' },
    ]},
    { name: 'modules', type: 'array', of: [{ type: 'reference', to: [{ type: 'module' }] }] },
    { name: 'tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'language', type: 'string' },
  ]
};
```

---

## Publishing Workflow

### Draft → Review → Publish

1. **Draft**: Create content in development environment
   ```bash
   pnpm dev
   # Edit files in src/lib/data/courses/
   ```

2. **Review**: Test thoroughly
   - Run all lessons in browser
   - Verify challenges pass with solution code
   - Check responsive design
   - Review for typos and clarity

3. **Publish**: Deploy to production
   ```bash
   git add .
   git commit -m "feat: add [course/lesson name]"
   git push origin main
   ```

4. **Verify**: Check production deployment
   - Test on live site
   - Verify progress tracking works
   - Check achievement unlocks

### Content Updates

For minor fixes (typos, clarifications):
- Edit file directly
- Commit with `fix: ` prefix

For major updates (new modules, rewrites):
- Create feature branch
- Test thoroughly
- Merge via PR
- Update `updatedAt` timestamp

---

## Best Practices

1. **ID Convention**: Use kebab-case, include module number (e.g., `module-1-lesson-2`)
2. **Slug Convention**: Short, descriptive, kebab-case (e.g., `your-first-transaction`)
3. **XP Values**: 
   - Content lessons: 25 XP
   - Easy challenges: 50 XP
   - Medium challenges: 75 XP
   - Hard challenges: 100 XP
4. **Course Length**: 4-8 modules, 3-6 lessons per module
5. **Challenge Ratio**: ~40% challenges for interactive learning
6. **Images**: Optimize to < 200KB, use WebP when possible
