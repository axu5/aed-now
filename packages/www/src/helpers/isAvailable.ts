import {
  AEDAvailabilityRules,
  AEDSelect,
  weekdays,
} from "@aed-now/core/aed/types";
import { getDay, isAfter, isBefore, isToday } from "date-fns";

// Convert a Date to HH:MM formatted time string
function getFormattedTime(time: Date | number) {
  time = new Date(time);
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Parse HH:MM to {hours,minutes} object
function parseHHMM(str: string) {
  const [h, m] = str.split(":");
  const hours = parseInt(h as string);
  const minutes = parseInt(m as string);
  if (isNaN(hours) || isNaN(minutes)) {
    return null;
  }
  return {
    hours,
    minutes,
  };
}

// Compare two strings of the format HH:MM
function isBeforeHours(a: string, b: string) {
  const aParsed = parseHHMM(a);
  const bParsed = parseHHMM(b);
  if (!aParsed || !bParsed) {
    return false;
  }

  if (aParsed.hours == bParsed.hours) {
    return aParsed.minutes < bParsed.minutes;
  }

  return aParsed.hours < bParsed.hours;
}

export function isAEDAvailable(point: AEDSelect) {
  let isAvailable = false;
  const now = Date.now();
  for (let i = 0; i < point.availabilityRules.length; i++) {
    const cur = point.availabilityRules[
      i
    ] as AEDAvailabilityRules[number];
    const { type, from, to, available } = cur;

    /**
     * There are three different types of AED availability rules, Date, Range, and weekday.
     * Date and Range are used more for "exceptions" from a day-to-day routine, such
     * as national holidays and periods of construction.
     *
     * Date: A date where an AED is available/unavailable for any reason
     * - For example: holidays when an office is closed
     * Range: A range of dates where AEDs are available/unavailable
     * - For example: a festival or construction respectively
     * Weekday: A weekly routine of AEDs being available/unavailable
     * - For example: An store being open on Mon-Sat 7:00-22:00 and Sun 9:00-22:00
     */
    if (type === "date") {
      const { date } = cur;
      if (from != "" && to == "" && isAfter(now, from)) {
        isAvailable = available;
        continue;
      }
      if (from == "" && to != "" && isBefore(now, to)) {
        isAvailable = available;
        continue;
      }
      if (isToday(date)) {
        isAvailable = available;
        continue;
      }
    } else if (type === "range") {
      if (
        from != "" &&
        to != "" &&
        isAfter(now, from) &&
        isBefore(now, to)
      ) {
        isAvailable = available;
      }
    } else {
      const { days } = cur;
      const dayIdx = getDay(now);
      const day = weekdays[dayIdx];
      const stringTimeNow = getFormattedTime(now);
      if (
        day !== undefined &&
        days.includes(day) &&
        !isBeforeHours(stringTimeNow, from) &&
        isBeforeHours(stringTimeNow, to)
      ) {
        isAvailable = available;
      }
    }
  }
  return isAvailable;
}
