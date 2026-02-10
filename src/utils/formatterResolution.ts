import {
  autoFormatter,
  getAutoFormatter,
  type AutoFormatterOptions,
} from "./builtInFormatters";
import type {
  ComponentHandlerRegistry,
  CellFormatter,
  FormatterContext,
} from "../components/ComponentHandlerRegistry";

/**
 * Minimal field shape needed for formatter resolution (data_path → id → name,
 * most specific to least). Shared by DataViewWrapper and OneCardWrapper.
 */
export interface FieldWithFormatterOption {
  id?: string;
  name?: string;
  data_path?: string;
}

export interface ResolveFormatterContextOptions {
  inputDataType?: string;
  componentId?: string;
}

/**
 * Resolves a formatter for a field: registry (data_path → id → name), then
 * auto formatter (type detection + built-in formatters) when nothing matches.
 */
export function resolveFormatterForField(
  registry: ComponentHandlerRegistry,
  field: FieldWithFormatterOption,
  contextOptions: ResolveFormatterContextOptions
): CellFormatter {
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

  const options = registry.getAutoFormatterOptions?.();
  return (
    resolved ??
    (options
      ? getAutoFormatter(options as AutoFormatterOptions)
      : autoFormatter)
  );
}
