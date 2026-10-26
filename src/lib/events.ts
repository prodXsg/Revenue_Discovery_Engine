export type EventName =
  | 'insight_displayed'
  | 'evidence_viewed'
  | 'insight_accepted'
  | 'insight_dismissed';

export interface EventPayload {
  issueId?: number;
  issueName?: string;
  timestamp?: string;
  [key: string]: unknown;
}

const STORAGE_KEY = 'rdie_events';

export function track(eventName: EventName, payload: EventPayload = {}): void {
  const event = {
    name: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  console.info(`[Event] ${eventName}`, payload);

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const events = existing ? JSON.parse(existing) : [];
    events.push(event);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.warn('Failed to store event', err);
  }
}

export function getStoredEvents(): EventPayload[] {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
}

export function clearStoredEvents(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear events', err);
  }
}
