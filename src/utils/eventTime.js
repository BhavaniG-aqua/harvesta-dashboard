// Helpers for turning a placement event's separate `date` ("YYYY-MM-DD")
// and free-text `time` (e.g. "10:00 AM", "14:30", "9:30am") fields into a
// single JS Date, used to schedule the 1-day-prior / 1-hour-prior
// reminder notifications.

// Parses common time formats into { hours, minutes } in 24h form.
// Returns null if the string can't be parsed.
export function parseTimeToHoursMinutes(timeStr) {
  if (!timeStr) return null;
  const match = timeStr
    .trim()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3]?.toLowerCase();

  if (Number.isNaN(hours) || hours > 23 || minutes > 59) return null;

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  return { hours, minutes };
}

// Combines an event's date + time into a Date object.
// If time can't be parsed (missing / free-text like "Morning"), defaults
// to 09:00 local time so day-before reminders still work sensibly.
export function getEventDateTime(event) {
  if (!event?.date) return null;
  const parsedTime = parseTimeToHoursMinutes(event.time);
  const [year, month, day] = event.date.split("-").map(Number);
  const hours = parsedTime?.hours ?? 9;
  const minutes = parsedTime?.minutes ?? 0;
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}
