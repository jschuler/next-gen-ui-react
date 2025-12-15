/**
 * Formats a value for display in UI components.
 * Handles ISO date formatting, arrays, null values, and basic type conversion.
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

  return strValue;
};
