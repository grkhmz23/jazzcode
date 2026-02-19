"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StreakCalendarProps {
  streakHistory: string[]; // ISO date strings like "2026-02-15"
  currentStreak: number;
  longestStreak: number;
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
 * Format date to YYYY-MM-DD in local timezone
 */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format date for display (e.g., "Feb 15, 2026")
 */
function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get month name abbreviation
 */
function getMonthAbbreviation(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short" });
}

/**
 * Streak Calendar Component
 * GitHub-style contribution graph showing last 12 weeks of activity
 */
export function StreakCalendar({
  streakHistory,
  currentStreak,
  longestStreak,
}: StreakCalendarProps) {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const [hoveredCell, setHoveredCell] = useState<CalendarCell | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Calculate calendar data with useMemo for performance
  const { weeks, monthLabels, isActiveToday } = useMemo(() => {
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

    // Calculate number of weeks based on screen size (will be responsive via CSS)
    const totalWeeks = 12;
    const daysPerWeek = 7;

    // Generate weeks (columns) - each week has 7 days (rows)
    const calendarWeeks: CalendarWeek[] = [];
    const months: { label: string; weekIndex: number }[] = [];
    let lastMonth = "";

    for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
      const week: CalendarWeek = { days: [] };

      for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex++) {
        // Calculate days ago: start from today and go backwards
        // We want the grid to end with today in the bottom-right
        // So we calculate: totalDays - (weekIndex * 7 + dayIndex) - 1 days ago
        const totalDays = totalWeeks * daysPerWeek;
        const daysAgo = totalDays - (weekIndex * 7 + dayIndex) - 1;

        const cellDate = new Date(today);
        cellDate.setDate(today.getDate() - daysAgo);

        const dateString = formatLocalDate(cellDate);

        // Track month labels
        const monthLabel = getMonthAbbreviation(cellDate);
        if (monthLabel !== lastMonth && dayIndex === 0) {
          months.push({ label: monthLabel, weekIndex });
          lastMonth = monthLabel;
        }

        week.days.push({
          date: cellDate,
          dateString,
          isActive: activeDatesSet.has(dateString),
          isToday: dateString === todayString,
        });
      }

      calendarWeeks.push(week);
    }

    return {
      weeks: calendarWeeks,
      monthLabels: months,
      isActiveToday: isTodayActive,
    };
  }, [streakHistory]);

  // Handle mouse enter for tooltip
  const handleMouseEnter = (
    cell: CalendarCell,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setHoveredCell(cell);
    updateTooltipPosition(event);
  };

  // Handle mouse move for tooltip positioning
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    updateTooltipPosition(event);
  };

  const updateTooltipPosition = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  // Day labels (Mon, Wed, Fri)
  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", ""];

  return (
    <div className="w-full">
      {/* Month labels */}
      <div className="mb-1 flex">
        <div className="w-6" /> {/* Spacer for day labels */}
        <div className="flex flex-1">
          {weeks.map((_, weekIndex) => {
            const monthLabel = monthLabels.find(
              (m) => m.weekIndex === weekIndex
            );
            return (
              <div
                key={weekIndex}
                className="flex-1 text-center text-[10px] text-muted-foreground"
              >
                {monthLabel?.label ?? ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex">
        {/* Day labels */}
        <div className="mr-2 flex flex-col justify-around py-1">
          {dayLabels.map((label, index) => (
            <div
              key={index}
              className="flex h-[10px] items-center justify-end text-[10px] text-muted-foreground md:h-[12px]"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-1 gap-[2px] md:gap-[3px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-1 flex-col gap-[2px] md:gap-[3px]">
              {week.days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    "aspect-square w-full min-w-[8px] max-w-[12px] rounded-sm transition-colors md:min-w-[10px] md:max-w-[14px]",
                    day.isActive && "bg-solana-green",
                    !day.isActive && "bg-muted",
                    day.isToday && "ring-1 ring-primary ring-offset-1"
                  )}
                  onMouseEnter={(e) => handleMouseEnter(day, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  role="button"
                  tabIndex={0}
                  aria-label={`${formatDisplayDate(day.date)}: ${
                    day.isActive ? "Active" : "No activity"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{t("currentStreak")}:</span>
          <span className="font-bold">{currentStreak} {tc("days")}</span>
          {currentStreak > 0 && <span>🔥</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{t("longestStreak")}:</span>
          <span className="font-bold">{longestStreak} {tc("days")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{t("todayActive")}:</span>
          <span>{isActiveToday ? "✓" : "✗"}</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="pointer-events-none fixed z-50 rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-medium">{formatDisplayDate(hoveredCell.date)}</div>
          <div className={hoveredCell.isActive ? "text-solana-green" : "text-muted-foreground"}>
            {hoveredCell.isActive ? "Active" : "No activity"}
          </div>
        </div>
      )}
    </div>
  );
}
