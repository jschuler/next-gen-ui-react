import React, {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";

import { debugLog } from "../utils/debug";

/**
 * Type definitions for component handlers
 */
export type ItemClickHandler = (
  event: React.MouseEvent | React.KeyboardEvent,
  itemData: Record<string, string | number | boolean | null>
) => void;
export type CellFormatter = (
  value: string | number | boolean | null | (string | number)[]
) => React.ReactNode | string | number;

/**
 * Context for data-aware formatter selection
 */
export interface FormatterContext {
  fieldId?: string;
  fieldName?: string;
  dataPath?: string;
  inputDataType?: string;
  componentId?: string;
}

/**
 * Matchers for registerFormatter. All provided criteria must match.
 * Use when a single pattern (e.g. dataPath /products/) matches too many fields
 * and you want to narrow by name or id (e.g. dataPath /products/ AND name "Status").
 */
export interface FormatterContextMatcher {
  id?: string | RegExp;
  name?: string | RegExp;
  dataPath?: string | RegExp;
}

/**
 * Handler resolver interface for resolving formatter and onItemClick identifiers
 * This is used by DataViewWrapper to resolve string identifiers to functions
 */
export interface HandlerResolver {
  getFormatter?: (
    id: string,
    context?: FormatterContext
  ) => CellFormatter | undefined;
  getItemClick?: (inputDataType: string) => ItemClickHandler | undefined;
}

/**
 * Registry for component handlers (onItemClick, formatters, etc.)
 * Supports data-aware formatter selection based on context
 */
export interface ComponentHandlerRegistry {
  onItemClickHandlers: Map<string, ItemClickHandler>;
  formatters: Map<string, CellFormatter>;
  registerItemClick: (
    inputDataType: string | RegExp,
    handler: ItemClickHandler
  ) => void;
  unregisterItemClick: (inputDataType: string | RegExp) => void;
  getItemClick: (
    inputDataType: string | null | undefined
  ) => ItemClickHandler | undefined;
  /**
   * Register a formatter that matches when all provided context criteria match.
   * Use id, name, and/or dataPath (string or RegExp). All provided criteria must match.
   * @param matchers - Criteria that must all match: id, name, and/or dataPath (string or RegExp)
   * @param formatter - The formatter function
   * @param inputDataType - Optional: If provided (string or RegExp), formatter will only match when input_data_type matches
   */
  registerFormatter: (
    matchers: FormatterContextMatcher,
    formatter: CellFormatter,
    inputDataType?: string | RegExp
  ) => void;
  /**
   * Unregister a formatter that was registered with registerFormatter.
   * Pass the same matchers (and optional inputDataType) used at registration to remove that entry.
   */
  unregisterFormatter: (
    matchers: FormatterContextMatcher,
    inputDataType?: string | RegExp
  ) => void;
  /** Convenience: register a formatter by field id. Wraps registerFormatter({ id }, formatter, inputDataType). */
  registerFormatterById: (
    id: string | RegExp,
    formatter: CellFormatter,
    inputDataType?: string | RegExp
  ) => void;
  /** Convenience: register a formatter by field name. Wraps registerFormatter({ name }, formatter, inputDataType). */
  registerFormatterByName: (
    name: string | RegExp,
    formatter: CellFormatter,
    inputDataType?: string | RegExp
  ) => void;
  /** Convenience: register a formatter by data path. Wraps registerFormatter({ dataPath }, formatter, inputDataType). */
  registerFormatterByDataPath: (
    dataPath: string | RegExp,
    formatter: CellFormatter,
    inputDataType?: string | RegExp
  ) => void;
  /** Convenience: unregister a formatter by field id. Wraps unregisterFormatter({ id }, inputDataType). */
  unregisterFormatterById: (
    id: string | RegExp,
    inputDataType?: string | RegExp
  ) => void;
  /** Convenience: unregister a formatter by field name. Wraps unregisterFormatter({ name }, inputDataType). */
  unregisterFormatterByName: (
    name: string | RegExp,
    inputDataType?: string | RegExp
  ) => void;
  /** Convenience: unregister a formatter by data path. Wraps unregisterFormatter({ dataPath }, inputDataType). */
  unregisterFormatterByDataPath: (
    dataPath: string | RegExp,
    inputDataType?: string | RegExp
  ) => void;
  /**
   * Returns true if the registry is active (has a provider), false if it's a no-op
   */
  isActive: () => boolean;
  /**
   * Get formatter by identifier, with optional context for data-aware selection.
   */
  getFormatter: (
    id: string | null | undefined,
    context?: FormatterContext
  ) => CellFormatter | undefined;
}

const ComponentHandlerRegistryContext =
  createContext<ComponentHandlerRegistry | null>(null);

/**
 * Helper function to log registry operations (only when window.__REGISTRY_DEBUG__ is true)
 */
function logRegistryOperation(
  level: "success" | "warning" | "error",
  message: string
): void {
  const prefix = {
    success: "[Registry] ✅",
    warning: "[Registry] ⚠️",
    error: "[Registry] ❌",
  }[level];
  debugLog(`${prefix} ${message}`);
}

interface ItemClickEntry {
  pattern: RegExp;
  handler: ItemClickHandler;
}

interface FormatterContextEntry {
  matchers: FormatterContextMatcher;
  formatter: CellFormatter;
  inputDataType?: string | RegExp;
}

function matchesContextValue(
  value: string | undefined,
  matcher: string | RegExp
): boolean {
  if (value === undefined) return false;
  if (typeof matcher === "string") return value === matcher;
  return matcher.test(value);
}

function formatterContextMatchersEqual(
  a: FormatterContextMatcher,
  b: FormatterContextMatcher
): boolean {
  const keys = ["id", "name", "dataPath"] as const;
  for (const key of keys) {
    const av = a[key];
    const bv = b[key];
    if (av === undefined && bv === undefined) continue;
    if (av === undefined || bv === undefined) return false;
    if (typeof av === "string" || typeof bv === "string") {
      if (av !== bv) return false;
    } else {
      if (av.source !== bv.source || av.flags !== bv.flags) return false;
    }
  }
  return true;
}

/** Return true when both inputDataTypes are equal (for unregister filtering). */
function inputDataTypeMatches(
  a: string | RegExp | undefined,
  b: string | RegExp | undefined
): boolean {
  if (a === undefined && b === undefined) return true;
  if (a === undefined || b === undefined) return false;
  if (typeof a === "string" && typeof b === "string") return a === b;
  if (a instanceof RegExp && b instanceof RegExp)
    return a.source === b.source && a.flags === b.flags;
  return false;
}

export function ComponentHandlerRegistryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const onItemClickHandlers = React.useRef<Map<string, ItemClickHandler>>(
    new Map()
  );
  const onItemClickPatterns = React.useRef<ItemClickEntry[]>([]);
  const formatterContextEntries = React.useRef<FormatterContextEntry[]>([]);
  // Public API map: index-based keys, synced from formatterContextEntries
  const formatters = React.useRef<Map<string, CellFormatter>>(new Map());

  const syncFormattersMap = useCallback(() => {
    formatters.current.clear();
    formatterContextEntries.current.forEach((entry, i) => {
      formatters.current.set(String(i), entry.formatter);
    });
  }, []);

  const registerItemClick = useCallback(
    (inputDataType: string | RegExp, handler: ItemClickHandler) => {
      if (inputDataType instanceof RegExp) {
        onItemClickPatterns.current.push({ pattern: inputDataType, handler });
      } else {
        onItemClickHandlers.current.set(inputDataType, handler);
      }
    },
    []
  );

  const unregisterItemClick = useCallback((inputDataType: string | RegExp) => {
    if (inputDataType instanceof RegExp) {
      onItemClickPatterns.current = onItemClickPatterns.current.filter(
        (entry) =>
          entry.pattern.source !== inputDataType.source ||
          entry.pattern.flags !== inputDataType.flags
      );
    } else {
      onItemClickHandlers.current.delete(inputDataType);
    }
  }, []);

  const getItemClick = useCallback(
    (
      inputDataType: string | null | undefined
    ): ItemClickHandler | undefined => {
      if (!inputDataType) return undefined;

      // Strategy 1: Exact string lookup
      const exactHandler = onItemClickHandlers.current.get(inputDataType);
      if (exactHandler) {
        logRegistryOperation(
          "success",
          `Found onItemClick handler for inputDataType: ${inputDataType}`
        );
        return exactHandler;
      }

      // Strategy 2: Try regex patterns (first match wins)
      const patternEntry = onItemClickPatterns.current.find((entry) =>
        entry.pattern.test(inputDataType)
      );
      if (patternEntry) {
        logRegistryOperation(
          "success",
          `Found onItemClick handler by pattern for: ${inputDataType}`
        );
        return patternEntry.handler;
      }

      logRegistryOperation(
        "error",
        `No onItemClick handler found for inputDataType: ${inputDataType}`
      );
      return undefined;
    },
    []
  );

  const registerFormatter = useCallback(
    (
      matchers: FormatterContextMatcher,
      formatter: CellFormatter,
      inputDataType?: string | RegExp
    ) => {
      const hasAtLeastOne =
        matchers.id !== undefined ||
        matchers.name !== undefined ||
        matchers.dataPath !== undefined;
      if (!hasAtLeastOne) return;
      formatterContextEntries.current.push({
        matchers,
        formatter,
        inputDataType,
      });
      syncFormattersMap();
    },
    [syncFormattersMap]
  );

  const unregisterFormatter = useCallback(
    (matchers: FormatterContextMatcher, inputDataType?: string | RegExp) => {
      formatterContextEntries.current = formatterContextEntries.current.filter(
        (entry) => {
          if (!formatterContextMatchersEqual(entry.matchers, matchers))
            return true;
          if (inputDataType !== undefined)
            return !inputDataTypeMatches(entry.inputDataType, inputDataType);
          return false;
        }
      );
      syncFormattersMap();
    },
    [syncFormattersMap]
  );

  const registerFormatterById = useCallback(
    (
      id: string | RegExp,
      formatter: CellFormatter,
      inputDataType?: string | RegExp
    ) => {
      registerFormatter({ id }, formatter, inputDataType);
    },
    [registerFormatter]
  );

  const registerFormatterByName = useCallback(
    (
      name: string | RegExp,
      formatter: CellFormatter,
      inputDataType?: string | RegExp
    ) => {
      registerFormatter({ name }, formatter, inputDataType);
    },
    [registerFormatter]
  );

  const registerFormatterByDataPath = useCallback(
    (
      dataPath: string | RegExp,
      formatter: CellFormatter,
      inputDataType?: string | RegExp
    ) => {
      registerFormatter({ dataPath }, formatter, inputDataType);
    },
    [registerFormatter]
  );

  const unregisterFormatterById = useCallback(
    (id: string | RegExp, inputDataType?: string | RegExp) => {
      unregisterFormatter({ id }, inputDataType);
    },
    [unregisterFormatter]
  );

  const unregisterFormatterByName = useCallback(
    (name: string | RegExp, inputDataType?: string | RegExp) => {
      unregisterFormatter({ name }, inputDataType);
    },
    [unregisterFormatter]
  );

  const unregisterFormatterByDataPath = useCallback(
    (dataPath: string | RegExp, inputDataType?: string | RegExp) => {
      unregisterFormatter({ dataPath }, inputDataType);
    },
    [unregisterFormatter]
  );

  const getFormatter = useCallback(
    (
      id: string | null | undefined,
      context?: FormatterContext
    ): CellFormatter | undefined => {
      if (!id) return undefined;

      const entries = formatterContextEntries.current;
      // Prefer scoped formatters (matching inputDataType) over global
      const withScope: typeof entries = [];
      const withoutScope: typeof entries = [];
      for (const entry of entries) {
        const scopeMatches =
          entry.inputDataType === undefined ||
          (typeof entry.inputDataType === "string"
            ? context?.inputDataType === entry.inputDataType
            : context?.inputDataType != null &&
              entry.inputDataType.test(context.inputDataType));
        if (!scopeMatches) continue;
        if (entry.inputDataType !== undefined) withScope.push(entry);
        else withoutScope.push(entry);
      }
      const orderToTry = context?.inputDataType
        ? [...withScope, ...withoutScope]
        : [...withoutScope, ...withScope];

      for (const entry of orderToTry) {
        const { matchers } = entry;
        let allMatch = true;
        // Id matcher: match only by context.fieldId (or id when no context), not by lookup key alone (map isolation)
        if (matchers.id !== undefined) {
          const valueFromContext = context?.fieldId ?? id;
          if (!matchesContextValue(valueFromContext, matchers.id))
            allMatch = false;
        }
        if (allMatch && matchers.name !== undefined) {
          const value = context?.fieldName ?? id;
          if (!matchesContextValue(value, matchers.name)) allMatch = false;
        }
        if (allMatch && matchers.dataPath !== undefined) {
          const value = context?.dataPath ?? id;
          if (!matchesContextValue(value, matchers.dataPath)) allMatch = false;
        }
        if (allMatch) {
          logRegistryOperation(
            "success",
            `Found formatter by context matcher for: ${id}`
          );
          return entry.formatter;
        }
      }

      logRegistryOperation(
        "error",
        `No formatter found for: ${id}${context?.inputDataType ? ` (with context: ${context.inputDataType})` : ""}`
      );
      return undefined;
    },
    []
  );

  const value: ComponentHandlerRegistry = React.useMemo(
    () => ({
      onItemClickHandlers: onItemClickHandlers.current,
      formatters: formatters.current,
      registerItemClick,
      unregisterItemClick,
      getItemClick,
      registerFormatter,
      unregisterFormatter,
      registerFormatterById,
      registerFormatterByName,
      registerFormatterByDataPath,
      unregisterFormatterById,
      unregisterFormatterByName,
      unregisterFormatterByDataPath,
      getFormatter,
      isActive: () => true,
    }),
    [
      registerItemClick,
      unregisterItemClick,
      getItemClick,
      registerFormatter,
      unregisterFormatter,
      registerFormatterById,
      registerFormatterByName,
      registerFormatterByDataPath,
      unregisterFormatterById,
      unregisterFormatterByName,
      unregisterFormatterByDataPath,
      getFormatter,
    ]
  );

  return (
    <ComponentHandlerRegistryContext.Provider value={value}>
      {children}
    </ComponentHandlerRegistryContext.Provider>
  );
}

/**
 * Hook to access the component handler registry
 */
export function useComponentHandlerRegistry(): ComponentHandlerRegistry {
  const context = useContext(ComponentHandlerRegistryContext);
  if (!context) {
    // Return a no-op registry if context is not available
    return {
      onItemClickHandlers: new Map(),
      formatters: new Map(),
      registerItemClick: () => {},
      unregisterItemClick: () => {},
      getItemClick: () => undefined,
      registerFormatter: () => {},
      unregisterFormatter: () => {},
      registerFormatterById: () => {},
      registerFormatterByName: () => {},
      registerFormatterByDataPath: () => {},
      unregisterFormatterById: () => {},
      unregisterFormatterByName: () => {},
      unregisterFormatterByDataPath: () => {},
      getFormatter: () => undefined,
      isActive: () => false,
    };
  }
  return context;
}
