/**
 * Utility functions for generating CSS class names from component data
 */

/**
 * Sanitizes a string to be a valid CSS class name
 * @param value - The string to sanitize
 * @returns A sanitized string suitable for use as a CSS class name
 */
export function sanitizeClassName(value: string): string {
  return value
    .toString()
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

/**
 * Generates a component-level CSS class based on inputDataType
 * @param dataType - The input data type (e.g., "products", "servers")
 * @param prefix - The prefix for the class (e.g., "data-view", "one-card")
 * @returns A CSS class name like "data-view-products" or empty string if no dataType
 * @example
 * getDataTypeClass("products", "data-view") // returns "data-view-products"
 * getDataTypeClass("servers", "one-card") // returns "one-card-servers"
 * getDataTypeClass(undefined, "data-view") // returns ""
 */
export function getDataTypeClass(
  dataType?: string,
  prefix: string = "data-view"
): string {
  if (!dataType) return "";
  const sanitized = sanitizeClassName(dataType);
  return sanitized ? `${prefix}-${sanitized}` : "";
}
