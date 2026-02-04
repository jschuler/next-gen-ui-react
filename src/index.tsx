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
  type FormatterContextMatcher,
  type CellFormatter,
  type ItemClickHandler,
} from "./components/ComponentHandlerRegistry";

// Re-export built-in formatters
export {
  autoFormatters,
  builtInFormatters,
  BUILT_IN_FORMATTER_IDS,
  createCurrencyFormatter,
  isoDateFormatter,
  ISO_DATE_PATTERN,
  ISO_DATE_PATTERN_SORT,
  isISODate,
  registerAutoFormatters,
  type AutoFormatterId,
  type BuiltInFormatterId,
  type RegisterAutoFormattersOptions,
} from "./utils/builtInFormatters";
