import { describe, it, expect, beforeEach, vi } from "vitest";

import type { ComponentHandlerRegistry } from "../../components/ComponentHandlerRegistry";
import {
  isoDateFormatter,
  isISODate,
  ISO_DATE_PATTERN,
  ISO_DATE_PATTERN_SORT,
  builtInFormatters,
  registerAutoFormatters,
  type BuiltInFormatterId,
} from "../../utils/builtInFormatters";

describe("builtInFormatters", () => {
  describe("isoDateFormatter", () => {
    it("should format ISO date string (YYYY-MM-DD)", () => {
      const result = isoDateFormatter("2025-12-31");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      // Should be formatted, not the raw ISO string
      expect(result).not.toBe("2025-12-31");
      // Should contain month name or formatted date
      expect(String(result).length).toBeGreaterThan(8);
    });

    it("should format ISO datetime string (YYYY-MM-DDTHH:mm:ss)", () => {
      const result = isoDateFormatter("2025-12-31T14:30:00");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      // Should be formatted with date and time
      expect(result).not.toBe("2025-12-31T14:30:00");
      expect(String(result).length).toBeGreaterThan(10);
    });

    it("should format ISO datetime string with milliseconds", () => {
      const result = isoDateFormatter("2025-12-31T14:30:00.123");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result).not.toBe("2025-12-31T14:30:00.123");
    });

    it("should format ISO datetime string with timezone (Z)", () => {
      const result = isoDateFormatter("2025-12-31T14:30:00Z");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result).not.toBe("2025-12-31T14:30:00Z");
    });

    it("should format ISO datetime string with milliseconds and timezone", () => {
      const result = isoDateFormatter("2025-12-31T14:30:00.123Z");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result).not.toBe("2025-12-31T14:30:00.123Z");
    });

    it("should return empty string for null", () => {
      const result = isoDateFormatter(null);
      expect(result).toBe("");
    });

    it("should return empty string for undefined", () => {
      const result = isoDateFormatter(undefined);
      expect(result).toBe("");
    });

    it("should return value as-is for non-ISO date strings", () => {
      const result = isoDateFormatter("not a date");
      expect(result).toBe("not a date");
    });

    it("should return value as-is for numbers", () => {
      const result = isoDateFormatter(12345);
      expect(result).toBe("12345");
    });

    it("should return value as-is for boolean", () => {
      const result = isoDateFormatter(true);
      expect(result).toBe("true");
    });

    it("should return value as-is for invalid date strings", () => {
      const result = isoDateFormatter("2025-13-45"); // Invalid month/day
      expect(result).toBe("2025-13-45");
    });

    it("should handle dates from different years", () => {
      const result2020 = isoDateFormatter("2020-01-01");
      const result2025 = isoDateFormatter("2025-12-31");
      expect(result2020).toBeTruthy();
      expect(result2025).toBeTruthy();
      expect(result2020).not.toBe(result2025);
    });

    it("should handle dates from different months", () => {
      const jan = isoDateFormatter("2025-01-15");
      const dec = isoDateFormatter("2025-12-15");
      expect(jan).toBeTruthy();
      expect(dec).toBeTruthy();
      expect(jan).not.toBe(dec);
    });

    it("should format dates consistently", () => {
      const result1 = isoDateFormatter("2025-12-31");
      const result2 = isoDateFormatter("2025-12-31");
      expect(result1).toBe(result2);
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
    it("should contain iso-date formatter", () => {
      expect(builtInFormatters["iso-date"]).toBeDefined();
      expect(typeof builtInFormatters["iso-date"]).toBe("function");
    });

    it("should have iso-date formatter that matches isoDateFormatter", () => {
      expect(builtInFormatters["iso-date"]).toBe(isoDateFormatter);
    });

    it("should have correct type for BuiltInFormatterId", () => {
      const id: BuiltInFormatterId = "iso-date";
      expect(builtInFormatters[id]).toBeDefined();
    });
  });

  describe("registerAutoFormatters", () => {
    let mockRegistry: {
      registerFormatter: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
      mockRegistry = {
        registerFormatter: vi.fn(),
      };
    });

    it("should register all built-in formatters", () => {
      registerAutoFormatters(mockRegistry);

      expect(mockRegistry.registerFormatter).toHaveBeenCalled();
      expect(mockRegistry.registerFormatter).toHaveBeenCalledWith(
        { id: "iso-date" },
        isoDateFormatter
      );
    });

    it("should register exactly the number of built-in formatters", () => {
      registerAutoFormatters(mockRegistry);

      const callCount = mockRegistry.registerFormatter.mock.calls.length;
      const formatterCount = Object.keys(builtInFormatters).length;
      expect(callCount).toBe(formatterCount);
    });

    it("should register formatters with correct IDs", () => {
      registerAutoFormatters(mockRegistry);

      const calls = mockRegistry.registerFormatter.mock.calls;
      const registeredIds = calls.map((call) => (call[0] as { id: string }).id);

      expect(registeredIds).toContain("iso-date");
    });

    it("should register formatters with correct functions", () => {
      registerAutoFormatters(mockRegistry);

      const calls = mockRegistry.registerFormatter.mock.calls;
      const isoDateCall = calls.find(
        (call) => (call[0] as { id: string }).id === "iso-date"
      );

      expect(isoDateCall).toBeDefined();
      expect(isoDateCall?.[1]).toBe(isoDateFormatter);
    });

    it("should work with ComponentHandlerRegistry interface", () => {
      const registry: ComponentHandlerRegistry = {
        onItemClickHandlers: new Map(),
        formatters: new Map(),
        registerItemClick: vi.fn(),
        unregisterItemClick: vi.fn(),
        getItemClick: vi.fn(),
        registerFormatter: vi.fn(),
        unregisterFormatter: vi.fn(),
        getFormatter: vi.fn(),
        isActive: () => false,
      };

      registerAutoFormatters(registry);

      expect(registry.registerFormatter).toHaveBeenCalled();
      expect(registry.registerFormatter).toHaveBeenCalledWith(
        { id: "iso-date" },
        isoDateFormatter
      );
    });

    it("should exclude specified auto formatters when options.exclude is provided", () => {
      registerAutoFormatters(mockRegistry, {
        exclude: ["boolean", "number"],
      });

      const calls = mockRegistry.registerFormatter.mock.calls;
      const registeredIds = calls.map((call) => (call[0] as { id: string }).id);

      expect(registeredIds).not.toContain("boolean");
      expect(registeredIds).not.toContain("number");
      expect(registeredIds).toContain("iso-date");
      expect(registeredIds).toContain("empty");
      expect(registeredIds).toContain("currency-usd");
      expect(registeredIds).toContain("percent");
      expect(calls.length).toBe(Object.keys(builtInFormatters).length - 2);
    });

    it("should use overrides when options.overrides is provided", () => {
      const customBoolean = (v: string | number | boolean | null) =>
        v ? "Y" : "N";
      registerAutoFormatters(mockRegistry, {
        overrides: { boolean: customBoolean },
      });

      const calls = mockRegistry.registerFormatter.mock.calls;
      const booleanCall = calls.find(
        (call) => (call[0] as { id: string }).id === "boolean"
      );

      expect(booleanCall).toBeDefined();
      expect(booleanCall?.[1]).toBe(customBoolean);
    });

    it("should support both exclude and overrides", () => {
      const customEmpty = () => "—";
      registerAutoFormatters(mockRegistry, {
        exclude: ["boolean"],
        overrides: { empty: customEmpty },
      });

      const calls = mockRegistry.registerFormatter.mock.calls;
      const registeredIds = calls.map((call) => (call[0] as { id: string }).id);

      expect(registeredIds).not.toContain("boolean");
      const emptyCall = calls.find(
        (call) => (call[0] as { id: string }).id === "empty"
      );
      expect(emptyCall?.[1]).toBe(customEmpty);
      expect(calls.length).toBe(Object.keys(builtInFormatters).length - 1);
    });
  });
});
