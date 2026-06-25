// Shared helpers for the dedicated print routes (RequisitionSummaryPrint,
// PrintableView, PcuPrintableView, AccountingReportPrint,
// ApprovalMemoPrint). Kept here so a single regex/policy change applies
// everywhere instead of being copy-pasted into five near-identical files.

const ID_INTEGER_RE = /^\d+$/;
const ID_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Parse a route-query id into either a positive integer or a UUID string.
 *
 * Supabase's TypeScript types still declare most primary keys as `number`,
 * but production has surfaced at least one column that is actually a `uuid`.
 * Accepting both shapes lets the same print page work against either schema
 * without forcing every caller to regenerate types first. Non-empty strings
 * that match neither pattern are rejected so a malformed value never reaches
 * PostgREST as a literal "NaN" or empty string.
 *
 * Returns `null` when the input is unusable, in which case the caller
 * should abort the print job and surface a clear error to the user.
 */
export function parseId(raw: unknown): number | string | null {
  if (typeof raw !== 'string' || raw.length === 0) return null;
  if (ID_INTEGER_RE.test(raw)) return Number.parseInt(raw, 10);
  if (ID_UUID_RE.test(raw)) return raw;
  return null;
}

/**
 * Render an unknown caught error as a human-readable string.
 *
 * The previous idiom
 *   err instanceof Error ? err.message : String(err)
 * silently degrades to "[object Object]" when Supabase rejects with a plain
 * `{message, details, hint, code}` object (the shape produced by transport /
 * network failures). This helper walks the most common shapes and falls
 * back to JSON.stringify so the next failure surfaces an actionable message
 * instead of an opaque object stringification.
 */
export function formatUnknownError(err: unknown): string {
  if (err === null) return 'null';
  if (err === undefined) return 'undefined';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (typeof err === 'object') {
    const obj = err as { message?: unknown; code?: unknown; details?: unknown };
    if (typeof obj.message === 'string' && obj.message.length > 0) {
      return obj.message;
    }
    try {
      return JSON.stringify(err);
    } catch {
      return '[unserializable error]';
    }
  }
  return String(err);
}
