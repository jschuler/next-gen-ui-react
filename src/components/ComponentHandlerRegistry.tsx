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
export type RowClickHandler = (
  event: React.MouseEvent | React.KeyboardEvent,
  rowData: Record<string, string | number | boolean | null>
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
 * Handler resolver interface for resolving formatter and onRowClick identifiers
 * This is used by DataViewWrapper to resolve string identifiers to functions
 */
export interface HandlerResolver {
  getFormatter?: (
    id: string,
    context?: FormatterContext
  ) => CellFormatter | undefined;
  getRowClick?: (id: string) => RowClickHandler | undefined;
}

/**
 * Registry for component handlers (onRowClick, formatters, etc.)
 * Supports data-aware formatter selection based on context
 */
export interface ComponentHandlerRegistry {
  onRowClickHandlers: Map<string, RowClickHandler>;
  formatters: Map<string, CellFormatter>;
  registerRowClick: (
    id: string,
    handler: RowClickHandler,
    inputDataType?: string
  ) => void;
  unregisterRowClick: (id: string, inputDataType?: string) => void;
  getRowClick: (
    id: string | null | undefined,
    inputDataType?: string
  ) => RowClickHandler | undefined;
  unregisterFormatter: (id: string | RegExp) => void;
  /**
   * Register a formatter that will be matched by field id.
   * @param id - The field id to match against (string or RegExp pattern)
   * @param formatter - The formatter function
   * @param inputDataType - Optional: If provided, formatter will only match when input_data_type matches
   */
  registerFormatterById: (
    id: string | RegExp,
    formatter: CellFormatter,
    inputDataType?: string
  ) => void;
  /**
   * Register a formatter that will be matched by field name.
   * @param name - The field name to match against (string or RegExp pattern)
   * @param formatter - The formatter function
   * @param inputDataType - Optional: If provided, formatter will only match when input_data_type matches
   */
  registerFormatterByName: (
    name: string | RegExp,
    formatter: CellFormatter,
    inputDataType?: string
  ) => void;
  /**
   * Register a formatter that will be matched by field data_path.
   * @param dataPath - The field data_path to match against (string or RegExp pattern)
   * @param formatter - The formatter function
   * @param inputDataType - Optional: If provided, formatter will only match when input_data_type matches
   */
  registerFormatterByDataPath: (
    dataPath: string | RegExp,
    formatter: CellFormatter,
    inputDataType?: string
  ) => void;
  /**
   * Returns true if the registry is active (has a provider), false if it's a no-op
   */
  isActive: () => boolean;
  /**
   * Get formatter by identifier, with optional context for data-aware selection.
   * Only checks the map that matches the lookup type (id, name, or dataPath).
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

/**
 * Helper: try formatter from a map and optionally log
 */
function getFromMap(
  map: Map<string, CellFormatter>,
  key: string,
  logMessage?: string
): CellFormatter | undefined {
  const formatter = map.get(key);
  if (formatter && logMessage) {
    logRegistryOperation("success", logMessage);
  }
  return formatter;
}

/**
 * Provider component that manages the handler registry
 */
/**
 * Formatter entry that can be either a direct formatter or a regex pattern
 */
interface FormatterEntry {
  formatter: CellFormatter;
  pattern?: RegExp;
  inputDataType?: string;
  matchType?: "id" | "name" | "dataPath";
}

export function ComponentHandlerRegistryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const onRowClickHandlers = React.useRef<Map<string, RowClickHandler>>(
    new Map()
  );
  // Separate maps for direct lookup by registration type (id → only check id map)
  const formattersById = React.useRef<Map<string, CellFormatter>>(new Map());
  const formattersByName = React.useRef<Map<string, CellFormatter>>(new Map());
  const formattersByDataPath = React.useRef<Map<string, CellFormatter>>(
    new Map()
  );
  // Combined map for public API (registry.formatters)
  const formatters = React.useRef<Map<string, CellFormatter>>(new Map());
  const formatterPatterns = React.useRef<FormatterEntry[]>([]);

  const registerRowClick = useCallback(
    (id: string, handler: RowClickHandler, inputDataType?: string) => {
      if (inputDataType && id === "*") {
        onRowClickHandlers.current.set(inputDataType, handler);
      } else if (inputDataType) {
        onRowClickHandlers.current.set(`${inputDataType}.${id}`, handler);
        // Also store under bare id so getRowClick(id) without inputDataType finds it
        onRowClickHandlers.current.set(id, handler);
      } else {
        onRowClickHandlers.current.set(id, handler);
      }
    },
    []
  );

  const unregisterRowClick = useCallback(
    (id: string, inputDataType?: string) => {
      if (inputDataType && id === "*") {
        onRowClickHandlers.current.delete(inputDataType);
      } else if (inputDataType) {
        onRowClickHandlers.current.delete(`${inputDataType}.${id}`);
        onRowClickHandlers.current.delete(id);
      } else {
        onRowClickHandlers.current.delete(id);
      }
    },
    []
  );

  const getRowClick = useCallback(
    (
      id: string | null | undefined,
      inputDataType?: string
    ): RowClickHandler | undefined => {
      if (!id && !inputDataType) return undefined;

      // Strategy 1: Try data-type specific handler for this component id
      // (e.g., "catalog.registry-demo-rowclick")
      // Only if id doesn't already contain a dot (not already prefixed)
      if (inputDataType && id && !id.includes(".")) {
        const lookupKey = `${inputDataType}.${id}`;
        const handler = onRowClickHandlers.current.get(lookupKey);
        if (handler) {
          logRegistryOperation(
            "success",
            `Found data-type specific onRowClick handler: ${lookupKey}`
          );
          return handler;
        }
      }

      // Strategy 2: Try inputDataType-only handler (registered with id="*")
      if (inputDataType) {
        const dataTypeHandler = onRowClickHandlers.current.get(inputDataType);
        if (dataTypeHandler) {
          logRegistryOperation(
            "success",
            `Found inputDataType-only onRowClick handler: ${inputDataType}`
          );
          return dataTypeHandler;
        }
      }

      // Strategy 3: Direct lookup by id as-is (e.g., "get_openshift_nodes.onRowClick" or "onRowClick")
      // This handles both cases: full ID from backend or just handler ID
      if (id) {
        const directHandler = onRowClickHandlers.current.get(id);
        if (directHandler) {
          logRegistryOperation("success", `Found onRowClick handler: ${id}`);
          return directHandler;
        }
      }

      // Strategy 4: Extract handler ID from prefixed ID and try generic lookup
      // If id is "get_openshift_nodes.onRowClick", extract "onRowClick" and try that
      if (inputDataType && id && id.startsWith(`${inputDataType}.`)) {
        const handlerId = id.substring(inputDataType.length + 1);
        const genericHandler = onRowClickHandlers.current.get(handlerId);
        if (genericHandler) {
          logRegistryOperation(
            "warning",
            `Using generic onRowClick handler: ${handlerId}`
          );
          return genericHandler;
        }
      }

      logRegistryOperation(
        "error",
        `No onRowClick handler found for: ${id || "(no id)"}${inputDataType ? ` (with inputDataType: ${inputDataType})` : ""}`
      );
      return undefined;
    },
    []
  );

  // Helper to register a formatter (handles both string and RegExp patterns)
  const registerFormatterEntry = useCallback(
    (
      pattern: string | RegExp,
      formatter: CellFormatter,
      inputDataType?: string,
      matchType?: "id" | "name" | "dataPath"
    ) => {
      if (pattern instanceof RegExp) {
        formatterPatterns.current.push({
          formatter,
          pattern,
          inputDataType,
          matchType,
        });
      } else {
        const key = inputDataType ? `${inputDataType}.${pattern}` : pattern;
        const target =
          matchType === "id"
            ? formattersById.current
            : matchType === "name"
              ? formattersByName.current
              : formattersByDataPath.current;
        target.set(key, formatter);
        formatters.current.set(key, formatter);
      }
    },
    []
  );

  const unregisterFormatter = useCallback((id: string | RegExp) => {
    if (id instanceof RegExp) {
      formatterPatterns.current = formatterPatterns.current.filter(
        (entry) => entry.pattern !== id
      );
    } else {
      formattersById.current.delete(id);
      formattersByName.current.delete(id);
      formattersByDataPath.current.delete(id);
      formatters.current.delete(id);
    }
  }, []);

  // Convenience methods for registering formatters by field property type
  const registerFormatterById = useCallback(
    (id: string | RegExp, formatter: CellFormatter, inputDataType?: string) => {
      registerFormatterEntry(id, formatter, inputDataType, "id");
    },
    [registerFormatterEntry]
  );

  const registerFormatterByName = useCallback(
    (
      name: string | RegExp,
      formatter: CellFormatter,
      inputDataType?: string
    ) => {
      registerFormatterEntry(name, formatter, inputDataType, "name");
    },
    [registerFormatterEntry]
  );

  const registerFormatterByDataPath = useCallback(
    (
      dataPath: string | RegExp,
      formatter: CellFormatter,
      inputDataType?: string
    ) => {
      registerFormatterEntry(dataPath, formatter, inputDataType, "dataPath");
    },
    [registerFormatterEntry]
  );

  // Helper to check regex patterns
  const tryPatternMatch = useCallback(
    (
      value: string,
      context?: FormatterContext,
      matchType?: "id" | "name" | "dataPath"
    ): CellFormatter | undefined => {
      if (formatterPatterns.current.length === 0) return undefined;
      for (const entry of formatterPatterns.current) {
        if (entry.inputDataType) {
          if (context?.inputDataType !== entry.inputDataType) continue;
        }
        if (matchType && entry.matchType && entry.matchType !== matchType) {
          continue;
        }

        // Try to match the pattern against the value
        if (entry.pattern && entry.pattern.test(value)) {
          logRegistryOperation(
            "success",
            `Found formatter by pattern match: ${entry.pattern} for value: ${value}`
          );
          return entry.formatter;
        }
      }
      return undefined;
    },
    []
  );

  const getFormatter = useCallback(
    (
      id: string | null | undefined,
      context?: FormatterContext
    ): CellFormatter | undefined => {
      if (!id) return undefined;

      const scopedKey = context?.inputDataType
        ? `${context.inputDataType}.${id}`
        : undefined;
      type LookupType = "id" | "name" | "dataPath";
      let lookupType: LookupType | undefined;
      if (context?.fieldId && id === context.fieldId) {
        lookupType = "id";
      } else if (context?.fieldName && id === context.fieldName) {
        lookupType = "name";
      } else if (context?.dataPath && id === context.dataPath) {
        lookupType = "dataPath";
      }

      const tryById = () =>
        getFromMap(
          formattersById.current,
          scopedKey ?? id,
          `Found formatter (by id): ${scopedKey ?? id}`
        ) ??
        (scopedKey
          ? getFromMap(
              formattersById.current,
              id,
              `Using formatter (by id): ${id}`
            )
          : undefined);

      const tryByName = () =>
        getFromMap(
          formattersByName.current,
          scopedKey ?? id,
          `Found formatter (by name): ${scopedKey ?? id}`
        ) ??
        (scopedKey
          ? getFromMap(
              formattersByName.current,
              id,
              `Using formatter (by name): ${id}`
            )
          : undefined);

      const tryByDataPath = () =>
        getFromMap(
          formattersByDataPath.current,
          scopedKey ?? id,
          `Found formatter (by dataPath): ${scopedKey ?? id}`
        ) ??
        (scopedKey
          ? getFromMap(
              formattersByDataPath.current,
              id,
              `Using formatter (by dataPath): ${id}`
            )
          : undefined);

      if (lookupType === "id") {
        const formatter = tryById();
        if (formatter) return formatter;
      } else if (lookupType === "name") {
        const formatter = tryByName();
        if (formatter) return formatter;
      } else if (lookupType === "dataPath") {
        const formatter = tryByDataPath();
        if (formatter) return formatter;
      } else {
        const formatter = tryById() ?? tryByName() ?? tryByDataPath();
        if (formatter) return formatter;
      }

      const matchTypeForPattern: "id" | "name" | "dataPath" =
        lookupType ?? "id";
      const patternFormatter = tryPatternMatch(
        scopedKey ?? id,
        context,
        matchTypeForPattern
      );
      if (patternFormatter) return patternFormatter;
      const patternFormatterId = tryPatternMatch(
        id,
        context,
        matchTypeForPattern
      );
      if (patternFormatterId) return patternFormatterId;

      logRegistryOperation(
        "error",
        `No formatter found for: ${id}${context?.inputDataType ? ` (with context: ${context.inputDataType})` : ""}`
      );
      return undefined;
    },
    [tryPatternMatch]
  );

  const value: ComponentHandlerRegistry = React.useMemo(
    () => ({
      onRowClickHandlers: onRowClickHandlers.current,
      formatters: formatters.current,
      registerRowClick,
      unregisterRowClick,
      getRowClick,
      unregisterFormatter,
      registerFormatterById,
      registerFormatterByName,
      registerFormatterByDataPath,
      getFormatter,
      isActive: () => true,
    }),
    [
      registerRowClick,
      unregisterRowClick,
      getRowClick,
      unregisterFormatter,
      registerFormatterById,
      registerFormatterByName,
      registerFormatterByDataPath,
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
      onRowClickHandlers: new Map(),
      formatters: new Map(),
      registerRowClick: () => {},
      unregisterRowClick: () => {},
      getRowClick: () => undefined,
      unregisterFormatter: () => {},
      registerFormatterById: () => {},
      registerFormatterByName: () => {},
      registerFormatterByDataPath: () => {},
      getFormatter: () => undefined,
      isActive: () => false,
    };
  }
  return context;
}
