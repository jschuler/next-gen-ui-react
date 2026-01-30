import { render } from "@testing-library/react";

import {
  ComponentHandlerRegistryProvider,
  useComponentHandlerRegistry,
  type CellFormatter,
  type RowClickHandler,
} from "../../components/ComponentHandlerRegistry";

// Test component that uses the hook
function TestComponent({
  onRegistryReady,
}: {
  onRegistryReady: (
    registry: ReturnType<typeof useComponentHandlerRegistry>
  ) => void;
}) {
  const registry = useComponentHandlerRegistry();
  onRegistryReady(registry);
  return <div data-testid="test-component">Test</div>;
}

describe("ComponentHandlerRegistry", () => {
  describe("ComponentHandlerRegistryProvider", () => {
    it("should provide registry context to children", () => {
      let capturedRegistry: ReturnType<
        typeof useComponentHandlerRegistry
      > | null = null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(registry) => {
              capturedRegistry = registry;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      expect(capturedRegistry).not.toBeNull();
      expect(capturedRegistry?.formatters).toBeInstanceOf(Map);
      expect(capturedRegistry?.onRowClickHandlers).toBeInstanceOf(Map);
    });

    it("should provide registry methods", () => {
      let capturedRegistry: ReturnType<
        typeof useComponentHandlerRegistry
      > | null = null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(registry) => {
              capturedRegistry = registry;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      expect(capturedRegistry).not.toBeNull();
      expect(typeof capturedRegistry?.registerFormatterById).toBe("function");
      expect(typeof capturedRegistry?.unregisterFormatter).toBe("function");
      expect(typeof capturedRegistry?.getFormatter).toBe("function");
      expect(typeof capturedRegistry?.registerRowClick).toBe("function");
      expect(typeof capturedRegistry?.unregisterRowClick).toBe("function");
      expect(typeof capturedRegistry?.getRowClick).toBe("function");
    });
  });

  describe("useComponentHandlerRegistry hook", () => {
    it("should return no-op registry when used without provider", () => {
      let capturedRegistry: ReturnType<
        typeof useComponentHandlerRegistry
      > | null = null;

      render(
        <TestComponent
          onRegistryReady={(registry) => {
            capturedRegistry = registry;
          }}
        />
      );

      expect(capturedRegistry).not.toBeNull();
      expect(capturedRegistry?.formatters).toBeInstanceOf(Map);
      expect(capturedRegistry?.onRowClickHandlers).toBeInstanceOf(Map);
      // Should return undefined for getters
      expect(capturedRegistry?.getFormatter("test")).toBeUndefined();
      expect(capturedRegistry?.getRowClick("test")).toBeUndefined();
    });

    it("should return functional registry when used with provider", () => {
      let capturedRegistry: ReturnType<
        typeof useComponentHandlerRegistry
      > | null = null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(registry) => {
              capturedRegistry = registry;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      expect(capturedRegistry).not.toBeNull();
      // Should be able to register and retrieve formatters
      const formatter: CellFormatter = (value) => `formatted: ${value}`;
      capturedRegistry?.registerFormatterById("test", formatter);
      expect(capturedRegistry?.getFormatter("test", { fieldId: "test" })).toBe(
        formatter
      );
    });

    it("should return isActive() true when used with provider", () => {
      let capturedRegistry: ReturnType<
        typeof useComponentHandlerRegistry
      > | null = null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(registry) => {
              capturedRegistry = registry;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      expect(capturedRegistry?.isActive()).toBe(true);
    });

    it("should return isActive() false when used without provider", () => {
      let capturedRegistry: ReturnType<
        typeof useComponentHandlerRegistry
      > | null = null;

      render(
        <TestComponent
          onRegistryReady={(registry) => {
            capturedRegistry = registry;
          }}
        />
      );

      expect(capturedRegistry?.isActive()).toBe(false);
    });
  });

  describe("Formatter registration and retrieval", () => {
    it("should register and retrieve a formatter", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const formatter: CellFormatter = (value) => `formatted: ${value}`;
      registry?.registerFormatterById("status", formatter);

      const retrieved = registry?.getFormatter("status", { fieldId: "status" });
      expect(retrieved).toBe(formatter);
      expect(retrieved?.(123)).toBe("formatted: 123");
    });

    it("should unregister a formatter", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const formatter: CellFormatter = (value) => `formatted: ${value}`;
      registry?.registerFormatterById("status", formatter);
      expect(registry?.getFormatter("status", { fieldId: "status" })).toBe(
        formatter
      );

      registry?.unregisterFormatter("status");
      expect(
        registry?.getFormatter("status", { fieldId: "status" })
      ).toBeUndefined();
    });

    it("should return undefined for non-existent formatter", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      expect(registry?.getFormatter("non-existent")).toBeUndefined();
    });

    it("should return undefined for null or undefined id", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      expect(registry?.getFormatter(null)).toBeUndefined();
      expect(registry?.getFormatter(undefined)).toBeUndefined();
    });

    it("should find formatter registered by RegExp pattern (by id)", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const formatter: CellFormatter = () => "regex-matched";
      registry?.registerFormatterById(/.*-status$/, formatter);

      const result = registry?.getFormatter("server-status", {
        fieldId: "server-status",
      });
      expect(result).toBe(formatter);

      const result2 = registry?.getFormatter("product-status", {
        fieldId: "product-status",
      });
      expect(result2).toBe(formatter);
    });

    it("should unregister formatter registered by RegExp", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const formatter: CellFormatter = () => "regex";
      const pattern = /.*-status$/;
      registry?.registerFormatterById(pattern, formatter);
      expect(
        registry?.getFormatter("server-status", { fieldId: "server-status" })
      ).toBe(formatter);

      registry?.unregisterFormatter(pattern);
      expect(
        registry?.getFormatter("server-status", { fieldId: "server-status" })
      ).toBeUndefined();
    });

    it("should not find by-id formatter when lookup is by name (map isolation)", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const formatter: CellFormatter = () => "by-id-only";
      registry?.registerFormatterById("Status", formatter);

      // Lookup by name: id "Status" matches context.fieldName "Status" -> we check name map only
      const result = registry?.getFormatter("Status", {
        fieldId: "product-status",
        fieldName: "Status",
      });
      expect(result).toBeUndefined();

      // Lookup by id: context.fieldId "Status" -> we check id map and find it
      const resultById = registry?.getFormatter("Status", {
        fieldId: "Status",
        fieldName: "Status",
      });
      expect(resultById).toBe(formatter);
    });
  });

  describe("Formatter resolution strategies", () => {
    it("should use Strategy 1: data-type specific formatter (${inputDataType}.${id})", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const dataTypeFormatter: CellFormatter = () => "data-type-specific";

      registry?.registerFormatterById("status", dataTypeFormatter, "products");

      const result = registry?.getFormatter("status", {
        inputDataType: "products",
        fieldId: "status",
      });

      expect(result).toBe(dataTypeFormatter);
    });

    it("should use Strategy 2: field-name formatter (${inputDataType}.${fieldName})", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const fieldNameFormatter: CellFormatter = () => "field-name-specific";

      registry?.registerFormatterByName(
        "CPU Usage",
        fieldNameFormatter,
        "products"
      );

      const result = registry?.getFormatter("CPU Usage", {
        inputDataType: "products",
        fieldName: "CPU Usage",
      });

      expect(result).toBe(fieldNameFormatter);
    });

    it("should use Strategy 3: field-id formatter (${inputDataType}.${fieldId})", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const fieldIdFormatter: CellFormatter = () => "field-id-specific";

      registry?.registerFormatterById(
        "products-status",
        fieldIdFormatter,
        "products"
      );

      const result = registry?.getFormatter("products-status", {
        inputDataType: "products",
        fieldId: "products-status",
      });

      expect(result).toBe(fieldIdFormatter);
    });

    it("should use Strategy 4: data-path formatter (${inputDataType}.${dataPath})", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const dataPathFormatter: CellFormatter = () => "data-path-specific";

      registry?.registerFormatterByDataPath(
        "products.status",
        dataPathFormatter,
        "products"
      );

      const result = registry?.getFormatter("products.status", {
        inputDataType: "products",
        dataPath: "products.status",
      });

      expect(result).toBe(dataPathFormatter);
    });

    it("should use Strategy 5: direct lookup by id (fallback)", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const genericFormatter: CellFormatter = () => "generic";

      registry?.registerFormatterById("status", genericFormatter);

      const result = registry?.getFormatter("status", {
        inputDataType: "products",
        fieldId: "status",
      });

      expect(result).toBe(genericFormatter);
    });

    it("should use Strategy 6: direct lookup by fieldName (fallback)", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const fieldNameFormatter: CellFormatter = () => "field-name-direct";

      registry?.registerFormatterByName("CPU Usage", fieldNameFormatter);

      const result = registry?.getFormatter("CPU Usage", {
        inputDataType: "products",
        fieldName: "CPU Usage",
      });

      expect(result).toBe(fieldNameFormatter);
    });

    it("should use Strategy 7: direct lookup by fieldId (fallback)", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const fieldIdFormatter: CellFormatter = () => "field-id-direct";

      registry?.registerFormatterById("server-status", fieldIdFormatter);

      const result = registry?.getFormatter("server-status", {
        inputDataType: "products",
        fieldId: "server-status",
      });

      expect(result).toBe(fieldIdFormatter);
    });

    it("should use Strategy 8: direct lookup by dataPath (fallback)", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const dataPathFormatter: CellFormatter = () => "data-path-direct";

      registry?.registerFormatterByDataPath(
        "products.status",
        dataPathFormatter
      );

      const result = registry?.getFormatter("products.status", {
        inputDataType: "products",
        dataPath: "products.status",
      });

      expect(result).toBe(dataPathFormatter);
    });

    it("should resolve by id, name, or dataPath depending on context", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const idFormatter: CellFormatter = () => "id-direct";
      const fieldNameFormatter: CellFormatter = () => "field-name-direct";
      const fieldIdFormatter: CellFormatter = () => "field-id-direct";
      const dataPathFormatter: CellFormatter = () => "data-path-direct";

      registry?.registerFormatterById("status", idFormatter);
      registry?.registerFormatterByName("CPU Usage", fieldNameFormatter);
      registry?.registerFormatterById("server-status", fieldIdFormatter);
      registry?.registerFormatterByDataPath(
        "products.status",
        dataPathFormatter
      );

      const result1 = registry?.getFormatter("status", {
        inputDataType: "products",
        fieldId: "status",
      });
      expect(result1).toBe(idFormatter);

      const result2 = registry?.getFormatter("CPU Usage", {
        inputDataType: "products",
        fieldName: "CPU Usage",
      });
      expect(result2).toBe(fieldNameFormatter);

      const result3 = registry?.getFormatter("server-status", {
        inputDataType: "products",
        fieldId: "server-status",
      });
      expect(result3).toBe(fieldIdFormatter);

      const result4 = registry?.getFormatter("products.status", {
        inputDataType: "products",
        dataPath: "products.status",
      });
      expect(result4).toBe(dataPathFormatter);
    });

    it("should prioritize scoped formatter over global (by id)", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const globalFormatter: CellFormatter = () => "global";
      const scopedFormatter: CellFormatter = () => "scoped";

      registry?.registerFormatterById("status", globalFormatter);
      registry?.registerFormatterById("status", scopedFormatter, "products");

      const result = registry?.getFormatter("status", {
        inputDataType: "products",
        fieldId: "status",
      });
      expect(result).toBe(scopedFormatter);

      const resultGlobal = registry?.getFormatter("status", {
        fieldId: "status",
      });
      expect(resultGlobal).toBe(globalFormatter);
    });
  });

  describe("Row click handler registration", () => {
    it("should register and retrieve a row click handler", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const handler: RowClickHandler = (event, rowData) => {
        console.log("clicked", rowData);
      };

      registry?.registerRowClick("table-1", handler);
      const retrieved = registry?.getRowClick("table-1");

      expect(retrieved).toBe(handler);
    });

    it("should unregister a row click handler", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const handler: RowClickHandler = (event, rowData) => {
        console.log("clicked", rowData);
      };

      registry?.registerRowClick("table-1", handler);
      expect(registry?.getRowClick("table-1")).toBe(handler);

      registry?.unregisterRowClick("table-1");
      expect(registry?.getRowClick("table-1")).toBeUndefined();
    });

    it("should return undefined for non-existent row click handler", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      expect(registry?.getRowClick("non-existent")).toBeUndefined();
    });

    it("should return undefined for null or undefined id", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      expect(registry?.getRowClick(null)).toBeUndefined();
      expect(registry?.getRowClick(undefined)).toBeUndefined();
    });

    it("should find row click handler with inputDataType (scoped)", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const handler: RowClickHandler = () => {};
      registry?.registerRowClick("my-handler", handler, "catalog");

      expect(registry?.getRowClick("my-handler", "catalog")).toBe(handler);
      expect(registry?.getRowClick("my-handler")).toBe(handler);
    });

    it('should find row click handler registered with id="*" for inputDataType', () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const handler: RowClickHandler = () => {};
      registry?.registerRowClick("*", handler, "catalog");

      expect(registry?.getRowClick("any-component-id", "catalog")).toBe(
        handler
      );
    });
  });

  describe("Multiple formatters and handlers", () => {
    it("should handle multiple formatters simultaneously", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const formatter1: CellFormatter = () => "formatter1";
      const formatter2: CellFormatter = () => "formatter2";
      const formatter3: CellFormatter = () => "formatter3";

      registry?.registerFormatterById("status", formatter1);
      registry?.registerFormatterById("priority", formatter2);
      registry?.registerFormatterById("type", formatter3);

      expect(registry?.getFormatter("status", { fieldId: "status" })).toBe(
        formatter1
      );
      expect(registry?.getFormatter("priority", { fieldId: "priority" })).toBe(
        formatter2
      );
      expect(registry?.getFormatter("type", { fieldId: "type" })).toBe(
        formatter3
      );
    });

    it("should handle multiple row click handlers simultaneously", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const handler1: RowClickHandler = () => {};
      const handler2: RowClickHandler = () => {};
      const handler3: RowClickHandler = () => {};

      registry?.registerRowClick("table-1", handler1);
      registry?.registerRowClick("table-2", handler2);
      registry?.registerRowClick("table-3", handler3);

      expect(registry?.getRowClick("table-1")).toBe(handler1);
      expect(registry?.getRowClick("table-2")).toBe(handler2);
      expect(registry?.getRowClick("table-3")).toBe(handler3);
    });
  });

  describe("Formatter context handling", () => {
    it("should handle formatter lookup with full context", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const formatter: CellFormatter = () => "context-specific";

      registry?.registerFormatterById("products-status", formatter, "products");

      const result = registry?.getFormatter("products-status", {
        inputDataType: "products",
        fieldId: "products-status",
        fieldName: "Status",
        dataPath: "products.status",
        componentId: "data-view-1",
      });

      expect(result).toBe(formatter);
    });

    it("should handle formatter lookup with partial context", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const formatter: CellFormatter = () => "partial-context";

      registry?.registerFormatterByDataPath(
        "products.status",
        formatter,
        "products"
      );

      const result = registry?.getFormatter("products.status", {
        inputDataType: "products",
        dataPath: "products.status",
      });

      expect(result).toBe(formatter);
    });

    it("should handle formatter lookup without context", () => {
      let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
        null;

      render(
        <ComponentHandlerRegistryProvider>
          <TestComponent
            onRegistryReady={(reg) => {
              registry = reg;
            }}
          />
        </ComponentHandlerRegistryProvider>
      );

      const formatter: CellFormatter = () => "no-context";

      registry?.registerFormatterById("status", formatter);

      const result = registry?.getFormatter("status", { fieldId: "status" });

      expect(result).toBe(formatter);
    });
  });
});
