export const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] as const;
export type Day = typeof DAYS[number];

export const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8h to 20h

export interface TimeSlot {
  day: Day;
  startHour: number;
  endHour: number;
}

export interface Person {
  id: string;
  name: string;
  busySlots: TimeSlot[];
}

export interface SessionConfig {
  sessionCount: number;
  hoursPerSession: number;
}

export function findAvailableSlots(
  professor: Person,
  students: Person[],
  config: SessionConfig
): TimeSlot[] {
  const allPeople = [professor, ...students];
  const available: TimeSlot[] = [];

  for (const day of DAYS) {
    // Find continuous free blocks for this day
    for (let hour = 8; hour <= 20 - config.hoursPerSession; hour++) {
      const endHour = hour + config.hoursPerSession;
      const slotFree = allPeople.every((person) =>
        !person.busySlots.some(
          (busy) =>
            busy.day === day &&
            busy.startHour < endHour &&
            busy.endHour > hour
        )
      );
      if (slotFree) {
        available.push({ day, startHour: hour, endHour });
      }
    }
  }

  return available;
}

/**
 * Picks up to `count` sessions from the candidate slots without any overlap.
 * Candidates are returned in chronological order, so the earliest free
 * slots are chosen first.
 */
export function selectSessions(slots: TimeSlot[], count: number): TimeSlot[] {
  const chosen: TimeSlot[] = [];
  for (const slot of slots) {
    if (chosen.length >= count) break;
    const overlaps = chosen.some(
      (c) => c.day === slot.day && c.startHour < slot.endHour && c.endHour > slot.startHour
    );
    if (!overlaps) chosen.push(slot);
  }
  return chosen;
}

export function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
