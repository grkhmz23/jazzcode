import { COURSES } from "@/lib/data/courses";
import type { Course, CourseFilter, Lesson } from "@/types";
import type { CourseContentService } from "../interfaces";

export class LocalCourseContentService implements CourseContentService {
  async getCourses(filter?: CourseFilter): Promise<Course[]> {
    let courses = [...COURSES];

    if (filter?.difficulty) {
      courses = courses.filter((c) => c.difficulty === filter.difficulty);
    }

    if (filter?.search) {
      const search = filter.search.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search) ||
          c.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    return courses;
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    return COURSES.find((c) => c.slug === slug) ?? null;
  }

  async getLessonById(courseSlug: string, lessonId: string): Promise<Lesson | null> {
    const course = await this.getCourseBySlug(courseSlug);
    if (!course) return null;

    for (const mod of course.modules) {
      const lesson = mod.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
    return null;
  }

  async searchCourses(query: string): Promise<Course[]> {
    return this.getCourses({ search: query });
  }
}
