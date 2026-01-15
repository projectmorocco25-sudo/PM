import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const MOROCCO_TZ = "Africa/Casablanca";

export function formatLocalDateTime(iso: string, timeZone = MOROCCO_TZ) {
  return formatInTimeZone(new Date(iso), timeZone, "yyyy-MM-dd HH:mm");
}

export function formatLocalDate(iso: string, timeZone = MOROCCO_TZ) {
  return formatInTimeZone(new Date(iso), timeZone, "yyyy-MM-dd");
}

export function formatDateHuman(d: Date) {
  return format(d, "PPP");
}

