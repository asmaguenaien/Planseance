import { describe, it, expect } from "vitest";
import {
  findAvailableSlots,
  selectSessions,
  formatHour,
  Person,
  TimeSlot,
} from "@/lib/scheduling";

const person = (busySlots: TimeSlot[]): Person => ({ id: "p", name: "P", busySlots });

describe("findAvailableSlots", () => {
  it("returns every start hour when nobody is busy", () => {
    const slots = findAvailableSlots(person([]), [person([])], { sessionCount: 1, hoursPerSession: 2 });
    // 6 days x start hours 8..18 (11 per day)
    expect(slots).toHaveLength(6 * 11);
  });

  it("excludes slots overlapping the professor's busy time", () => {
    const prof = person([{ day: "Lundi", startHour: 9, endHour: 10 }]);
    const slots = findAvailableSlots(prof, [person([])], { sessionCount: 1, hoursPerSession: 2 });
    const monday = slots.filter((s) => s.day === "Lundi").map((s) => s.startHour);
    expect(monday).not.toContain(8); // 8-10 overlaps 9-10
    expect(monday).not.toContain(9);
    expect(monday).toContain(10);
  });

  it("excludes slots when any student is busy", () => {
    const student = person([{ day: "Mardi", startHour: 8, endHour: 20 }]);
    const slots = findAvailableSlots(person([]), [student], { sessionCount: 1, hoursPerSession: 1 });
    expect(slots.some((s) => s.day === "Mardi")).toBe(false);
  });

  it("returns nothing when the session is longer than the day", () => {
    const slots = findAvailableSlots(person([]), [], { sessionCount: 1, hoursPerSession: 13 });
    expect(slots).toEqual([]);
  });
});

describe("selectSessions", () => {
  it("never returns overlapping sessions on the same day", () => {
    const candidates = findAvailableSlots(person([]), [], { sessionCount: 3, hoursPerSession: 2 });
    const sessions = selectSessions(candidates, 3);
    expect(sessions).toHaveLength(3);
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        const a = sessions[i];
        const b = sessions[j];
        const overlap = a.day === b.day && a.startHour < b.endHour && a.endHour > b.startHour;
        expect(overlap).toBe(false);
      }
    }
  });

  it("returns fewer sessions when not enough non-overlapping slots exist", () => {
    const slots: TimeSlot[] = [
      { day: "Lundi", startHour: 8, endHour: 10 },
      { day: "Lundi", startHour: 9, endHour: 11 },
    ];
    expect(selectSessions(slots, 2)).toHaveLength(1);
  });
});

describe("formatHour", () => {
  it("pads single-digit hours", () => {
    expect(formatHour(8)).toBe("08:00");
    expect(formatHour(14)).toBe("14:00");
  });
});
