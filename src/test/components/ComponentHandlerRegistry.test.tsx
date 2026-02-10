import { render } from "@testing-library/react";

import {
  ComponentHandlerRegistryProvider,
  useComponentHandlerRegistry,
  type CellFormatter,
  type ItemClickHandler,
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
      expect(capturedRegistry?.onItemClickHandlers).toBeInstanceOf(Map);
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
      expect(typeof capturedRegistry?.registerFormatter).toBe("function");
      expect(typeof capturedRegistry?.unregisterFormatter).toBe("function");
      expect(typeof capturedRegistry?.getFormatter).toBe("function");
      expect(typeof capturedRegistry?.registerItemClick).toBe("function");
      expect(typeof capturedRegistry?.unregisterItemClick).toBe("function");
      expect(typeof capturedRegistry?.getItemClick).toBe("function");
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
      expect(capturedRegistry?.onItemClickHandlers).toBeInstanceOf(Map);
      // Should return undefined for getters
      expect(capturedRegistry?.getFormatter("test")).toBeUndefined();
      expect(capturedRegistry?.getItemClick("test")).toBeUndefined();
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
      capturedRegistry?.registerFormatter({ id: "test" }, formatter);
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
      registry?.registerFormatter({ id: "status" }, formatter);

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
      registry?.registerFormatter({ id: "status" }, formatter);
      expect(registry?.getFormatter("status", { fieldId: "status" })).toBe(
        formatter
      );

      registry?.unregisterFormatter({ id: "status" });
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

    describe("convenience methods (registerFormatterById, ByName, ByDataPath)", () => {
      it("registerFormatterById should behave like registerFormatter({ id }, formatter)", () => {
        let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
          null;
        render(
          <ComponentHandlerRegistryProvider>
            <TestComponent onRegistryReady={(r) => (registry = r)} />
          </ComponentHandlerRegistryProvider>
        );
        const formatter: CellFormatter = (v) => `by-id: ${v}`;
        registry?.registerFormatterById("status", formatter);
        expect(registry?.getFormatter("status", { fieldId: "status" })).toBe(
          formatter
        );
        registry?.unregisterFormatterById("status");
        expect(
          registry?.getFormatter("status", { fieldId: "status" })
        ).toBeUndefined();
      });

      it("registerFormatterByName should behave like registerFormatter({ name }, formatter)", () => {
        let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
          null;
        render(
          <ComponentHandlerRegistryProvider>
            <TestComponent onRegistryReady={(r) => (registry = r)} />
          </ComponentHandlerRegistryProvider>
        );
        const formatter: CellFormatter = (v) => `by-name: ${v}`;
        registry?.registerFormatterByName("Status", formatter);
        expect(registry?.getFormatter("Status", { fieldName: "Status" })).toBe(
          formatter
        );
        registry?.unregisterFormatterByName("Status");
        expect(
          registry?.getFormatter("Status", { fieldName: "Status" })
        ).toBeUndefined();
      });

      it("registerFormatterByDataPath should behave like registerFormatter({ dataPath }, formatter)", () => {
        let registry: ReturnType<typeof useComponentHandlerRegistry> | null =
          null;
        render(
          <ComponentHandlerRegistryProvider>
            <TestComponent onRegistryReady={(r) => (registry = r)} />
          </ComponentHandlerRegistryProvider>
        );
        const formatter: CellFormatter = (v) => `by-path: ${v}`;
        registry?.registerFormatterByDataPath("products.price", formatter);
        expect(
          registry?.getFormatter("products.price", {
            dataPath: "products.price",
          })
        ).toBe(formatter);
        registry?.unregisterFormatterByDataPath("products.price");
        expect(
          registry?.getFormatter("products.price", {
            dataPath: "products.price",
          })
        ).toBeUndefined();
      });
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
      registry?.registerFormatter({ id: /.*-status$/ }, formatter);

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
      registry?.registerFormatter({ id: pattern }, formatter);
      expect(
        registry?.getFormatter("server-status", { fieldId: "server-status" })
      ).toBe(formatter);

      registry?.unregisterFormatter({ id: pattern });
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
      registry?.registerFormatter({ id: "Status" }, formatter);

      // Lookup by name: identifier "Status" with context.fieldId "product-status", fieldName "Status"
      // Entry matches on id; value used is context.fieldId ?? id = "product-status". "Status" !== "product-status" -> no match
      const result = registry?.getFormatter("Status", {
        fieldId: "product-status",
        fieldName: "Status",
      });
      expect(result).toBeUndefined();

      // Lookup by id: context.fieldId "Status" -> matchers.id "Status" matches
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

      registry?.registerFormatter(
        { id: "status" },
        dataTypeFormatter,
        "products"
      );

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

      registry?.registerFormatter(
        { name: "CPU Usage" },
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

      registry?.registerFormatter(
        { id: "products-status" },
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

      registry?.registerFormatter(
        { dataPath: "products.status" },
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

      registry?.registerFormatter({ id: "status" }, genericFormatter);

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

      registry?.registerFormatter({ name: "CPU Usage" }, fieldNameFormatter);

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

      registry?.registerFormatter({ id: "server-status" }, fieldIdFormatter);

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

      registry?.registerFormatter(
        { dataPath: "products.status" },
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

      registry?.registerFormatter({ id: "status" }, idFormatter);
      registry?.registerFormatter({ name: "CPU Usage" }, fieldNameFormatter);
      registry?.registerFormatter({ id: "server-status" }, fieldIdFormatter);
      registry?.registerFormatter(
        { dataPath: "products.status" },
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

      registry?.registerFormatter({ id: "status" }, globalFormatter);
      registry?.registerFormatter(
        { id: "status" },
        scopedFormatter,
        "products"
      );

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
    it("should register and retrieve an item click handler", () => {
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

      const handler: ItemClickHandler = (event, rowData) => {
        console.log("clicked", rowData);
      };

      registry?.registerItemClick("table-1", handler);
      const retrieved = registry?.getItemClick("table-1");

      expect(retrieved).toBe(handler);
    });

    it("should unregister an item click handler", () => {
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

      const handler: ItemClickHandler = (event, rowData) => {
        console.log("clicked", rowData);
      };

      registry?.registerItemClick("table-1", handler);
      expect(registry?.getItemClick("table-1")).toBe(handler);

      registry?.unregisterItemClick("table-1");
      expect(registry?.getItemClick("table-1")).toBeUndefined();
    });

    it("should return undefined for non-existent item click handler", () => {
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

      expect(registry?.getItemClick("non-existent")).toBeUndefined();
    });

    it("should return undefined for null or undefined inputDataType", () => {
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

      expect(registry?.getItemClick(null)).toBeUndefined();
      expect(registry?.getItemClick(undefined)).toBeUndefined();
    });

    it("should find item click handler by inputDataType", () => {
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

      const handler: ItemClickHandler = () => {};
      registry?.registerItemClick("catalog", handler);

      expect(registry?.getItemClick("catalog")).toBe(handler);
    });

    it("should find item click handler by RegExp pattern", () => {
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

      const handler: ItemClickHandler = () => {};
      registry?.registerItemClick(/catalog|inventory/, handler);

      expect(registry?.getItemClick("catalog")).toBe(handler);
      expect(registry?.getItemClick("inventory")).toBe(handler);
      expect(registry?.getItemClick("other")).toBeUndefined();
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

      registry?.registerFormatter({ id: "status" }, formatter1);
      registry?.registerFormatter({ id: "priority" }, formatter2);
      registry?.registerFormatter({ id: "type" }, formatter3);

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

    it("should handle multiple item click handlers simultaneously", () => {
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

      const handler1: ItemClickHandler = () => {};
      const handler2: ItemClickHandler = () => {};
      const handler3: ItemClickHandler = () => {};

      registry?.registerItemClick("catalog", handler1);
      registry?.registerItemClick("inventory", handler2);
      registry?.registerItemClick("products", handler3);

      expect(registry?.getItemClick("catalog")).toBe(handler1);
      expect(registry?.getItemClick("inventory")).toBe(handler2);
      expect(registry?.getItemClick("products")).toBe(handler3);
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

      registry?.registerFormatter(
        { id: "products-status" },
        formatter,
        "products"
      );

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

      registry?.registerFormatter(
        { dataPath: "products.status" },
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

      registry?.registerFormatter({ id: "status" }, formatter);

      const result = registry?.getFormatter("status", { fieldId: "status" });

      expect(result).toBe(formatter);
    });
  });
});
