export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

function applyEventTime(d: Date, timeStr?: string | null) {
  if (!timeStr || !timeStr.trim()) {
    d.setHours(23, 59, 59, 999);
    return;
  }
  const m = timeStr.trim().match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
  if (m) {
    let hours = parseInt(m[1], 10);
    const mins = m[2] ? parseInt(m[2], 10) : 0;
    const meridiem = m[3] ? m[3].toLowerCase() : null;
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
    d.setHours(hours, mins, 59, 999);
  } else {
    d.setHours(23, 59, 59, 999);
  }
}

export function isEventCompleted(event: {
  startDate?: string | null;
  startTime?: string | null;
  endDate?: string | null;
  endTime?: string | null;
} | null | undefined): boolean {
  if (!event) return false;

  const dateStr = event.endDate || event.startDate;
  if (!dateStr || !dateStr.trim()) return false;

  try {
    const raw = dateStr.trim();

    // 1. Direct standard ISO format YYYY-MM-DD or YYYY/MM/DD
    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(raw)) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        applyEventTime(d, event.endTime || event.startTime);
        return d.getTime() < Date.now();
      }
    }

    const months: Record<string, number> = {
      jan: 0, january: 0,
      feb: 1, february: 1,
      mar: 2, march: 2,
      apr: 3, april: 3,
      may: 4,
      jun: 5, june: 5,
      jul: 6, july: 6,
      aug: 7, august: 7,
      sep: 8, sept: 8, september: 8,
      oct: 9, october: 9,
      nov: 10, november: 10,
      dec: 11, december: 11,
    };

    // 2. Check for explicit 4-digit year in string (e.g. "Sun, 6 Sep 2026")
    const yearMatch = raw.match(/\b(20\d{2})\b/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

    // 3. Match "6 Sep", "Sun, 6 Sep", "Sep 6", "September 6"
    const dayMonthMatch = raw.match(/(\d{1,2})\s+([a-zA-Z]+)/) || raw.match(/([a-zA-Z]+)\s+(\d{1,2})/);
    if (dayMonthMatch) {
      let day: number;
      let monthStr: string;
      if (/^\d+$/.test(dayMonthMatch[1])) {
        day = parseInt(dayMonthMatch[1], 10);
        monthStr = dayMonthMatch[2].toLowerCase();
      } else {
        monthStr = dayMonthMatch[1].toLowerCase();
        day = parseInt(dayMonthMatch[2], 10);
      }

      const monthIdx = months[monthStr] !== undefined ? months[monthStr] : months[monthStr.slice(0, 3)];
      if (monthIdx !== undefined && !isNaN(day)) {
        const eventDate = new Date(year, monthIdx, day);
        applyEventTime(eventDate, event.endTime || event.startTime);
        return eventDate.getTime() < Date.now();
      }
    }

    // 4. Fallback parser
    const fallbackDate = new Date(raw);
    if (!isNaN(fallbackDate.getTime())) {
      if (fallbackDate.getFullYear() < 2020 && !yearMatch) {
        fallbackDate.setFullYear(new Date().getFullYear());
      }
      applyEventTime(fallbackDate, event.endTime || event.startTime);
      return fallbackDate.getTime() < Date.now();
    }
  } catch (err) {
    console.error('isEventCompleted parse error:', err);
  }

  return false;
}

