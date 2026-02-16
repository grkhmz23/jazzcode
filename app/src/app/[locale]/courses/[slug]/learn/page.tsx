import { notFound } from "next/navigation";
import { serialize } from "next-mdx-remote/serialize";
import { LearnRunner } from "@/components/learn/LearnRunner";
import { getCourseManifest } from "@/lib/courses/manifest";

interface LearnPageProps {
  params: {
    slug: string;
  };
}

export default async function LearnPage({ params }: LearnPageProps) {
  const manifest = getCourseManifest(params.slug);
  if (!manifest) {
    notFound();
  }

  const entries = await Promise.all(
    manifest.lessons.map(async (lesson) => {
      const mdx = await serialize(lesson.mdx, {
        mdxOptions: {
          development: process.env.NODE_ENV !== "production",
        },
      });
      return [lesson.id, mdx] as const;
    })
  );

  const mdxByLesson = Object.fromEntries(entries);

  return <LearnRunner manifest={manifest} mdxByLesson={mdxByLesson} />;
}
