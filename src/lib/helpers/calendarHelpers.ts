import { generateId } from "@/services/integrations-utils/utilityServicies";
import { db } from "@/services/db";

export async function addCalendarEvent(
  summary: string,
  start: Date | string,
  end: Date | string,
  type: "deadline" | "exam",
  allDay: boolean = false
) {
  const startDate = typeof start === "string" ? new Date(start) : start;
  const endDate = typeof end === "string" ? new Date(end) : end;

  const event = {
    id: generateId(),
    summary,
    start: startDate,
    end: endDate,
    type,
    allDay,
  };
  await db.calendarEvents.add(event);

  try {
    if (!window.electronAPI?.addGoogleCalendarEvent) return;

    if (allDay) {
      const startStr = startDate.toISOString().split("T")[0];
      const endStr = new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      console.log("[Google Calendar] Adding all-day event:", summary, startStr, endStr);
      await window.electronAPI.addGoogleCalendarEvent(summary, startStr, endStr, true);
    } else {
      const timeZone = "America/Toronto"; 
      console.log("[Google Calendar] Adding timed event:", summary, startDate, endDate);

      await window.electronAPI.addGoogleCalendarEvent(
        summary,
        { dateTime: startDate.toISOString(), timeZone },
        { dateTime: endDate.toISOString(), timeZone },
        false
      );
    }
  } catch (err) {
    console.warn("Google Calendar sync failed", err);
  }
}
