import { generateId } from "@/services/integrations-utils/utilityServicies";
import { db } from "@/services/db";

export async function addCalendarEvent(
  summary: string,
  start: Date | string,
  end: Date | string,
  type: "deadline" | "exam",
  allDay: boolean = false,
  recurrence: string = "none"
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
    recurrence,
  };
  await db.calendarEvents.add(event);

  if (!window.electronAPI?.addGoogleCalendarEvent) return;

  const startStr = allDay
    ? startDate.toISOString().split("T")[0]
    : startDate.toISOString();
  const endStr = allDay
    ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : endDate.toISOString();

  await window.electronAPI.addGoogleCalendarEvent(
    summary,
    startStr,
    endStr,
    allDay,
    recurrence
  );
}
