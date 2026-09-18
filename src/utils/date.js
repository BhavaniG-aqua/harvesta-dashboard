// Small date helpers shared across pages/components.

export function getGreeting(date = new Date()) {
  const hours = date.getHours();
  if (hours < 12) return "Good morning";
  if (hours < 17) return "Good afternoon";
  return "Good evening";
}

export function formatFullDate(date = new Date()) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatShortDate(dateStr) {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

export function daysFromToday(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffMs = target - today;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

// Returns "YYYY-MM-DD" for a Date object, in LOCAL time (not UTC) so it
// matches the <input type="date"> value format used across forms.
export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Builds a 6-row (42-cell) month grid for the given year/month (0-indexed
// month), including the trailing/leading days from adjacent months needed
// to fill each week row — the standard calendar-grid layout.
export function getMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  // Leading days from the previous month.
  for (let i = 0; i < startWeekday; i++) {
    const date = new Date(year, month, 1 - (startWeekday - i));
    cells.push({ date, inCurrentMonth: false });
  }

  // Days of the current month.
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inCurrentMonth: true });
  }

  // Trailing days to complete the last week row.
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    const date = new Date(last);
    date.setDate(date.getDate() + 1);
    cells.push({ date, inCurrentMonth: false });
  }

  return cells;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
