import { Card, CardBody } from "@patternfly/react-core";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Caption,
} from "@patternfly/react-table";

import ErrorPlaceholder from "./ErrorPlaceholder";

interface FieldData {
  name: string;
  data_path: string;
  data: (string | number | boolean | null | (string | number)[])[];
}

interface TableWrapperProps {
  component: "table";
  title: string;
  id: string;
  fields: FieldData[];
  className?: string;
}

const TableWrapper = (props: TableWrapperProps) => {
  const { title, id, fields, className } = props;
  
  // Check for missing or invalid data
  const hasNoFields = !fields || fields.length === 0;
  const hasNoTitle = !title || title.trim() === "";

  // Transform fields data into table format
  const transformFieldsToTableData = () => {
    if (hasNoFields) return { columns: [], rows: [] };

    // Find the maximum number of data items across all fields
    const maxDataLength = Math.max(...fields.map((field) => field.data.length));

    // Create columns from field names
    const transformedColumns = fields.map((field) => ({
      key: field.name,
      label: field.name,
    }));

    // Create rows based on the maximum data length
    const transformedRows = [];
    for (let i = 0; i < maxDataLength; i++) {
      const row: Record<string, string | number | null> = {};
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

    return { columns: transformedColumns, rows: transformedRows };
  };

  const { columns, rows } = transformFieldsToTableData();
  const hasNoData = rows.length === 0;

  // If no title and no fields, show error
  if (hasNoTitle && hasNoFields) {
    return (
      <Card id={id} className={className}>
        <CardBody>
          <ErrorPlaceholder
            hasError={false}
            noContentMessage="No content available"
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card id={id} className={className}>
      <CardBody>
        {hasNoData ? (
          <ErrorPlaceholder
            hasError={false}
            noContentMessage="No data available"
          />
        ) : (
          <Table variant="compact" borders>
            <Caption>{title}</Caption>
            <Thead>
              <Tr>
                {columns.map((col, index) => (
                  <Th key={index}>{col.label}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row, rowIndex) => (
                <Tr key={rowIndex} data-testid={`row-${rowIndex}`}>
                  {columns.map((col, colIndex) => (
                    <Td key={colIndex}>{row[col.key]}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default TableWrapper;
