import React, { type ReactNode } from "react";

import type { CellFormatter } from "../components/ComponentHandlerRegistry";

/** Pattern for a string that is a single URL (http or https). */
const URL_PATTERN = /^https?:\/\/\S+$/;

/**
 * Built-in formatters that can be registered in the ComponentHandlerRegistry.
 * These provide common formatting functionality that can be reused across components.
 */

/**
 * DateTime formatter (ISO date strings + Unix timestamps)
 * Accepts ISO date strings (YYYY-MM-DD or ISO 8601 with time, including relaxed
 * patterns like space before time or timezone offset) and Unix timestamps
 * (10-digit seconds or 13-digit milliseconds). Renders with Intl.DateTimeFormat
 * (medium date; short time when a time component is present).
 */
export const datetimeFormatter: CellFormatter = (value): string | ReactNode => {
  if (value === null || value === undefined) return "";

  const strValue = String(value).trim();
  let date: Date | null = null;
  let hasTime = false;

  // 1) Unix timestamp (number or string in valid range)
  if (isUnixTimestamp(value)) {
    if (typeof value === "number") {
      date =
        value >= 1e9 && value < 1e10 ? new Date(value * 1000) : new Date(value);
    } else {
      const num = Number(strValue);
      date = strValue.length <= 10 ? new Date(num * 1000) : new Date(num);
    }
    hasTime = true;
  }
  // 2) ISO date string (strict or relaxed)
  else if (
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

/**
 * URL formatter
 * Renders strings that look like a single URL (http:// or https://) as a clickable
 * link that opens in a new tab (target="_blank", rel="noopener noreferrer").
 * Non-URL values are returned as-is.
 */
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

/**
 * ISO Date Pattern - exported for use in sorting/comparison logic
 */
export const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;

/**
 * Relaxed ISO/date pattern: space or T before time, optional timezone offset (e.g. +00:00).
 * Used by datetimeFormatter for strings like "2023-11-02 12:00:00" or "2023-11-02T12:00:00+00:00".
 */
const ISO_DATE_PATTERN_RELAXED =
  /^\d{4}-\d{2}-\d{2}([T\s]\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:?\d{2})?)?$/;

/**
 * ISO Date Pattern for sorting (less strict - allows partial matches)
 */
export const ISO_DATE_PATTERN_SORT = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;

/**
 * Check if a value is an ISO date string
 */
export const isISODate = (value: string | number | boolean | null): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  return ISO_DATE_PATTERN.test(String(value));
};

/**
 * Boolean formatter
 * Renders true/false as "Yes"/"No". Accepts only boolean or string "true"/"false"
 * (not "1"/"0", to avoid misformatting numeric codes).
 */
export const booleanFormatter: CellFormatter = (value): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const s = String(value).toLowerCase();
  if (s === "true") return "Yes";
  if (s === "false") return "No";
  return String(value);
};

/**
 * Number formatter
 * Uses Intl.NumberFormat for locale-aware number display (e.g. 1234.5 → "1,234.5").
 * Preserves integers as-is for decimals; uses up to 2 decimal places for floats.
 */
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

/**
 * Creates a currency formatter for a given ISO 4217 currency code (e.g. "USD", "EUR", "GBP").
 * Uses Intl.NumberFormat with the default locale; pass a locale as the second argument to override.
 */
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

/**
 * Currency (USD) formatter. For other currencies use createCurrencyFormatter("EUR"), etc.
 */
export const currencyUsdFormatter: CellFormatter =
  createCurrencyFormatter("USD");

/**
 * Percent formatter
 * Treats value as a decimal (0–1) and displays as percentage (e.g. 0.85 → "85%", 1 → "100%").
 */
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

/**
 * Empty / null formatter
 * Renders null, undefined, or empty string as an em dash (—). Other values as string.
 */
export const emptyFormatter: CellFormatter = (value): string => {
  if (value === null || value === undefined) return "—";
  const s = String(value).trim();
  return s === "" ? "—" : s;
};

/** True if value looks like a Unix timestamp (seconds or ms in valid range). */
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

/**
 * Detects value type for auto-formatting. Used when no formatter is registered for a field.
 */
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

/**
 * Auto formatter: detects value type and applies the matching formatter from
 * autoFormatters. Used when no formatter is resolved from the registry.
 */
export const autoFormatter: CellFormatter = (value): string | ReactNode => {
  const type = detectValueType(value);
  const formatter =
    type in autoFormatters
      ? autoFormatters[type as keyof typeof autoFormatters]
      : undefined;
  return formatter ? formatter(value) : String(value);
};

/**
 * Options to opt out of or override auto formatters. Pass to
 * ComponentHandlerRegistryProvider as the autoFormatterOptions prop.
 */
export interface AutoFormatterOptions {
  /** Auto formatter ids to skip (e.g. ["boolean", "number"]). Excluded types are rendered as String(value). */
  exclude?: AutoFormatterId[];
  /** Custom formatter per auto type, replacing the built-in (e.g. { boolean: (v) => v ? "Y" : "N" }). */
  overrides?: Partial<Record<AutoFormatterId, CellFormatter>>;
}

/**
 * Returns a formatter that behaves like autoFormatter but respects exclude and overrides.
 * Used by the resolver when the provider has autoFormatterOptions set.
 */
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

// =============================================================================
// Auto formatters (applied automatically when no formatter is resolved)
// =============================================================================

/**
 * Formatters that are applied automatically by autoFormatter when no formatter
 * is resolved from the registry. Keys match the return values of detectValueType.
 */
export const autoFormatters = {
  datetime: datetimeFormatter,
  boolean: booleanFormatter,
  number: numberFormatter,
  url: urlFormatter,
  empty: emptyFormatter,
} as const;

export type AutoFormatterId = keyof typeof autoFormatters;

// =============================================================================
// Built-in formatters (auto + register-only)
// =============================================================================
//
// Two ways to use these formatters:
//
// 1. AUTO BY TYPE (no registration)
//    When no formatter is resolved for a field, the resolver uses autoFormatter,
//    which uses autoFormatters (datetime, boolean, number, url, empty).
//
// 2. CURRENCY / PERCENT (opt-in only)
//    currency-usd and percent are not registered. Use builtInFormatters and
//    register under your own keys, e.g. registerFormatterById("price", builtInFormatters["currency-usd"]).

/**
 * Map of built-in formatter id → formatter function. Includes autoFormatters
 * plus formatters that are only applied when registered (currency-usd, percent).
 * Use with registerFormatterById for custom keys (e.g. "price" → currency-usd).
 */
export const builtInFormatters = {
  ...autoFormatters,
  "currency-usd": currencyUsdFormatter,
  percent: percentFormatter,
} as const;

/** Union type of built-in formatter ids. */
export type BuiltInFormatterId = keyof typeof builtInFormatters;

/** List of built-in formatter ids. */
export const BUILT_IN_FORMATTER_IDS: BuiltInFormatterId[] = Object.keys(
  builtInFormatters
) as BuiltInFormatterId[];
