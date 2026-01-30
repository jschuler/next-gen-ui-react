import DynamicComponent from "./components/DynamicComponents";
export default DynamicComponent;

// Export types for the default component
export type {
  DynamicComponentProps,
  ComponentConfig,
} from "./components/DynamicComponents";

// Re-export registry items for consumers
// Note: This triggers a Fast Refresh warning, but it's non-blocking
export {
  ComponentHandlerRegistryProvider,
  useComponentHandlerRegistry,
  type ComponentHandlerRegistry,
  type HandlerResolver,
  type FormatterContext,
  type CellFormatter,
  type RowClickHandler,
} from "./components/ComponentHandlerRegistry";

// Re-export built-in formatters
export {
  builtInFormatters,
  isoDateFormatter,
  ISO_DATE_PATTERN,
  ISO_DATE_PATTERN_SORT,
  isISODate,
  registerBuiltInFormatters,
  type BuiltInFormatterId,
} from "./utils/builtInFormatters";
