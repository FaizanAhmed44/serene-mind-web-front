import { addMinutes, format } from "date-fns";
import { AvailabilitySlot } from "@/data/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function generateTimeSlots(
  startTime: string,
  endTime: string,
  sessionDurationMinutes: number
): string[] {
  // startTime and endTime are in "HH:mm" format
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const slots: string[] = [];
  let current = new Date(2000, 0, 1, startHour, startMinute, 0, 0);
  const end = new Date(2000, 0, 1, endHour, endMinute, 0, 0);

  while (current <= end) {
    // Check if there's enough time for the session duration
    const sessionEnd = addMinutes(current, sessionDurationMinutes);
    if (sessionEnd <= end) {
      const h = current.getHours().toString().padStart(2, "0");
      const m = current.getMinutes().toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
    }
    // Move to next slot based on session duration
    current = addMinutes(current, sessionDurationMinutes);
  }

  return slots;
}

export const getAvailableTimes = (
  date: Date | undefined,
  availabilitySlots: AvailabilitySlot[],
  sessionDurationMinutes?: number
): string[] => {
  if (!date || !availabilitySlots) return [];
  const dayOfWeek = format(date, "EEEE"); // e.g., "Monday"
  // Find all slots for this day of week
  const slotsForDay = availabilitySlots.filter(
    (slot) => days[slot.dayOfWeek] === dayOfWeek
  );
  // For each slot, generate time slots based on session duration
  let allTimes: string[] = [];
  slotsForDay.forEach((slot) => {
    const duration = sessionDurationMinutes || 30; // Default to 30 minutes if no session selected
    allTimes = allTimes.concat(
      generateTimeSlots(slot.startTime, slot.endTime, duration)
    );
  });
  allTimes.sort();
  return allTimes;
};
