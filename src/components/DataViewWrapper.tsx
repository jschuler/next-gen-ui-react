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

interface FieldData {
  id?: string;
  name: string;
  data_path: string;
  data: (string | number | boolean | null | (string | number)[])[];
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
  onItemClick?: (
    event: React.MouseEvent | React.KeyboardEvent,
    itemData: Record<string, string | number>
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
  onItemClick,
}) => {
  // Check for missing or invalid data
  const hasNoFields = !fields || fields.length === 0;
  const registry = useComponentHandlerRegistry();

  // Resolve onItemClick from registry or props
  const resolvedOnItemClick = useMemo(() => {
    // If onItemClick is a function, use it directly
    if (typeof onItemClick === "function") {
      debugLog(`[DataViewWrapper] Using onItemClick from props for id: ${id}`);
      return onItemClick;
    }

    // Resolve by inputDataType from registry
    if (inputDataType && registry.isActive()) {
      const handler = registry.getItemClick(inputDataType);
      if (handler) {
        debugLog(
          `[DataViewWrapper] ✅ Resolved onItemClick from registry for inputDataType: ${inputDataType}`
        );
        return handler;
      }
    }

    return undefined;
  }, [onItemClick, registry, id, inputDataType]);

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
    // Store raw values so the column formatter (from registry) does the formatting
    type CellValue = string | number | boolean | null | (string | number)[];
    const transformedRows: Record<string, CellValue>[] = [];
    for (let i = 0; i < maxDataLength; i++) {
      const row: Record<string, CellValue> = {};
      fields.forEach((field) => {
        const originalValue = field.data[i];
        row[field.name] = originalValue as CellValue;
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

      // Build row props, including onItemClick if provided or resolved from registry.
      // PatternFly Tr expects onRowClick, so we pass our handler as onRowClick.
      if (resolvedOnItemClick) {
        return {
          row: rowCells,
          props: {
            onRowClick: (event?: MouseEvent | KeyboardEvent) => {
              debugLog(
                `[DataViewWrapper] onItemClick called with event:`,
                event,
                `handler:`,
                resolvedOnItemClick
              );
              // Create a clean row data object without internal sorting keys (coerce to string | number for handler API)
              const rowData: Record<string, string | number> = {};
              columns.forEach((col) => {
                const v = row[col.key];
                rowData[col.key] =
                  typeof v === "string" || typeof v === "number"
                    ? v
                    : v == null
                      ? ""
                      : Array.isArray(v)
                        ? v.join(", ")
                        : String(v);
              });
              // Call handler - only if we have a MouseEvent (has 'button' property)
              // KeyboardEvent doesn't have 'button', so we skip it for now
              // The handler expects MouseEvent, so we only call it with MouseEvent
              if (event && "button" in event) {
                resolvedOnItemClick(
                  event as unknown as React.MouseEvent,
                  rowData
                );
              } else if (!event) {
                // No event provided, but handler exists - call it with a minimal event
                // This handles cases where DataView might not pass an event
                const minimalEvent = {} as unknown as React.MouseEvent;
                resolvedOnItemClick(minimalEvent, rowData);
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
  }, [sortedData, page, perPage, columns, resolvedOnItemClick]);

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
