import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtlasBrief } from '../components/AppLayout';
import type { AlertFilter, TravelAlert } from '../lib/alerts';
import { buildTravelAlerts } from '../lib/alerts';
import { useStayPlans } from './useStayPlans';

const READ_KEY = 'atlasbrief-alerts-read-v1';
const ARCHIVED_KEY = 'atlasbrief-alerts-archived-v1';

export interface AlertWithState extends TravelAlert {
  isRead: boolean;
}

const readStorageArray = (key: string) => {
  if (typeof window === 'undefined') {
    return [] as string[];
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    window.localStorage.removeItem(key);
    return [] as string[];
  }
};

export const useAlerts = (options?: { destinationId?: string }) => {
  const { destinations, savedBriefs, watchlist } = useAtlasBrief();
  const { stayPlans } = useStayPlans();
  const [readIds, setReadIds] = useState<string[]>([]);
  const [archivedIds, setArchivedIds] = useState<string[]>([]);

  useEffect(() => {
    setReadIds(readStorageArray(READ_KEY));
    setArchivedIds(readStorageArray(ARCHIVED_KEY));
  }, []);

  const generated = useMemo(
    () => buildTravelAlerts({ destinations, savedBriefs, watchlist, stayPlans }),
    [destinations, savedBriefs, stayPlans, watchlist]
  );

  const activeAlerts = useMemo(() => {
    const active = generated.alerts.filter((alert) => !archivedIds.includes(alert.id));
    const withState = active.map((alert) => ({
      ...alert,
      isRead: readIds.includes(alert.id),
    }));

    if (!options?.destinationId) {
      return withState;
    }

    return withState.filter((alert) => alert.destinationId === options.destinationId);
  }, [archivedIds, generated.alerts, options?.destinationId, readIds]);

  const unreadCount = useMemo(
    () => activeAlerts.filter((alert) => !alert.isRead).length,
    [activeAlerts]
  );
  const watchCount = useMemo(
    () => activeAlerts.filter((alert) => alert.severity === 'watch').length,
    [activeAlerts]
  );
  const importantCount = useMemo(
    () => activeAlerts.filter((alert) => alert.severity === 'important').length,
    [activeAlerts]
  );
  const destinationsMonitoredCount = options?.destinationId
    ? generated.monitoredDestinationIds.includes(options.destinationId)
      ? 1
      : 0
    : generated.monitoredDestinationIds.length;

  const latestActiveAlerts = useMemo(() => {
    return activeAlerts
      .filter((alert) => !alert.isRead || alert.severity !== 'info')
      .slice(0, 3);
  }, [activeAlerts]);

  const filterAlerts = useCallback(
    (filter: AlertFilter): AlertWithState[] => {
      if (filter === 'all') {
        return activeAlerts;
      }

      if (filter === 'unread') {
        return activeAlerts.filter((alert) => !alert.isRead);
      }

      if (filter === 'important') {
        return activeAlerts.filter((alert) => alert.severity === 'important');
      }

      if (filter === 'watch') {
        return activeAlerts.filter((alert) => alert.severity === 'watch');
      }

      return activeAlerts.filter((alert) => alert.category === filter);
    },
    [activeAlerts]
  );

  const persistReadIds = useCallback((nextIds: string[]) => {
    setReadIds(nextIds);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(READ_KEY, JSON.stringify(nextIds));
    }
  }, []);

  const persistArchivedIds = useCallback((nextIds: string[]) => {
    setArchivedIds(nextIds);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ARCHIVED_KEY, JSON.stringify(nextIds));
    }
  }, []);

  const markAsRead = useCallback((alertId: string) => {
    if (readIds.includes(alertId)) {
      return;
    }

    persistReadIds([...readIds, alertId]);
  }, [persistReadIds, readIds]);

  const markAllAsRead = useCallback(() => {
    const nextIds = Array.from(new Set([...readIds, ...activeAlerts.map((alert) => alert.id)]));
    persistReadIds(nextIds);
  }, [activeAlerts, persistReadIds, readIds]);

  const archiveAlert = useCallback((alertId: string) => {
    if (archivedIds.includes(alertId)) {
      return;
    }

    persistArchivedIds([...archivedIds, alertId]);
  }, [archivedIds, persistArchivedIds]);

  return {
    alerts: activeAlerts,
    latestActiveAlerts,
    unreadCount,
    watchCount,
    importantCount,
    destinationsMonitoredCount,
    filterAlerts,
    markAsRead,
    markAllAsRead,
    archiveAlert,
  };
};