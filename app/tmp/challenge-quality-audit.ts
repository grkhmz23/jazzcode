import { courses } from "../src/lib/data/courses";

type Row = {
  course: string;
  lessonId: string;
  title: string;
  tests: number;
  hints: number;
  hasErrorCase: boolean;
  hasBoundaryLikeCase: boolean;
  longSnapshotCases: number;
  risk: number;
};

const rows: Row[] = [];

for (const c of courses) {
  for (const m of c.modules) {
    for (const l of m.lessons) {
      if (l.type !== "challenge") continue;
      const testCases = l.testCases ?? [];
      const hints = l.hints ?? [];

      const outputs = testCases.map((t) => t.expectedOutput || "");
      const hasErrorCase = outputs.some((o) =>
        /(^|\W)Error:|"valid"\s*:\s*false|"verified"\s*:\s*false|"ready"\s*:\s*false|"ok"\s*:\s*false|"status"\s*:\s*"fail"/i.test(o)
      );
      const hasBoundaryLikeCase = testCases.some((t) =>
        /0|-1|empty|null|undefined|max|min|invalid|expired|missing|boundary/i.test(
          `${t.name} ${t.input} ${t.expectedOutput}`
        )
      );
      const longSnapshotCases = outputs.filter((o) => o.length > 300).length;

      let risk = 0;
      if (testCases.length < 2) risk += 4;
      if (testCases.length === 2) risk += 2;
      if (!hasErrorCase) risk += 2;
      if (!hasBoundaryLikeCase) risk += 2;
      if (hints.length < 2) risk += 1;
      if (longSnapshotCases > 0) risk += 1;

      rows.push({
        course: c.slug,
        lessonId: l.id,
        title: l.title,
        tests: testCases.length,
        hints: hints.length,
        hasErrorCase,
        hasBoundaryLikeCase,
        longSnapshotCases,
        risk,
      });
    }
  }
}

rows.sort((a, b) => b.risk - a.risk || a.course.localeCompare(b.course) || a.lessonId.localeCompare(b.lessonId));

const top = rows.filter((r) => r.risk >= 6);
console.log(`TOTAL_CHALLENGES ${rows.length}`);
console.log(`HIGH_RISK ${top.length}`);
for (const r of top.slice(0, 60)) {
  console.log(
    [
      r.risk,
      r.course,
      r.lessonId,
      `tests=${r.tests}`,
      `hints=${r.hints}`,
      `err=${r.hasErrorCase}`,
      `boundary=${r.hasBoundaryLikeCase}`,
      `long=${r.longSnapshotCases}`,
      r.title,
    ].join(" | ")
  );
}
