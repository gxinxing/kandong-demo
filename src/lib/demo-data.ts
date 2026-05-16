/**
 * Offline-first demo data loader for 看懂一下.
 *
 * Single source of truth: `/public/demo-data.json`. Server components read
 * it directly from the filesystem (Node.js `fetch` cannot resolve relative
 * URLs); client components fetch over HTTP with `force-cache` so the
 * offline断网 demo never hits the network during the live presentation.
 */

export type DemoLevel = 'red' | 'yellow' | 'green';

export type DemoCaseId = 'demo-black' | 'demo-gray' | 'demo-white';

export interface DemoCase {
  id: DemoCaseId;
  level: DemoLevel;
  title: string;
  summary: string;
  points: readonly [string, string, string];
  emoji: string;
  why: string;
  action: string;
  shareText: string;
  exampleImage: string;
  voiceScript: string;
}

export interface DemoData {
  cases: readonly DemoCase[];
}

const DEMO_DATA_URL = '/demo-data.json';

let cached: DemoData | null = null;

const isServer = typeof window === 'undefined';

/**
 * Loads the three demo cases. On the server we read the JSON straight off
 * disk to avoid Node `fetch` rejecting relative URLs; on the client we use
 * `force-cache` so the file is fetched once and reused.
 */
export async function loadDemoData(): Promise<DemoData> {
  if (cached) {
    return cached;
  }

  if (isServer) {
    const { readFile } = await import('node:fs/promises');
    const path = await import('node:path');
    const filePath = path.join(process.cwd(), 'public', 'demo-data.json');
    const raw = await readFile(filePath, 'utf8');
    cached = JSON.parse(raw) as DemoData;
    return cached;
  }

  const res = await fetch(DEMO_DATA_URL, { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error(`Failed to load demo data: HTTP ${res.status}`);
  }
  cached = (await res.json()) as DemoData;
  return cached;
}

/**
 * Looks up a single demo case by id. Returns null if not found (instead of
 * throwing) so the page can decide whether to render a friendly fallback.
 */
export async function getCase(id: string): Promise<DemoCase | null> {
  const data = await loadDemoData();
  const found = data.cases.find((c) => c.id === id);
  return found ?? null;
}

/**
 * Type guard for runtime validation when data comes from an untrusted source
 * (e.g. a future LLM response that should match the demo shape).
 */
export function isDemoCase(value: unknown): value is DemoCase {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    (v.level === 'red' || v.level === 'yellow' || v.level === 'green') &&
    typeof v.title === 'string' &&
    typeof v.summary === 'string' &&
    Array.isArray(v.points) &&
    v.points.length === 3 &&
    v.points.every((p) => typeof p === 'string') &&
    typeof v.emoji === 'string' &&
    typeof v.why === 'string' &&
    typeof v.action === 'string' &&
    typeof v.shareText === 'string' &&
    typeof v.exampleImage === 'string' &&
    typeof v.voiceScript === 'string'
  );
}
