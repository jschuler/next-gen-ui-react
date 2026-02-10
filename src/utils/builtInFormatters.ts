import React, { type ReactNode } from "react";

import type { CellFormatter } from "../components/ComponentHandlerRegistry";

const URL_PATTERN = /^https?:\/\/\S+$/;

/**
 * Formats date/time values for display using Intl.DateTimeFormat.
 *
 * **Accepted formats:**
 *
 * 1. **ISO date** (date only → medium date):
 *    - `"2025-01-15"`
 *
 * 2. **ISO date-time** (date + time → medium date + short time):
 *    - `"2025-01-15T14:30:00Z"`
 *    - `"2025-01-15T14:30:00.000Z"`
 *    - `"2025-01-15 14:30:00"` (space instead of T)
 *    - `"2025-01-15T14:30:00+01:00"`
 *
 * 3. **Unix timestamps** (seconds or milliseconds):
 *    - `1735689600` (10-digit, seconds)
 *    - `1735689600000` (13-digit, milliseconds)
 *
 * Unparseable values are returned as-is. Renders locale-aware (e.g. "Jan 15, 2025, 2:30 PM").
 */
export const datetimeFormatter: CellFormatter = (value): string | ReactNode => {
  if (value === null || value === undefined) return "";

  const strValue = String(value).trim();
  let date: Date | null = null;
  let hasTime = false;

  if (isUnixTimestamp(value)) {
    if (typeof value === "number") {
      date =
        value >= 1e9 && value < 1e10 ? new Date(value * 1000) : new Date(value);
    } else {
      const num = Number(strValue);
      date = strValue.length <= 10 ? new Date(num * 1000) : new Date(num);
    }
    hasTime = true;
  } else if (
    ISO_DATE_PATTERN.test(strValue) ||
    ISO_DATE_PATTERN_RELAXED.test(strValue)
  ) {
    date = new Date(strValue);
    hasTime = strValue.includes("T") || /\d{2}:\d{2}/.test(strValue);
  }

  if (date == null || isNaN(date.getTime())) return strValue;

  try {
    if (hasTime) {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    }
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(date);
  } catch {
    return strValue;
  }
};

/** http/https strings → clickable link (new tab). Others as-is. */
export const urlFormatter: CellFormatter = (value): string | ReactNode => {
  if (value === null || value === undefined) return "";
  const s = String(value).trim();
  if (s === "" || !URL_PATTERN.test(s)) return s;
  return React.createElement(
    "a",
    {
      href: s,
      target: "_blank",
      rel: "noopener noreferrer",
    },
    s
  );
};

/** ISO date pattern (exported for sorting/comparison). */
export const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;

/** Relaxed ISO: space or T before time, optional timezone. */
const ISO_DATE_PATTERN_RELAXED =
  /^\d{4}-\d{2}-\d{2}([T\s]\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:?\d{2})?)?$/;

/** ISO date pattern for sorting (partial match). */
export const ISO_DATE_PATTERN_SORT = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;

/** True if value matches ISO date pattern. */
export const isISODate = (value: string | number | boolean | null): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  return ISO_DATE_PATTERN.test(String(value));
};

/** true/false or "true"/"false" → Yes/No. */
export const booleanFormatter: CellFormatter = (value): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const s = String(value).toLowerCase();
  if (s === "true") return "Yes";
  if (s === "false") return "No";
  return String(value);
};

/** Locale-aware number (Intl); up to 2 decimal places for floats. */
export const numberFormatter: CellFormatter = (value): string => {
  if (value === null || value === undefined) return "";
  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (Number.isNaN(num)) return String(value);
  const isInteger = Number.isInteger(num);
  try {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: isInteger ? 0 : 2,
      minimumFractionDigits: 0,
    }).format(num);
  } catch {
    return String(value);
  }
};

/** Currency formatter for ISO 4217 code (e.g. "USD"); optional locale. */
export function createCurrencyFormatter(
  currency: string,
  locale?: string
): CellFormatter {
  return (value): string => {
    if (value === null || value === undefined) return "";
    const num = typeof value === "number" ? value : parseFloat(String(value));
    if (Number.isNaN(num)) return String(value);
    try {
      return new Intl.NumberFormat(locale ?? undefined, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    } catch {
      return String(value);
    }
  };
}

export const currencyUsdFormatter: CellFormatter =
  createCurrencyFormatter("USD");

/** Decimal 0–1 → percentage (e.g. 0.85 → "85%"). */
export const percentFormatter: CellFormatter = (value): string => {
  if (value === null || value === undefined) return "";
  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (Number.isNaN(num)) return String(value);
  const display = num * 100;
  try {
    const formatted = new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    }).format(display);
    return `${formatted}%`;
  } catch {
    return `${num}%`;
  }
};

/** null/undefined/empty → —; else string. */
export const emptyFormatter: CellFormatter = (value): string => {
  if (value === null || value === undefined) return "—";
  const s = String(value).trim();
  return s === "" ? "—" : s;
};

function isUnixTimestamp(value: unknown): boolean {
  if (typeof value !== "number" && typeof value !== "string") return false;
  if (typeof value === "number" && Number.isFinite(value)) {
    return (value >= 1e9 && value < 1e10) || (value >= 1e12 && value < 1e14);
  }
  if (/^\d{10}$/.test(String(value).trim())) {
    const n = Number(value);
    return n >= 1e9;
  }
  if (/^\d{13}$/.test(String(value).trim())) {
    const n = Number(value);
    return n >= 1e12 && n < 1e14;
  }
  return false;
}

function detectValueType(
  value: string | number | boolean | null | (string | number)[]
): "empty" | "datetime" | "boolean" | "number" | "url" | "string" {
  if (value === null || value === undefined) return "empty";
  if (Array.isArray(value)) return "string";
  const s = String(value).trim();
  if (s === "") return "empty";
  if (isUnixTimestamp(value)) return "datetime";
  if (ISO_DATE_PATTERN.test(s) || ISO_DATE_PATTERN_RELAXED.test(s))
    return "datetime";
  if (typeof value === "boolean") return "boolean";
  const lower = s.toLowerCase();
  if (lower === "true" || lower === "false") return "boolean";
  const num = typeof value === "number" ? value : parseFloat(s);
  if (!Number.isNaN(num)) return "number";
  if (URL_PATTERN.test(s)) return "url";
  return "string";
}

/** Fallback: detect type and apply matching auto formatter. */
export const autoFormatter: CellFormatter = (value): string | ReactNode => {
  const type = detectValueType(value);
  const formatter =
    type in autoFormatters
      ? autoFormatters[type as keyof typeof autoFormatters]
      : undefined;
  return formatter ? formatter(value) : String(value);
};

/** Options for provider autoFormatterOptions prop. */
export interface AutoFormatterOptions {
  /** Ids to skip; excluded → String(value). */
  exclude?: AutoFormatterId[];
  /** Custom formatter per type. */
  overrides?: Partial<Record<AutoFormatterId, CellFormatter>>;
}

/** autoFormatter with exclude/overrides applied. */
export function getAutoFormatter(options: AutoFormatterOptions): CellFormatter {
  const excludeSet = new Set(options.exclude ?? []);
  const overrides = options.overrides ?? {};
  return (value): string | ReactNode => {
    const type = detectValueType(value);
    if (excludeSet.has(type as AutoFormatterId)) return String(value);
    const override = overrides[type as AutoFormatterId];
    if (override) return override(value);
    const formatter =
      type in autoFormatters
        ? autoFormatters[type as keyof typeof autoFormatters]
        : undefined;
    return formatter ? formatter(value) : String(value);
  };
}

/** Auto-applied when no formatter is resolved. Keys match detectValueType. */
export const autoFormatters = {
  datetime: datetimeFormatter,
  boolean: booleanFormatter,
  number: numberFormatter,
  url: urlFormatter,
  empty: emptyFormatter,
} as const;

export type AutoFormatterId = keyof typeof autoFormatters;

/** All built-ins: auto formatters + currency-usd, percent (use via registerFormatterById). */
export const builtInFormatters = {
  ...autoFormatters,
  "currency-usd": currencyUsdFormatter,
  percent: percentFormatter,
} as const;

export type BuiltInFormatterId = keyof typeof builtInFormatters;

export const BUILT_IN_FORMATTER_IDS: BuiltInFormatterId[] = Object.keys(
  builtInFormatters
) as BuiltInFormatterId[];
