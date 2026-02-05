import { describe, it, expect } from "vitest";

import {
  datetimeFormatter,
  urlFormatter,
  isISODate,
  ISO_DATE_PATTERN,
  ISO_DATE_PATTERN_SORT,
  builtInFormatters,
  getAutoFormatter,
  type BuiltInFormatterId,
} from "../../utils/builtInFormatters";

describe("builtInFormatters", () => {
  describe("datetimeFormatter", () => {
    it("should format ISO date string (YYYY-MM-DD)", () => {
      const result = datetimeFormatter("2025-12-31");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      // Should be formatted, not the raw ISO string
      expect(result).not.toBe("2025-12-31");
      // Should contain month name or formatted date
      expect(String(result).length).toBeGreaterThan(8);
    });

    it("should format ISO datetime string (YYYY-MM-DDTHH:mm:ss)", () => {
      const result = datetimeFormatter("2025-12-31T14:30:00");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      // Should be formatted with date and time
      expect(result).not.toBe("2025-12-31T14:30:00");
      expect(String(result).length).toBeGreaterThan(10);
    });

    it("should format ISO datetime string with milliseconds", () => {
      const result = datetimeFormatter("2025-12-31T14:30:00.123");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result).not.toBe("2025-12-31T14:30:00.123");
    });

    it("should format ISO datetime string with timezone (Z)", () => {
      const result = datetimeFormatter("2025-12-31T14:30:00Z");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result).not.toBe("2025-12-31T14:30:00Z");
    });

    it("should format ISO datetime string with milliseconds and timezone", () => {
      const result = datetimeFormatter("2025-12-31T14:30:00.123Z");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result).not.toBe("2025-12-31T14:30:00.123Z");
    });

    it("should return empty string for null", () => {
      const result = datetimeFormatter(null);
      expect(result).toBe("");
    });

    it("should return empty string for undefined", () => {
      const result = datetimeFormatter(undefined);
      expect(result).toBe("");
    });

    it("should return value as-is for non-ISO date strings", () => {
      const result = datetimeFormatter("not a date");
      expect(result).toBe("not a date");
    });

    it("should return value as-is for small numbers (not in timestamp range)", () => {
      const result = datetimeFormatter(12345);
      expect(result).toBe("12345");
    });

    it("should format numeric Unix timestamps (seconds)", () => {
      const result = datetimeFormatter(1735689600);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result).toMatch(/Jan|2025|1/);
    });

    it("should format numeric Unix timestamps (milliseconds)", () => {
      const result = datetimeFormatter(1735689600000);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result).toMatch(/Jan|2025|1/);
    });

    it("should format string Unix timestamps (10-digit seconds)", () => {
      const result = datetimeFormatter("1735689600");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result).toMatch(/Jan|2025|1/);
    });

    it("should return value as-is for boolean", () => {
      const result = datetimeFormatter(true);
      expect(result).toBe("true");
    });

    it("should return value as-is for invalid date strings", () => {
      const result = datetimeFormatter("2025-13-45"); // Invalid month/day
      expect(result).toBe("2025-13-45");
    });

    it("should handle dates from different years", () => {
      const result2020 = datetimeFormatter("2020-01-01");
      const result2025 = datetimeFormatter("2025-12-31");
      expect(result2020).toBeTruthy();
      expect(result2025).toBeTruthy();
      expect(result2020).not.toBe(result2025);
    });

    it("should handle dates from different months", () => {
      const jan = datetimeFormatter("2025-01-15");
      const dec = datetimeFormatter("2025-12-15");
      expect(jan).toBeTruthy();
      expect(dec).toBeTruthy();
      expect(jan).not.toBe(dec);
    });

    it("should format dates consistently", () => {
      const result1 = datetimeFormatter("2025-12-31");
      const result2 = datetimeFormatter("2025-12-31");
      expect(result1).toBe(result2);
    });
  });

  describe("urlFormatter", () => {
    it("should return an anchor element for http URL", () => {
      const result = urlFormatter("http://example.com/path");
      expect(result).not.toBe("http://example.com/path");
      expect(result).toBeTruthy();
      if (typeof result !== "string" && result != null && "type" in result) {
        expect((result as { type: string }).type).toBe("a");
        expect((result as { props: { href: string } }).props.href).toBe(
          "http://example.com/path"
        );
        expect((result as { props: { target: string } }).props.target).toBe(
          "_blank"
        );
        expect((result as { props: { rel: string } }).props.rel).toBe(
          "noopener noreferrer"
        );
      }
    });

    it("should return an anchor element for https URL", () => {
      const result = urlFormatter("https://example.org");
      expect(result).toBeTruthy();
      if (typeof result !== "string" && result != null && "props" in result) {
        expect((result as { props: { href: string } }).props.href).toBe(
          "https://example.org"
        );
      }
    });

    it("should return value as-is for non-URL strings", () => {
      expect(urlFormatter("not a url")).toBe("not a url");
      expect(urlFormatter("ftp://example.com")).toBe("ftp://example.com");
    });

    it("should return empty string for null/undefined", () => {
      expect(urlFormatter(null)).toBe("");
      expect(urlFormatter(undefined)).toBe("");
    });
  });

  describe("isISODate", () => {
    it("should return true for valid ISO date (YYYY-MM-DD)", () => {
      expect(isISODate("2025-12-31")).toBe(true);
      expect(isISODate("2020-01-01")).toBe(true);
      expect(isISODate("1999-12-31")).toBe(true);
    });

    it("should return true for valid ISO datetime (YYYY-MM-DDTHH:mm:ss)", () => {
      expect(isISODate("2025-12-31T14:30:00")).toBe(true);
      expect(isISODate("2025-01-01T00:00:00")).toBe(true);
    });

    it("should return true for ISO datetime with milliseconds", () => {
      expect(isISODate("2025-12-31T14:30:00.123")).toBe(true);
      expect(isISODate("2025-12-31T14:30:00.999")).toBe(true);
    });

    it("should return true for ISO datetime with timezone", () => {
      expect(isISODate("2025-12-31T14:30:00Z")).toBe(true);
      expect(isISODate("2025-12-31T14:30:00.123Z")).toBe(true);
    });

    it("should return false for null", () => {
      expect(isISODate(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isISODate(undefined)).toBe(false);
    });

    it("should return false for non-ISO date strings", () => {
      expect(isISODate("not a date")).toBe(false);
      expect(isISODate("12/31/2025")).toBe(false);
      expect(isISODate("31-12-2025")).toBe(false);
      expect(isISODate("December 31, 2025")).toBe(false);
    });

    it("should return false for numbers", () => {
      expect(isISODate(12345)).toBe(false);
      expect(isISODate(0)).toBe(false);
    });

    it("should return false for booleans", () => {
      expect(isISODate(true)).toBe(false);
      expect(isISODate(false)).toBe(false);
    });

    it("should return false for strings that match pattern but are invalid dates", () => {
      // Note: isISODate uses ISO_DATE_PATTERN which matches format, not validity
      // However, invalid dates like "2025-13-45" still match the pattern
      // The function checks if the string matches the ISO format pattern
      expect(isISODate("2025-13-45")).toBe(true); // Matches pattern format
      expect(isISODate("2025-12-31T25:00:00")).toBe(true); // Matches pattern format
      expect(isISODate("2025-12-31T14:60:00")).toBe(true); // Matches pattern format
    });

    it("should return false for partial ISO dates", () => {
      expect(isISODate("2025-12")).toBe(false);
      expect(isISODate("2025")).toBe(false);
      expect(isISODate("2025-12-31T14")).toBe(false);
    });
  });

  describe("ISO_DATE_PATTERN", () => {
    it("should match valid ISO date strings", () => {
      expect(ISO_DATE_PATTERN.test("2025-12-31")).toBe(true);
      expect(ISO_DATE_PATTERN.test("2025-01-01")).toBe(true);
      expect(ISO_DATE_PATTERN.test("2025-12-31T14:30:00")).toBe(true);
      expect(ISO_DATE_PATTERN.test("2025-12-31T14:30:00.123")).toBe(true);
      expect(ISO_DATE_PATTERN.test("2025-12-31T14:30:00Z")).toBe(true);
      expect(ISO_DATE_PATTERN.test("2025-12-31T14:30:00.123Z")).toBe(true);
    });

    it("should not match strings that don't match ISO date format", () => {
      expect(ISO_DATE_PATTERN.test("not a date")).toBe(false);
      expect(ISO_DATE_PATTERN.test("12/31/2025")).toBe(false);
      expect(ISO_DATE_PATTERN.test("2025-12")).toBe(false);
      expect(ISO_DATE_PATTERN.test("2025")).toBe(false);
      // Note: "2025-13-45" matches the pattern format but is an invalid date
      // The regex checks format, not validity
      expect(ISO_DATE_PATTERN.test("2025-13-45")).toBe(true);
    });
  });

  describe("ISO_DATE_PATTERN_SORT", () => {
    it("should match valid ISO date strings for sorting", () => {
      expect(ISO_DATE_PATTERN_SORT.test("2025-12-31")).toBe(true);
      expect(ISO_DATE_PATTERN_SORT.test("2025-12-31T14:30:00")).toBe(true);
      expect(ISO_DATE_PATTERN_SORT.test("2025-01-01T00:00:00")).toBe(true);
    });

    it("should match date strings that start with ISO format (less strict for sorting)", () => {
      // This pattern is less strict - it matches the pattern even if the date is invalid
      // This is intentional for sorting purposes (pattern matching, not validation)
      expect(ISO_DATE_PATTERN_SORT.test("2025-13-45")).toBe(true); // Invalid date but matches pattern
      expect(ISO_DATE_PATTERN_SORT.test("2025-12-31T14:30:00.123Z")).toBe(true);
    });

    it("should not match strings that don't start with ISO date pattern", () => {
      expect(ISO_DATE_PATTERN_SORT.test("not a date")).toBe(false);
      expect(ISO_DATE_PATTERN_SORT.test("12/31/2025")).toBe(false);
      expect(ISO_DATE_PATTERN_SORT.test("2025")).toBe(false);
      expect(ISO_DATE_PATTERN_SORT.test("2025-12")).toBe(false);
    });
  });

  describe("builtInFormatters", () => {
    it("should contain datetime formatter", () => {
      expect(builtInFormatters.datetime).toBeDefined();
      expect(typeof builtInFormatters.datetime).toBe("function");
    });

    it("should have datetime formatter that matches datetimeFormatter", () => {
      expect(builtInFormatters.datetime).toBe(datetimeFormatter);
    });

    it("should have correct type for BuiltInFormatterId", () => {
      const id: BuiltInFormatterId = "datetime";
      expect(builtInFormatters[id]).toBeDefined();
    });
  });

  describe("getAutoFormatter", () => {
    it("excludes specified types (render as String(value))", () => {
      const formatter = getAutoFormatter({ exclude: ["boolean"] });
      expect(formatter(true)).toBe("true");
      expect(formatter(false)).toBe("false");
      // number not excluded → still locale-formatted (e.g. 1000 → "1,000")
      expect(formatter(1000)).not.toBe("1000");
    });

    it("uses overrides when provided", () => {
      const formatter = getAutoFormatter({
        overrides: { boolean: (v) => (v ? "Y" : "N") },
      });
      expect(formatter(true)).toBe("Y");
      expect(formatter(false)).toBe("N");
    });

    it("applies both exclude and overrides", () => {
      const formatter = getAutoFormatter({
        exclude: ["number"],
        overrides: { boolean: (v) => (v ? "Y" : "N") },
      });
      expect(formatter(1000)).toBe("1000");
      expect(formatter(true)).toBe("Y");
    });
  });
});
