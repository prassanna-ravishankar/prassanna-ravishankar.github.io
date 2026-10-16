export type LogKind = 'pushed' | 'release' | 'project' | 'essay' | 'poem' | 'episode';

export interface LogEntry {
  date: string; // YYYY-MM-DD
  kind: LogKind;
  title: string;
  href: string;
  detail?: string | null;
  external?: boolean;
}

export interface ProjectRow {
  name: string;
  href: string;
  summary: string;
  language?: string | null;
  lastPush?: string | null;
  since?: string | null;
}
