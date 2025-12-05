import { EmptyState, EmptyStateBody, Pagination } from "@patternfly/react-core";
import { DataView } from "@patternfly/react-data-view/dist/dynamic/DataView";
import { DataViewFilters } from "@patternfly/react-data-view/dist/dynamic/DataViewFilters";
import {
  DataViewTable,
  DataViewTh,
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

import ErrorPlaceholder from "./ErrorPlaceholder";

interface FieldData {
  name: string;
  data_path: string;
  data: (string | number | boolean | null | (string | number)[])[];
}

interface DataViewColumn {
  label: string;
  key: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface DataViewWrapperProps {
  component: "data-view";
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
}) => {
  // Check for missing or invalid data
  const hasNoFields = !fields || fields.length === 0;

  // Transform fields data into table format
  const { columns, rows, filterableFields } = useMemo(() => {
    if (hasNoFields) {
      return { columns: [], rows: [], filterableFields: [] };
    }

    // Find the maximum number of data items across all fields
    const maxDataLength = Math.max(...fields.map((field) => field.data.length));

    // Create columns from field names
    const transformedColumns: DataViewColumn[] = fields.map((field) => ({
      key: field.name,
      label: field.name,
      sortable: true,
      filterable: true,
    }));

    // Create rows based on the maximum data length
    const transformedRows: Record<string, string | number>[] = [];
    for (let i = 0; i < maxDataLength; i++) {
      const row: Record<string, string | number> = {};
      fields.forEach((field) => {
        const value = field.data[i];
        if (value === null || value === undefined) {
          row[field.name] = "";
        } else if (Array.isArray(value)) {
          row[field.name] = value.join(", ");
        } else {
          row[field.name] = String(value);
        }
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
  }, [fields, hasNoFields]);

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
        const cellValue = String(row[key] || "");
        return cellValue.toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [rows, filters]);

  const sortedData = useMemo(() => {
    if (!sortBy || !direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = String(a[sortBy] || "");
      const bVal = String(b[sortBy] || "");

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

  const pageRows = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return sortedData.slice(start, end).map((row) => ({
      row: [...Object.values(row)],
      props: {},
    }));
  }, [sortedData, page, perPage]);

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

  if (hasNoFields) {
    return (
      <div id={id} className={className}>
        <ErrorPlaceholder
          hasError={false}
          noContentMessage={emptyStateMessage}
        />
      </div>
    );
  }

  return (
    <div id={id} className={className}>
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
        <DataViewTable
          aria-label="Data view table"
          ouiaId={id}
          columns={dataViewColumns}
          rows={pageRows}
          bodyStates={{ empty: emptyState }}
        />
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
