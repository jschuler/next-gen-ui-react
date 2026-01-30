import { isoDateFormatter } from "./builtInFormatters";

/**
 * Formats a value for display in UI components.
 * Handles arrays, null values, and basic type conversion.
 * ISO date formatting is now handled by builtInFormatters.isoDateFormatter
 * and should be registered in ComponentHandlerRegistry for better reusability.
 *
 * @param value - The value to format (string, number, boolean, null, or array)
 * @returns Formatted string representation of the value
 */
export const formatValue = (
  value: string | number | boolean | null | (string | number)[]
): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  const strValue = String(value);

  // Try ISO date formatting (using built-in formatter)
  // This maintains backward compatibility for components that don't use the registry
  const formatted = isoDateFormatter(strValue);
  if (formatted !== strValue) {
    return String(formatted);
  }

  return strValue;
};
