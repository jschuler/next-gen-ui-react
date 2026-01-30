import { EmptyState, EmptyStateBody, Pagination } from "@patternfly/react-core";
import { DataView } from "@patternfly/react-data-view/dist/dynamic/DataView";
import { DataViewFilters } from "@patternfly/react-data-view/dist/dynamic/DataViewFilters";
import {
  DataViewTable,
  DataViewTh,
  DataViewTr,
} from "@patternfly/react-data-view/dist/dynamic/DataViewTable";
import { DataViewTextFilter } from "@patternfly/react-data-view/dist/dynamic/DataViewTextFilter";
import { DataViewToolbar } from "@patternfly/react-data-view/dist/dynamic/DataViewToolbar";
import {
  useDataViewFilters,
  useDataViewPagination,
  useDataViewSort,
} from "@patternfly/react-data-view/dist/dynamic/Hooks";
import { CubesIcon } from "@patternfly/react-icons";
import { Tbody, Td, ThProps, Tr } from "@patternfly/react-table";
import { FunctionComponent, useMemo } from "react";
import type { MouseEvent, KeyboardEvent, ReactNode } from "react";

import { useComponentHandlerRegistry } from "./ComponentHandlerRegistry";
import ErrorPlaceholder from "./ErrorPlaceholder";
import { ISO_DATE_PATTERN_SORT } from "../utils/builtInFormatters";
import { getDataTypeClass, sanitizeClassName } from "../utils/cssClassHelpers";
import { debugLog } from "../utils/debug";
import { resolveFormatterForField } from "../utils/formatterResolution";
import { formatValue } from "../utils/valueFormatter";

interface FieldData {
  id?: string;
  name: string;
  data_path: string;
  data: (string | number | boolean | null | (string | number)[])[];
  formatter?:
    | string
    | ((
        value: string | number | boolean | null | (string | number)[]
      ) => ReactNode);
}

interface DataViewColumn {
  label: string;
  key: string;
  fieldId?: string;
  sortable?: boolean;
  filterable?: boolean;
  formatter?: (
    value: string | number | boolean | null | (string | number)[]
  ) => ReactNode;
}

export interface DataViewWrapperProps {
  component: "data-view" | "table"; // "table" supported for backwards compatibility
  title?: string;
  id: string;
  fields: FieldData[];
  className?: string;
  columns?: DataViewColumn[];
  perPage?: number;
  enableFilters?: boolean; // If undefined, auto-disables when 5 or fewer items
  enablePagination?: boolean; // If undefined, auto-disables when 5 or fewer items
  enableSort?: boolean;
  emptyStateMessage?: string;
  inputDataType?: string;
  onRowClick?: (
    event: React.MouseEvent | React.KeyboardEvent,
    rowData: Record<string, string | number>
  ) => void;
}

const perPageOptions = [
  { title: "5", value: 5 },
  { title: "10", value: 10 },
  { title: "20", value: 20 },
  { title: "50", value: 50 },
];

const DataViewWrapper: FunctionComponent<DataViewWrapperProps> = ({
  id,
  fields,
  className,
  perPage: initialPerPage = 5,
  enableFilters,
  enablePagination,
  enableSort = true,
  emptyStateMessage = "No data available",
  inputDataType,
  onRowClick,
}) => {
  // Check for missing or invalid data
  const hasNoFields = !fields || fields.length === 0;
  const registry = useComponentHandlerRegistry();

  // Resolve onRowClick from registry or props
  const resolvedOnRowClick = useMemo(() => {
    // If onRowClick is a function, use it directly
    if (typeof onRowClick === "function") {
      debugLog(`[DataViewWrapper] Using onRowClick from props for id: ${id}`);
      return onRowClick;
    }

    // If onRowClick is a string (handler ID), look it up from registry
    if (typeof onRowClick === "string") {
      const handler = registry.getRowClick(onRowClick, inputDataType);
      if (handler) {
        debugLog(
          `[DataViewWrapper] ✅ Resolved onRowClick handler '${onRowClick}' from registry`
        );
        return handler;
      }
      // Fallback: try component id when explicit handler ID was not found
      const fallbackHandler = registry.getRowClick(id, inputDataType);
      if (fallbackHandler) {
        debugLog(
          `[DataViewWrapper] ✅ Resolved onRowClick from registry for id: ${id} (fallback)`
        );
        return fallbackHandler;
      }
      debugLog(
        `[DataViewWrapper] ❌ No onRowClick handler found in registry for handler ID: ${onRowClick} or id: ${id}`
      );
      return undefined;
    }

    // When onRowClick is not provided, try to resolve by component id from registry
    // (e.g. row click example: handler registered as "registry-demo-rowclick", component id is same)
    if (registry.isActive()) {
      const handler = registry.getRowClick(id, inputDataType);
      if (handler) {
        debugLog(
          `[DataViewWrapper] ✅ Resolved onRowClick from registry for id: ${id}`
        );
        return handler;
      }
    }

    return undefined;
  }, [onRowClick, registry, id, inputDataType]);

  // Transform fields data into table format
  const { columns, rows, filterableFields } = useMemo(() => {
    if (hasNoFields) {
      return { columns: [], rows: [], filterableFields: [] };
    }

    // Find the maximum number of data items across all fields
    const maxDataLength = Math.max(...fields.map((field) => field.data.length));

    // Create columns from field names (formatter resolution shared with OneCardWrapper)
    const transformedColumns: DataViewColumn[] = fields.map((field) => {
      const resolvedFormatter = resolveFormatterForField(registry, field, {
        inputDataType,
        componentId: id,
      });
      return {
        key: field.name,
        label: field.name,
        fieldId: field.id,
        formatter: resolvedFormatter,
        sortable: true,
        filterable: true,
      };
    });

    // Create rows based on the maximum data length
    // Store both display value and original value (for sorting)
    const transformedRows: Record<string, string | number>[] = [];
    for (let i = 0; i < maxDataLength; i++) {
      const row: Record<string, string | number> = {};
      fields.forEach((field) => {
        const originalValue = field.data[i];
        const displayValue = formatValue(originalValue);
        row[field.name] = displayValue;
        // Store original value with a special key for sorting
        row[`__sort_${field.name}`] =
          originalValue === null || originalValue === undefined
            ? ""
            : Array.isArray(originalValue)
              ? originalValue.join(", ")
              : String(originalValue);
      });
      transformedRows.push(row);
    }

    // Get filterable field keys
    const filterable = transformedColumns
      .filter((col) => col.filterable)
      .map((col) => col.key);

    return {
      columns: transformedColumns,
      rows: transformedRows,
      filterableFields: filterable,
    };
  }, [fields, hasNoFields, registry, inputDataType, id]);

  // Auto-disable pagination and filters if there are 5 or fewer items (unless explicitly set)
  const shouldEnablePagination =
    enablePagination !== undefined ? enablePagination : rows.length > 5;
  const shouldEnableFilters =
    enableFilters !== undefined ? enableFilters : rows.length > 5;

  // Initialize filters with all filterable fields
  const initialFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    filterableFields.forEach((field) => {
      filters[field] = "";
    });
    return filters;
  }, [filterableFields]);

  const { filters, onSetFilters, clearAllFilters } = useDataViewFilters({
    initialFilters,
  });

  const pagination = useDataViewPagination({ perPage: initialPerPage });
  const { page, perPage } = pagination;

  const { sortBy, direction, onSort } = useDataViewSort();

  // Sort and filter data
  const filteredData = useMemo(() => {
    return rows.filter((row) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key];
        if (!filterValue) return true;
        // Filter against both display value and original value
        const displayValue = String(row[key] || "");
        const sortKey = `__sort_${key}`;
        const originalValue = String(row[sortKey] || "");
        return (
          displayValue.toLowerCase().includes(filterValue.toLowerCase()) ||
          originalValue.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    });
  }, [rows, filters]);

  const sortedData = useMemo(() => {
    if (!sortBy || !direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      // Use original values for sorting (stored with __sort_ prefix)
      const sortKey = `__sort_${sortBy}`;
      const aVal = String(a[sortKey] || a[sortBy] || "");
      const bVal = String(b[sortKey] || b[sortBy] || "");

      // Check for ISO date format (YYYY-MM-DD or full ISO 8601 with time)
      const aIsISO = ISO_DATE_PATTERN_SORT.test(aVal);
      const bIsISO = ISO_DATE_PATTERN_SORT.test(bVal);

      // If both values are ISO dates, parse and compare as dates
      if (aIsISO && bIsISO) {
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);

        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          const diff = aDate.getTime() - bDate.getTime();
          return direction === "asc" ? diff : -diff;
        }
      }

      // Strip leading non-numeric characters (except minus) for better number detection
      // This handles currency symbols ($100, £50, €25) and other prefixes
      const aStripped = aVal.replace(/^[^\d-]+/, "");
      const bStripped = bVal.replace(/^[^\d-]+/, "");

      // Extract leading numbers if present for numeric sorting
      const aNumMatch = aStripped.match(/^-?\d+\.?\d*/);
      const bNumMatch = bStripped.match(/^-?\d+\.?\d*/);

      // If both values have numbers (after stripping prefixes), sort numerically
      if (aNumMatch && bNumMatch && aNumMatch[0] && bNumMatch[0]) {
        const aNum = parseFloat(aNumMatch[0]);
        const bNum = parseFloat(bNumMatch[0]);

        if (!isNaN(aNum) && !isNaN(bNum) && aNum !== bNum) {
          return direction === "asc" ? aNum - bNum : bNum - aNum;
        }
      }

      // Fall back to string comparison
      if (direction === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [filteredData, sortBy, direction]);

  const sortByIndex = useMemo(
    () => columns.findIndex((item) => item.key === sortBy),
    [columns, sortBy]
  );

  const getSortParams = (columnIndex: number): ThProps["sort"] => ({
    sortBy: {
      index: sortByIndex,
      direction,
      defaultDirection: "asc",
    },
    onSort: (_event, index, direction) =>
      onSort(_event, columns[index].key, direction),
    columnIndex,
  });

  const dataViewColumns: DataViewTh[] = columns.map((column, index) => ({
    cell: column.label,
    props: enableSort && column.sortable ? { sort: getSortParams(index) } : {},
  }));

  // Helper function to generate CSS class name from field id
  const getFieldIdClass = (fieldId?: string, fieldName?: string): string => {
    const id = fieldId || fieldName || "";
    if (!id) return "";
    const sanitized = sanitizeClassName(id);
    return sanitized ? `field-id-${sanitized}` : "";
  };

  const pageRows = useMemo((): DataViewTr[] => {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return sortedData.slice(start, end).map((row): DataViewTr => {
      // Create row with cells that have CSS classes based on field.id (only for data rows, not headers)
      const rowCells = columns.map((col) => {
        const cellValue = row[col.key];
        const className = getFieldIdClass(col.fieldId, col.key);

        // Apply formatter if provided, otherwise use the cell value as-is
        const displayValue =
          typeof col.formatter === "function"
            ? col.formatter(cellValue)
            : cellValue;

        // If we have a className, return DataViewTd object with props
        if (className) {
          return { cell: displayValue, props: { className } };
        }

        // If we have a formatter but no className, still return DataViewTd object (formatter may return ReactNode)
        if (typeof col.formatter === "function") {
          return { cell: displayValue };
        }

        return displayValue;
      });

      // Build row props, including onRowClick if provided or resolved from registry
      if (resolvedOnRowClick) {
        return {
          row: rowCells,
          props: {
            onRowClick: (event?: MouseEvent | KeyboardEvent) => {
              debugLog(
                `[DataViewWrapper] onRowClick called with event:`,
                event,
                `handler:`,
                resolvedOnRowClick
              );
              // Create a clean row data object without internal sorting keys
              const rowData: Record<string, string | number> = {};
              columns.forEach((col) => {
                rowData[col.key] = row[col.key];
              });
              // Call handler - only if we have a MouseEvent (has 'button' property)
              // KeyboardEvent doesn't have 'button', so we skip it for now
              // The handler expects MouseEvent, so we only call it with MouseEvent
              if (event && "button" in event) {
                resolvedOnRowClick(
                  event as unknown as React.MouseEvent,
                  rowData
                );
              } else if (!event) {
                // No event provided, but handler exists - call it with a minimal event
                // This handles cases where DataView might not pass an event
                const minimalEvent = {} as unknown as React.MouseEvent;
                resolvedOnRowClick(minimalEvent, rowData);
              }
            },
            isClickable: true,
            style: { cursor: "pointer" },
          },
        };
      }

      return {
        row: rowCells,
      };
    });
  }, [sortedData, page, perPage, columns, resolvedOnRowClick]);

  const emptyState = (
    <Tbody>
      <Tr>
        <Td colSpan={columns.length}>
          <EmptyState
            headingLevel="h4"
            icon={CubesIcon}
            titleText="No data found"
          >
            <EmptyStateBody>{emptyStateMessage}</EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );

  // Combine className with dataType-based class
  const dataTypeClass = getDataTypeClass(inputDataType, "data-view");
  const combinedClassName = [className, dataTypeClass]
    .filter(Boolean)
    .join(" ");

  if (hasNoFields) {
    return (
      <div id={id} className={combinedClassName}>
        <ErrorPlaceholder
          hasError={false}
          noContentMessage={emptyStateMessage}
        />
      </div>
    );
  }

  return (
    <div id={id} className={combinedClassName}>
      <DataView activeState={sortedData.length > 0 ? undefined : "empty"}>
        <DataViewToolbar
          ouiaId={`${id}-toolbar-top`}
          clearAllFilters={clearAllFilters}
          filters={
            shouldEnableFilters ? (
              <DataViewFilters
                onChange={(_e, values) => onSetFilters(values)}
                values={filters}
              >
                {filterableFields.map((fieldKey) => (
                  <DataViewTextFilter
                    key={fieldKey}
                    filterId={fieldKey}
                    title={fieldKey}
                    placeholder={`Filter by ${fieldKey.toLowerCase()}`}
                  />
                ))}
              </DataViewFilters>
            ) : undefined
          }
          pagination={
            shouldEnablePagination ? (
              <Pagination
                isCompact
                perPageOptions={perPageOptions}
                itemCount={sortedData.length}
                {...pagination}
              />
            ) : undefined
          }
        />
        <div style={{ overflowX: "auto" }} className="dataview-table-container">
          <DataViewTable
            aria-label="Data view table"
            ouiaId={id}
            columns={dataViewColumns}
            rows={pageRows}
            bodyStates={{ empty: emptyState }}
          />
        </div>
        {shouldEnablePagination && (
          <DataViewToolbar
            ouiaId={`${id}-toolbar-bottom`}
            pagination={
              <Pagination
                isCompact
                perPageOptions={perPageOptions}
                itemCount={sortedData.length}
                {...pagination}
              />
            }
          />
        )}
      </DataView>
    </div>
  );
};

export default DataViewWrapper;
