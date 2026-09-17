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
