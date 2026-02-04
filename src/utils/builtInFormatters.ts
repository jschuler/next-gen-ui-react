import type { ReactNode } from "react";

import type { CellFormatter } from "../components/ComponentHandlerRegistry";

/**
 * Built-in formatters that can be registered in the ComponentHandlerRegistry.
 * These provide common formatting functionality that can be reused across components.
 */

/**
 * ISO Date Formatter
 * Automatically detects and formats ISO date strings (YYYY-MM-DD or ISO 8601 with time)
 * into a user-friendly format using Intl.DateTimeFormat.
 */
export const isoDateFormatter: CellFormatter = (value): string | ReactNode => {
  if (value === null || value === undefined) {
    return "";
  }

  const strValue = String(value);

  // Check for ISO date format and auto-format for display
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
  if (isoDatePattern.test(strValue)) {
    const date = new Date(strValue);
    if (!isNaN(date.getTime())) {
      // Format date based on whether it has time component
      const hasTime = strValue.includes("T");
      try {
        if (hasTime) {
          // Format with date and time
          return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(date);
        } else {
          // Format date only
          return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
          }).format(date);
        }
      } catch {
        // Fallback if Intl formatting fails
        return strValue;
      }
    }
  }

  // Not an ISO date, return as-is
  return strValue;
};

/**
 * ISO Date Pattern - exported for use in sorting/comparison logic
 */
export const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;

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
 * Renders true/false as "Yes"/"No". Accepts boolean or string "true"/"false".
 */
export const booleanFormatter: CellFormatter = (value): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const s = String(value).toLowerCase();
  if (s === "true" || s === "1") return "Yes";
  if (s === "false" || s === "0") return "No";
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

/**
 * Detects value type for auto-formatting. Used when no formatter is registered for a field.
 */
function detectValueType(
  value: string | number | boolean | null | (string | number)[]
): "empty" | "iso-date" | "boolean" | "number" | "string" {
  if (value === null || value === undefined) return "empty";
  if (Array.isArray(value)) return "string";
  const s = String(value).trim();
  if (s === "") return "empty";
  if (ISO_DATE_PATTERN.test(s)) return "iso-date";
  if (typeof value === "boolean") return "boolean";
  const lower = s.toLowerCase();
  if (lower === "true" || lower === "false") return "boolean";
  const num = typeof value === "number" ? value : parseFloat(s);
  if (!Number.isNaN(num)) {
    return "number";
  }
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

// =============================================================================
// Auto formatters (applied automatically when no formatter is resolved)
// =============================================================================

/**
 * Formatters that are applied automatically by autoFormatter when no formatter
 * is resolved from the registry. Keys match the return values of detectValueType.
 */
export const autoFormatters = {
  "iso-date": isoDateFormatter,
  boolean: booleanFormatter,
  number: numberFormatter,
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
//    which uses autoFormatters (empty, iso-date, boolean, number).
//
// 2. BY NAME (after registration)
//    Call registerAutoFormatters(registry) once. Then the registry has
//    all built-in ids for lookup by id/name/data_path. currency-usd and percent
//    are built-in but not auto-applied; register them for a field to use them.

/**
 * Map of built-in formatter id → formatter function. Includes autoFormatters
 * plus formatters that are only applied when registered (currency-usd, percent).
 * Used by registerAutoFormatters and for lookup by name.
 */
export const builtInFormatters = {
  ...autoFormatters,
  "currency-usd": currencyUsdFormatter,
  percent: percentFormatter,
} as const;

/** Union type of built-in formatter ids (for exclude/overrides options). */
export type BuiltInFormatterId = keyof typeof builtInFormatters;

/** List of built-in formatter ids (for exclude/overrides and docs). */
export const BUILT_IN_FORMATTER_IDS: BuiltInFormatterId[] = Object.keys(
  builtInFormatters
) as BuiltInFormatterId[];

/**
 * Options for registerAutoFormatters.
 */
export interface RegisterAutoFormattersOptions {
  /** Auto formatter ids to skip registering (e.g. `['boolean']`). Only auto formatters (iso-date, boolean, number, empty) can be excluded. */
  exclude?: AutoFormatterId[];
  /** Custom formatter per id; replaces the built-in for that id. */
  overrides?: Partial<Record<BuiltInFormatterId, CellFormatter>>;
}

/**
 * Registers built-in formatters in the registry so fields can use them by name.
 *
 * **Setup (two steps):**
 * 1. Wrap your app with `ComponentHandlerRegistryProvider`.
 * 2. Inside the provider, call this once (e.g. in a layout):
 *    `registerAutoFormatters(registry)`.
 *
 * **Behavior:**
 * - With no options: registers all six built-ins (iso-date, boolean, number,
 *   currency-usd, percent, empty) under those ids in the registry.
 * - When no formatter is resolved (by data_path, id, name), the resolver uses
 *   autoFormatter (type detection + built-ins).
 *
 * **Options (second argument):**
 * - `exclude`: do not register these auto formatter ids (iso-date, boolean, number, empty).
 * - `overrides`: use these functions instead of the built-in for that id.
 *
 * @param registry - From `useComponentHandlerRegistry()`.
 * @param options - Optional { exclude?, overrides? }.
 *
 * @example
 * Register all built-ins
 * ```tsx
 * const registry = useComponentHandlerRegistry();
 * useMemo(() => registerAutoFormatters(registry), [registry]);
 * ```
 *
 * @example
 * Opt-out of registering some auto formatters
 * ```tsx
 * registerAutoFormatters(registry, { exclude: ['boolean'] });
 * ```
 *
 * @example
 * Override one
 * ```tsx
 * registerAutoFormatters(registry, {
 *   overrides: { boolean: (v) => (v ? 'Y' : 'N') },
 * });
 * ```
 *
 * @example
 * Exclude and override
 * ```tsx
 * registerAutoFormatters(registry, {
 *   exclude: ['number'],
 *   overrides: { 'iso-date': myDateFormatter },
 * });
 * ```
 */

export function registerAutoFormatters(
  registry: {
    registerFormatter: (
      matchers: { id: string },
      formatter: CellFormatter,
      inputDataType?: string
    ) => void;
  },
  options?: RegisterAutoFormattersOptions
): void {
  const { exclude = [], overrides = {} } = options ?? {};
  const excludeSet = new Set(exclude);

  Object.entries(builtInFormatters).forEach(([id, formatter]) => {
    if (excludeSet.has(id as AutoFormatterId)) return;
    const resolved = overrides[id as BuiltInFormatterId] ?? formatter;
    registry.registerFormatter({ id }, resolved);
  });
}
