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
 * Collection of all built-in formatters
 * These can be registered in the ComponentHandlerRegistry
 */
export const builtInFormatters = {
  "iso-date": isoDateFormatter,
} as const;

/**
 * Type for built-in formatter IDs
 */
export type BuiltInFormatterId = keyof typeof builtInFormatters;

/**
 * Helper function to register all built-in formatters in a registry
 * @param registry - The ComponentHandlerRegistry instance
 * @example
 * ```tsx
 * const registry = useComponentHandlerRegistry();
 * registerBuiltInFormatters(registry);
 * ```
 */
export function registerBuiltInFormatters(registry: {
  registerFormatterById: (
    id: string,
    formatter: CellFormatter,
    inputDataType?: string
  ) => void;
}): void {
  Object.entries(builtInFormatters).forEach(([id, formatter]) => {
    registry.registerFormatterById(id, formatter);
  });
}
