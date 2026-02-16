# Customization Guide

Customize Superteam Academy (JazzCode) for your own community or use case.

---

## Theme Customization

### Tailwind Configuration

Edit `app/tailwind.config.ts` to customize the design system:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  // ... existing config
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Solana brand colors (customize these)
        "solana-purple": "#9945FF",
        "solana-green": "#14F195",
        "solana-blue": "#00C2FF",
        // Add your own colors
        "your-brand": "#FF6B6B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
    },
  },
};
```

### shadcn/ui Theme Variables

Edit `app/src/styles/globals.css` to customize the color scheme:

```css
@layer base {
  :root {
    /* Light mode colors */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 262.1 83.3% 57.8%;       /* Purple-600 */
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 262.1 83.3% 57.8%;
    --radius: 0.5rem;
  }

  .dark {
    /* Dark mode colors */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 263.4 70% 50.4%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 263.4 70% 50.4%;
  }
}
```

### Custom Color Utilities

Add gradient utilities in Tailwind config:

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        "gradient-solana": "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
        "gradient-brand": "linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%)",
      },
    },
  },
};
```

Use in components:

```tsx
<div className="bg-gradient-solana">
  {/* Content */}
</div>
```

---

## Adding a New Language

### Step 1: Create Translation File

Create a new JSON file in `app/src/messages/`:

```bash
cp app/src/messages/en.json app/src/messages/fr.json
```

Edit `fr.json` with French translations:

```json
{
  "common": {
    "appName": "Superteam Academy",
    "tagline": "Plateforme éducative Solana interactive",
    "loading": "Chargement...",
    "error": "Une erreur s'est produite",
    "retry": "Réessayer",
    "save": "Enregistrer",
    "cancel": "Annuler"
  },
  "nav": {
    "home": "Accueil",
    "courses": "Cours",
    "components": "Composants",
    "playground": "Playground"
  }
  // ... translate all keys
}
```

### Step 2: Add Locale to Configuration

Edit `app/src/lib/i18n/request.ts`:

```typescript
export const locales = ["en", "pt-BR", "es", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
```

### Step 3: Add Middleware Matcher

Edit `app/src/middleware.ts`:

```typescript
export const config = {
  matcher: [
    "/",
    "/(en|pt-BR|es|fr)/:path*",  // Add "fr" here
    "/api/:path*",
  ],
};
```

### Step 4: Add Language Switcher Option

Edit `app/src/components/layout/language-switcher.tsx` (or similar):

```typescript
const languages = [
  { code: "en", label: "English" },
  { code: "pt-BR", label: "Português (BR)" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" }, // Add here
];
```

### Step 5: Course Content Language

**Note**: Course content (lessons, challenges) remains in the original language. For fully localized courses, you would need to:

1. Add `language` field to Course type
2. Create translated versions of course files
3. Filter courses by user's preferred locale

Example course language filtering:

```typescript
// In your content service
async getCoursesByLocale(locale: string): Promise<Course[]> {
  const allCourses = await this.getAllCourses();
  return allCourses.filter(c => c.language === locale);
}
```

---

## Extending Gamification

### Adding New Achievements

Edit `app/src/lib/data/achievements.ts`:

```typescript
export const achievements: AchievementDefinition[] = [
  // ... existing achievements
  
  // Add your custom achievement
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Complete a challenge in under 30 seconds",
    icon: "⚡",
    category: "skills",
    rarity: "rare",
    condition: { type: "challenge_time", seconds: 30 },
  },
];
```

Then add the condition handler in `app/src/lib/services/progress-local.ts`:

```typescript
function evaluateCondition(
  condition: AchievementCondition,
  progress: UserProgress
): boolean {
  switch (condition.type) {
    // ... existing cases
    
    case "challenge_time":
      // Check if any challenge was completed under the time limit
      return progress.challengeTimes?.some(
        time => time < condition.seconds
      ) ?? false;
  }
}
```

### Changing XP Values

XP is set per lesson in the course data files:

```typescript
// src/lib/data/courses/your-course.ts
{
  id: "lesson-1-1",
  title: "Introduction",
  type: "content",
  content: "...",
  xpReward: 50,  // Change this value
  order: 0,
  moduleId: "module-1",
}
```

### Changing Level Formula

Edit `app/src/lib/services/progress-local.ts`:

```typescript
/**
 * Calculate level from total XP
 * Default: exponential curve (level 10 = ~5000 XP)
 * 
 * Customize the formula to change progression speed
 */
export function getLevel(totalXP: number): number {
  // Linear: Level = XP / 100
  // return Math.floor(totalXP / 100) + 1;
  
  // Exponential (default): Higher levels require more XP
  const baseXP = 100;
  const exponent = 1.5;
  let level = 1;
  
  while (Math.pow(level, exponent) * baseXP <= totalXP) {
    level++;
  }
  
  return level;
}
```

### Adding New Achievement Conditions

1. **Extend the type** in `app/src/types/achievements.ts`:

```typescript
export type AchievementCondition =
  | { type: "first_lesson" }
  | { type: "lessons_completed"; count: number }
  | { type: "courses_completed"; count: number }
  | { type: "streak_reached"; days: number }
  | { type: "xp_reached"; amount: number }
  | { type: "level_reached"; level: number }
  | { type: "course_completed"; courseSlug: string }
  | { type: "all_courses_completed" }
  | { type: "challenge_perfect"; count: number }  // New!
  | { type: "helped_community"; count: number };  // New!
```

2. **Add evaluation logic** in `progress-local.ts`:

```typescript
case "challenge_perfect":
  return progress.perfectChallenges >= condition.count;

case "helped_community":
  return progress.helpfulAnswers >= condition.count;
```

3. **Track the new data** in your progress service.

---

## Adding New Course Types

### New Lesson Types

Extend the Lesson union in `app/src/types/content.ts`:

```typescript
export interface VideoLesson extends Lesson {
  type: 'video';
  videoUrl: string;
  duration: number; // seconds
  transcript: string;
}

export interface QuizLesson extends Lesson {
  type: 'quiz';
  questions: Question[];
  passingScore: number;
}

export type Lesson = ContentLesson | ChallengeLesson | VideoLesson | QuizLesson;
```

Create the lesson component:

```typescript
// src/components/lessons/VideoLesson.tsx
export function VideoLesson({ lesson }: { lesson: VideoLesson }) {
  return (
    <div>
      <video src={lesson.videoUrl} controls />
      <div className="transcript">{lesson.transcript}</div>
    </div>
  );
}
```

Update the lesson renderer:

```typescript
// In LessonChallenge or lesson page
switch (lesson.type) {
  case 'content':
    return <ContentLesson lesson={lesson} />;
  case 'challenge':
    return <Challenge lesson={lesson} />;
  case 'video':
    return <VideoLesson lesson={lesson} />;
  case 'quiz':
    return <QuizLesson lesson={lesson} />;
}
```

### New Challenge Languages

1. **Add to language union** in `app/src/types/content.ts`:

```typescript
export type ChallengeLanguage = 'typescript' | 'rust' | 'python' | 'solidity';
```

2. **Create challenge runner**:

```typescript
// src/components/editor/PythonChallenge.tsx
export function PythonChallenge({ starterCode, testCases, onComplete }) {
  const runCode = async (code: string) => {
    // Use Pyodide for in-browser Python
    const pyodide = await loadPyodide();
    const results = [];
    
    for (const test of testCases) {
      try {
        const result = pyodide.runPython(`${code}\n${test.input}`);
        results.push({
          passed: result == test.expectedOutput,
          actual: result,
        });
      } catch (error) {
        results.push({ passed: false, error });
      }
    }
    
    return results;
  };
  
  return <ChallengeRunner runCode={runCode} {...props} />;
}
```

3. **Update language selection** in `LessonChallenge` component.

---

## Forking for Other Communities

### Step 1: Replace Branding

#### Logo

Replace logo files in `public/`:

```
public/
├── logo.svg          # Main logo
├── logo-dark.svg     # Dark mode variant
└── favicon.ico       # Browser icon
```

Update logo component in `src/components/layout/header.tsx`:

```tsx
import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/logo.svg"
      alt="Your Community Name"
      width={150}
      height={40}
    />
  );
}
```

#### Colors

Update brand colors in `tailwind.config.ts` and `globals.css` (see Theme section above).

#### Copy

Update text content:

1. **App name**: `app/src/messages/en.json` → `common.appName`
2. **Landing page**: `app/src/app/[locale]/page.tsx`
3. **SEO metadata**: `app/src/app/layout.tsx`

### Step 2: Replace Course Content

1. **Remove existing courses**:
   ```bash
   rm app/src/lib/data/courses/solana-fundamentals.ts
   rm app/src/lib/data/courses/anchor-development.ts
   # etc.
   ```

2. **Create your courses** following the [CMS Guide](CMS_GUIDE.md)

3. **Update course registry** in `app/src/lib/data/courses/index.ts`

### Step 3: Update i18n

1. Add relevant languages for your community
2. Remove unused translations
3. Update default locale if needed:

```typescript
// app/src/lib/i18n/request.ts
export const defaultLocale: Locale = "pt-BR"; // For Brazil-focused community
```

### Step 4: Update On-Chain Config

Point to your own program addresses:

```bash
# .env.local
NEXT_PUBLIC_XP_MINT_ADDRESS=YourXPTokenMintAddress
NEXT_PUBLIC_CREDENTIAL_COLLECTION_ADDRESS=YourCNFTCollectionAddress
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com # Or your own RPC
```

Deploy your own programs (see: `github.com/solanabr/superteam-academy` for reference implementation).

### Step 5: Deploy

Same Vercel setup with your own environment variables:

1. Create Vercel project
2. Connect your forked repository
3. Set environment variables:
   - Database connection (PostgreSQL)
   - OAuth credentials (GitHub, Google)
   - Solana program addresses
   - Analytics (optional)
4. Deploy

### Community-Specific Customizations

#### Discord Integration

Add Discord OAuth:

1. Create Discord app at https://discord.com/developers/applications
2. Add to `app/src/lib/auth/config.ts`:

```typescript
import DiscordProvider from "next-auth/providers/discord";

providers: [
  // ... other providers
  DiscordProvider({
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  }),
]
```

#### Community Achievements

Add community-specific achievements:

```typescript
// app/src/lib/data/achievements.ts
{
  id: "discord-active",
  name: "Community Member",
  description: "Join our Discord server",
  icon: "💬",
  category: "community",
  rarity: "common",
  condition: { type: "discord_joined" },
}
```

#### Custom Leaderboard Timeframes

Modify `app/src/lib/services/progress-local.ts`:

```typescript
export async function getLeaderboard(timeframe: 'alltime' | 'weekly' | 'monthly' | 'season') {
  // Add custom timeframe logic
  if (timeframe === 'season') {
    const seasonStart = new Date('2024-01-01');
    return getLeaderboardSince(seasonStart);
  }
  // ... existing logic
}
```

---

## Deployment Checklist

Before deploying your customized instance:

- [ ] Updated all branding (logo, colors, copy)
- [ ] Created/replaced course content
- [ ] Configured authentication providers
- [ ] Set up database (PostgreSQL)
- [ ] Configured environment variables
- [ ] Added relevant i18n languages
- [ ] Tested all lesson types
- [ ] Verified achievement system
- [ ] Set up analytics (optional)
- [ ] Configured on-chain programs (optional)
- [ ] Ran full test suite: `pnpm lint && pnpm typecheck && pnpm test`
- [ ] Tested production build locally

---

## Getting Help

- **Documentation**: See [README.md](README.md), [ARCHITECTURE.md](ARCHITECTURE.md), [CMS_GUIDE.md](CMS_GUIDE.md)
- **Issues**: Open an issue on GitHub
- **Discord**: Join the Superteam Brazil community

Happy building! 🚀
