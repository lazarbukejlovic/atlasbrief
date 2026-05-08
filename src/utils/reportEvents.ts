export type ReportType = 'trip-readiness' | 'long-stay-feasibility' | 'family-group-readiness';

export type ReportAction = 'copy-summary' | 'print-preview';

export interface RecentReportEvent {
  reportType: ReportType;
  destination: string;
  timestamp: string;
  action: ReportAction;
}

const REPORT_EVENTS_STORAGE_KEY = 'atlasbrief-recent-report-events-v1';

const isValidReportType = (value: string): value is ReportType =>
  value === 'trip-readiness' || value === 'long-stay-feasibility' || value === 'family-group-readiness';

const isValidAction = (value: string): value is ReportAction => value === 'copy-summary' || value === 'print-preview';

const safeReadEvents = (): RecentReportEvent[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(REPORT_EVENTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is RecentReportEvent => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      const maybe = item as Partial<RecentReportEvent>;
      return Boolean(
        maybe.reportType &&
          maybe.destination &&
          maybe.timestamp &&
          maybe.action &&
          typeof maybe.reportType === 'string' &&
          isValidReportType(maybe.reportType) &&
          typeof maybe.destination === 'string' &&
          typeof maybe.timestamp === 'string' &&
          typeof maybe.action === 'string' &&
          isValidAction(maybe.action)
      );
    });
  } catch {
    return [];
  }
};

const safeWriteEvents = (events: RecentReportEvent[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(REPORT_EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Preview-only feature: do not block UI interactions when storage fails.
  }
};

export const trackRecentReportEvent = (payload: {
  reportType: ReportType;
  destination: string;
  action: ReportAction;
}) => {
  const next: RecentReportEvent = {
    reportType: payload.reportType,
    destination: payload.destination,
    action: payload.action,
    timestamp: new Date().toISOString(),
  };

  const existing = safeReadEvents();
  safeWriteEvents([next, ...existing].slice(0, 80));
};

export const getRecentReportEvents = (): RecentReportEvent[] => safeReadEvents();

export const REPORT_EVENTS_KEY = REPORT_EVENTS_STORAGE_KEY;