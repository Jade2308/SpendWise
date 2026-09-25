import {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  isToday,
  isYesterday,
  isValid,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import type { DateRangeOption } from '../types/expense';

export function formatDateVN(dateString: string, formatPattern: string = 'dd/MM/yyyy'): string {
  try {
    const d = parseISO(dateString);
    if (!isValid(d)) return dateString;
    return format(d, formatPattern, { locale: vi });
  } catch {
    return dateString;
  }
}

export function formatFriendlyDate(dateString: string): string {
  try {
    const d = parseISO(dateString);
    if (!isValid(d)) return dateString;

    if (isToday(d)) {
      return 'Hôm nay';
    }
    if (isYesterday(d)) {
      return 'Hôm qua';
    }
    return format(d, 'EEEE, dd/MM/yyyy', { locale: vi });
  } catch {
    return dateString;
  }
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDateRangeBounds(
  range: DateRangeOption,
  customStart?: string,
  customEnd?: string
): { startDate: Date; endDate: Date; label: string } {
  const now = new Date();

  switch (range) {
    case 'today':
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
        label: 'Hôm nay',
      };
    case 'yesterday': {
      const yesterday = subDays(now, 1);
      return {
        startDate: startOfDay(yesterday),
        endDate: endOfDay(yesterday),
        label: 'Hôm qua',
      };
    }
    case 'this_week':
      return {
        startDate: startOfWeek(now, { weekStartsOn: 1 }),
        endDate: endOfWeek(now, { weekStartsOn: 1 }),
        label: 'Tuần này',
      };
    case 'last_week': {
      const lastWeekDate = subWeeks(now, 1);
      return {
        startDate: startOfWeek(lastWeekDate, { weekStartsOn: 1 }),
        endDate: endOfWeek(lastWeekDate, { weekStartsOn: 1 }),
        label: 'Tuần trước',
      };
    }
    case 'this_month':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
        label: `Tháng ${format(now, 'MM/yyyy')}`,
      };
    case 'last_month': {
      const lastMonthDate = subMonths(now, 1);
      return {
        startDate: startOfMonth(lastMonthDate),
        endDate: endOfMonth(lastMonthDate),
        label: `Tháng ${format(lastMonthDate, 'MM/yyyy')}`,
      };
    }
    case 'this_year':
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
        label: `Năm ${format(now, 'yyyy')}`,
      };
    case 'custom': {
      const s = customStart ? startOfDay(parseISO(customStart)) : startOfMonth(now);
      const e = customEnd ? endOfDay(parseISO(customEnd)) : endOfDay(now);
      return {
        startDate: s,
        endDate: e,
        label: `${format(s, 'dd/MM/yyyy')} - ${format(e, 'dd/MM/yyyy')}`,
      };
    }
    case 'all':
    default:
      return {
        startDate: new Date(2000, 0, 1),
        endDate: new Date(2100, 11, 31),
        label: 'Tất cả thời gian',
      };
  }
}

export function getPreviousPeriodBounds(startDate: Date, endDate: Date): { prevStart: Date; prevEnd: Date } {
  const durationMs = endDate.getTime() - startDate.getTime();
  const prevEnd = new Date(startDate.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - durationMs);
  return { prevStart, prevEnd };
}
