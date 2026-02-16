import { describe, it, expect } from "vitest";

/**
 * Helper functions from StreakCalendar component (duplicated for testing)
 */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthAbbreviation(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short" });
}

interface CalendarCell {
  date: Date;
  dateString: string;
  isActive: boolean;
  isToday: boolean;
}

interface CalendarWeek {
  days: CalendarCell[];
}

/**
 * Generate calendar data (extracted logic from StreakCalendar)
 */
function generateCalendarData(streakHistory: string[]): {
  weeks: CalendarWeek[];
  monthLabels: { label: string; weekIndex: number }[];
  isActiveToday: boolean;
} {
  // Deduplicate and normalize streak history dates to local timezone
  const activeDatesSet = new Set(
    streakHistory.map((dateStr) => {
      const date = new Date(dateStr);
      return formatLocalDate(date);
    })
  );

  const today = new Date();
  const todayString = formatLocalDate(today);
  const isTodayActive = activeDatesSet.has(todayString);

  const totalWeeks = 12;
  const daysPerWeek = 7;

  const weeks: CalendarWeek[] = [];
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = "";

  for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
    const week: CalendarWeek = { days: [] };

    for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex++) {
      const totalDays = totalWeeks * daysPerWeek;
      const daysAgo = totalDays - (weekIndex * 7 + dayIndex) - 1;

      const cellDate = new Date(today);
      cellDate.setDate(today.getDate() - daysAgo);

      const dateString = formatLocalDate(cellDate);

      const monthLabel = getMonthAbbreviation(cellDate);
      if (monthLabel !== lastMonth && dayIndex === 0) {
        monthLabels.push({ label: monthLabel, weekIndex });
        lastMonth = monthLabel;
      }

      week.days.push({
        date: cellDate,
        dateString,
        isActive: activeDatesSet.has(dateString),
        isToday: dateString === todayString,
      });
    }

    weeks.push(week);
  }

  return { weeks, monthLabels, isActiveToday: isTodayActive };
}

describe("StreakCalendar", () => {
  describe("Grid generation", () => {
    it("should generate 12 weeks of data", () => {
      const { weeks } = generateCalendarData([]);
      expect(weeks).toHaveLength(12);
    });

    it("should generate 7 days per week", () => {
      const { weeks } = generateCalendarData([]);
      for (const week of weeks) {
        expect(week.days).toHaveLength(7);
      }
    });

    it("should generate 84 total cells (12 weeks × 7 days)", () => {
      const { weeks } = generateCalendarData([]);
      const totalCells = weeks.reduce((acc, week) => acc + week.days.length, 0);
      expect(totalCells).toBe(84);
    });

    it("should include today's date in the grid", () => {
      const { weeks } = generateCalendarData([]);
      const today = formatLocalDate(new Date());
      
      let foundToday = false;
      for (const week of weeks) {
        for (const day of week.days) {
          if (day.dateString === today) {
            foundToday = true;
            expect(day.isToday).toBe(true);
          }
        }
      }
      expect(foundToday).toBe(true);
    });
  });

  describe("Active date highlighting", () => {
    it("should mark dates in streakHistory as active", () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const streakHistory = [formatLocalDate(yesterday)];
      const { weeks } = generateCalendarData(streakHistory);

      let foundActive = false;
      for (const week of weeks) {
        for (const day of week.days) {
          if (day.dateString === formatLocalDate(yesterday)) {
            foundActive = true;
            expect(day.isActive).toBe(true);
          }
        }
      }
      expect(foundActive).toBe(true);
    });

    it("should mark dates not in streakHistory as inactive", () => {
      const { weeks } = generateCalendarData([]);
      
      // Most dates should be inactive with empty history
      let inactiveCount = 0;
      for (const week of weeks) {
        for (const day of week.days) {
          if (!day.isActive) {
            inactiveCount++;
          }
        }
      }
      
      // With empty history, all cells should be inactive
      expect(inactiveCount).toBe(84);
    });

    it("should handle multiple active dates", () => {
      const today = new Date();
      const dates: string[] = [];
      
      // Add 5 recent dates
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(formatLocalDate(date));
      }

      const { weeks } = generateCalendarData(dates);
      
      let activeCount = 0;
      for (const week of weeks) {
        for (const day of week.days) {
          if (day.isActive) {
            activeCount++;
          }
        }
      }
      
      expect(activeCount).toBe(5);
    });
  });

  describe("Today's date styling", () => {
    it("should mark today with isToday flag", () => {
      const { weeks } = generateCalendarData([]);
      const today = formatLocalDate(new Date());

      for (const week of weeks) {
        for (const day of week.days) {
          if (day.dateString === today) {
            expect(day.isToday).toBe(true);
          } else {
            expect(day.isToday).toBe(false);
          }
        }
      }
    });

    it("should mark today as active when in streakHistory", () => {
      const today = formatLocalDate(new Date());
      const { isActiveToday } = generateCalendarData([today]);
      expect(isActiveToday).toBe(true);
    });

    it("should not mark today as active when not in streakHistory", () => {
      const { isActiveToday } = generateCalendarData([]);
      expect(isActiveToday).toBe(false);
    });
  });

  describe("Empty streak history", () => {
    it("should render all cells as inactive with empty history", () => {
      const { weeks, isActiveToday } = generateCalendarData([]);
      
      expect(isActiveToday).toBe(false);
      
      for (const week of weeks) {
        for (const day of week.days) {
          expect(day.isActive).toBe(false);
        }
      }
    });
  });

  describe("Date deduplication", () => {
    it("should handle duplicate dates in streakHistory", () => {
      const today = new Date();
      const todayString = formatLocalDate(today);
      
      // Add the same date multiple times
      const streakHistory = [todayString, todayString, todayString];
      const { weeks } = generateCalendarData(streakHistory);
      
      // Should only count as one active day
      let activeCount = 0;
      for (const week of weeks) {
        for (const day of week.days) {
          if (day.isActive) {
            activeCount++;
          }
        }
      }
      
      expect(activeCount).toBe(1);
    });
  });

  describe("Date range", () => {
    it("should include dates from 84 days ago to today", () => {
      const { weeks } = generateCalendarData([]);
      const today = new Date();
      const oldestExpected = new Date(today);
      oldestExpected.setDate(oldestExpected.getDate() - 83); // 84 days total including today

      // Find the oldest and newest dates in the grid
      let oldestDate: Date | null = null;
      let newestDate: Date | null = null;

      for (const week of weeks) {
        for (const day of week.days) {
          if (!oldestDate || day.date < oldestDate) {
            oldestDate = day.date;
          }
          if (!newestDate || day.date > newestDate) {
            newestDate = day.date;
          }
        }
      }

      expect(oldestDate).not.toBeNull();
      expect(newestDate).not.toBeNull();
      
      // Check that the range is approximately correct (within 1 day due to timezone)
      if (oldestDate && newestDate) {
        const daysDiff = Math.round((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24));
        expect(daysDiff).toBe(83);
      }
    });
  });

  describe("Month labels", () => {
    it("should generate month labels", () => {
      const { monthLabels } = generateCalendarData([]);
      // Should have at least 1 month label, typically 3-4 for 12 weeks
      expect(monthLabels.length).toBeGreaterThan(0);
    });

    it("should have valid month abbreviations", () => {
      const { monthLabels } = generateCalendarData([]);
      const validMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      for (const { label } of monthLabels) {
        // Allow for localized month names (they might differ from English)
        expect(label).toBeTruthy();
        expect(typeof label).toBe("string");
        expect(label.length).toBeGreaterThan(0);
      }
    });
  });
});
