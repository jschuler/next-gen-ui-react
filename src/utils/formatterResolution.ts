import type { ReactNode } from "react";

import type {
  ComponentHandlerRegistry,
  CellFormatter,
  FormatterContext,
} from "../components/ComponentHandlerRegistry";

/**
 * Minimal field shape needed for formatter resolution (data_path → id → name,
 * most specific to least; plus optional explicit formatter). Shared by DataViewWrapper and OneCardWrapper.
 */
export interface FieldWithFormatterOption {
  id?: string;
  name?: string;
  data_path?: string;
  formatter?:
    | string
    | ((
        value: string | number | boolean | null | (string | number)[]
      ) => ReactNode | string | number);
}

export interface ResolveFormatterContextOptions {
  inputDataType?: string;
  componentId?: string;
}

/**
 * Resolves a formatter for a field using the registry: tries data_path (most specific),
 * then id, then name (least specific); then falls back to explicit field.formatter (string or function).
 * Keeps DataViewWrapper and OneCardWrapper DRY.
 */
export function resolveFormatterForField(
  registry: ComponentHandlerRegistry,
  field: FieldWithFormatterOption,
  contextOptions: ResolveFormatterContextOptions
): CellFormatter | undefined {
  const context: FormatterContext = {
    inputDataType: contextOptions.inputDataType,
    componentId: contextOptions.componentId,
    fieldId: field.id,
    fieldName: field.name,
    dataPath: field.data_path,
  };

  let resolved: CellFormatter | undefined;

  if (registry.isActive()) {
    if (field.data_path) {
      resolved = registry.getFormatter(field.data_path, context);
    }
    if (!resolved && field.id) {
      resolved = registry.getFormatter(field.id, context);
    }
    if (!resolved && field.name) {
      resolved = registry.getFormatter(field.name, context);
    }
  }

  if (!resolved && field.formatter) {
    if (typeof field.formatter === "string") {
      if (registry.isActive()) {
        resolved = registry.getFormatter(field.formatter, context);
      }
    } else {
      resolved = field.formatter as CellFormatter;
    }
  }

  return resolved;
}
