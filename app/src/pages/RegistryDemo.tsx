import {
  ComponentHandlerRegistryProvider,
  useComponentHandlerRegistry,
} from "@local-lib/components/ComponentHandlerRegistry";
import DataViewWrapper from "@local-lib/components/DataViewWrapper";
import OneCardWrapper from "@local-lib/components/OneCardWrapper";
import {
  Alert,
  AlertVariant,
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
  ExpandableSection,
  Icon,
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PausedIcon,
} from "@patternfly/react-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  registryDemoById,
  registryDemoByName,
  registryDemoByDataPath,
  registryDemoRowClick,
  registryDemoPatternMatching,
  registryDemoCssClasses,
  registryDemoOneCard,
} from "../demo/registryDemoData";

// Helper function to create a URL-friendly slug from a title
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// RegExp ref for pattern-demo formatter (must unregister same reference)
const patternDemoRegexRef = { current: null as RegExp | null };

// Component that registers formatters and handlers
function RegistrySetup() {
  const registry = useComponentHandlerRegistry();
  const registeredRef = useRef(false);

  // Register formatters synchronously using useMemo to ensure they're registered before render
  // This ensures they're available before DataViewWrapper tries to resolve them
  useMemo(() => {
    if (registeredRef.current) return; // Only register once
    registeredRef.current = true;

    // Example 1 (inputDataType "products"): Register by ID — format Product and Status columns
    registry.registerFormatterById(
      "product-name",
      (value) => (
        <strong style={{ color: "#0066cc", fontSize: "1.1em" }}>
          {String(value)}
        </strong>
      ),
      "products"
    );
    registry.registerFormatterById(
      "product-status",
      (value) => {
        const status = String(value);
        const isRunning = status === "Running";
        const isStopped = status === "Stopped";
        const bg = isRunning ? "#d4edda" : isStopped ? "#e2e3e5" : "#fff3cd";
        const color = isRunning ? "#155724" : isStopped ? "#383d41" : "#856404";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: "12px",
              fontSize: "0.85em",
              fontWeight: 600,
              backgroundColor: bg,
              color,
            }}
          >
            {status}
          </span>
        );
      },
      "products"
    );

    // Example 2 (inputDataType "servers"): Register by Name — format Status and Price columns
    registry.registerFormatterByName(
      "Status",
      (value) => {
        const status = String(value);
        const isRunning = status === "Running";
        const isStopped = status === "Stopped";
        let icon;
        let borderColor: string;
        if (isRunning) {
          icon = <CheckCircleIcon />;
          borderColor = "#2d5016";
        } else if (isStopped) {
          icon = <PausedIcon />;
          borderColor = "#6a6e73";
        } else {
          icon = <ExclamationTriangleIcon />;
          borderColor = "#f0ab00";
        }
        return (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingLeft: "8px",
              borderLeft: `3px solid ${borderColor}`,
            }}
          >
            {isRunning ? (
              <Icon status="success">{icon}</Icon>
            ) : isStopped ? (
              icon
            ) : (
              <Icon status="warning">{icon}</Icon>
            )}
            <span>{status}</span>
          </span>
        );
      },
      "servers"
    );
    registry.registerFormatterByName(
      "Price",
      (value) => {
        const num =
          typeof value === "number" ? value : parseFloat(String(value));
        return (
          <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(num)}
          </span>
        );
      },
      "servers"
    );

    // Example 5 (OneCardWrapper, inputDataType "servers"): Register by ID for Status and Health
    registry.registerFormatterById(
      "server-status",
      (value) => {
        const status = String(value);
        const isRunning = status === "Running";
        const isStopped = status === "Stopped";
        let icon;
        let borderColor: string;
        if (isRunning) {
          icon = <CheckCircleIcon />;
          borderColor = "#2d5016";
        } else if (isStopped) {
          icon = <PausedIcon />;
          borderColor = "#6a6e73";
        } else {
          icon = <ExclamationTriangleIcon />;
          borderColor = "#f0ab00";
        }
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              paddingLeft: "8px",
              borderLeft: `3px solid ${borderColor}`,
            }}
          >
            {isRunning ? (
              <Icon status="success">{icon}</Icon>
            ) : isStopped ? (
              icon
            ) : (
              <Icon status="warning">{icon}</Icon>
            )}
            <span>{status}</span>
          </span>
        );
      },
      "servers"
    );
    registry.registerFormatterById(
      "server-health",
      (value) => {
        const health = String(value).toLowerCase();
        const isHealthy = health === "healthy";
        const bg = isHealthy ? "#d4edda" : "#f8d7da";
        const color = isHealthy ? "#155724" : "#721c24";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: "12px",
              fontSize: "0.85em",
              fontWeight: 600,
              backgroundColor: bg,
              color,
            }}
          >
            {String(value)}
          </span>
        );
      },
      "servers"
    );

    // Example 3 (inputDataType "inventory"): Register by DataPath — format Price and Category columns (paths that exist in table)
    registry.registerFormatterByDataPath(
      "products.price",
      (value) => {
        const num =
          typeof value === "number" ? value : parseFloat(String(value));
        return (
          <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(num)}
          </span>
        );
      },
      "inventory"
    );
    registry.registerFormatterByDataPath(
      "products.category",
      (value) => (
        <span
          style={{
            fontStyle: "italic",
            color: "#795600",
            backgroundColor: "#fff3cd",
            padding: "2px 8px",
            borderRadius: "4px",
            border: "1px solid #f0ab00",
          }}
        >
          {String(value)}
        </span>
      ),
      "inventory"
    );

    // Example 5 (inputDataType "pattern-demo"): Register by ID with RegExp — match multiple field ids
    patternDemoRegexRef.current = /^product-(name|status)$/;
    registry.registerFormatterById(
      patternDemoRegexRef.current,
      (value) => (
        <span
          style={{
            borderLeft: "3px solid #0066cc",
            paddingLeft: "8px",
            fontWeight: 500,
          }}
        >
          {String(value)}
        </span>
      ),
      "pattern-demo"
    );

    // Example 4: Row click handler
    registry.registerRowClick("registry-demo-rowclick", (event, rowData) => {
      alert(
        `Row clicked!\n\nProduct: ${rowData["Product"]}\nStatus: ${rowData["Status"]}\nPrice: ${rowData["Price"]}\nCategory: ${rowData["Category"]}`
      );
    });
  }, [registry]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Unregister all formatters (keys are inputDataType.pattern when registered with inputDataType)
      registry.unregisterFormatter("products.product-name");
      registry.unregisterFormatter("products.product-status");
      registry.unregisterFormatter("servers.Status");
      registry.unregisterFormatter("servers.Price");
      registry.unregisterFormatter("servers.server-status");
      registry.unregisterFormatter("servers.server-health");
      registry.unregisterFormatter("inventory.products.price");
      registry.unregisterFormatter("inventory.products.category");
      if (patternDemoRegexRef.current) {
        registry.unregisterFormatter(patternDemoRegexRef.current);
        patternDemoRegexRef.current = null;
      }
      registry.unregisterRowClick("registry-demo-rowclick");
    };
  }, [registry]);

  return null;
}

const examples = [
  {
    title: "Example 1: Register by ID",
    data: registryDemoById,
    description:
      'Table has inputDataType="products". Formatters are registered with registerFormatterById using inputDataType "products", so the Product and Status columns are formatted.',
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Registered formatters (inputDataType \"products\"):</strong>
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`registry.registerFormatterById("product-name", (value) => (
  <strong>{String(value)}</strong>
), "products");

registry.registerFormatterById("product-status", (value) => (
  <span>{/* status with icon */}</span>
), "products");`}</CodeBlockCode>
        </CodeBlock>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          Because this table uses inputDataType=\"products\", only formatters
          registered with \"products\" match. Product and Status columns are
          formatted.
        </Content>
      </>
    ),
  },
  {
    title: "Example 2: Register by Name",
    data: registryDemoByName,
    description:
      'Table has inputDataType="servers". Formatters are registered with registerFormatterByName using inputDataType "servers", so the Status and Price columns are formatted.',
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Registered formatters (inputDataType \"servers\"):</strong>
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`registry.registerFormatterByName("Status", (value) => (
  <span>{/* status with icon */}</span>
), "servers");

registry.registerFormatterByName("Price", (value) => (
  <span>{/* currency formatted */}</span>
), "servers");`}</CodeBlockCode>
        </CodeBlock>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          Because this table uses inputDataType=\"servers\", only formatters
          registered with \"servers\" match. Status and Price columns are
          formatted.
        </Content>
      </>
    ),
  },
  {
    title: "Example 3: Register by DataPath",
    data: registryDemoByDataPath,
    description:
      'Table has inputDataType="inventory". Formatters are registered with registerFormatterByDataPath using inputDataType "inventory", so the Price and Category columns are formatted (data paths products.price and products.category).',
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Registered formatters (inputDataType \"inventory\"):</strong>
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`registry.registerFormatterByDataPath("products.price", (value) => (
  <span>{/* currency formatted */}</span>
), "inventory");

registry.registerFormatterByDataPath("products.category", (value) => (
  <span>{/* amber badge */}</span>
), "inventory");`}</CodeBlockCode>
        </CodeBlock>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          Because this table uses inputDataType=\"inventory\", only formatters
          registered with \"inventory\" match. Price and Category columns are
          formatted.
        </Content>
      </>
    ),
  },
  {
    title: "Example 4: Row Click Handler",
    data: registryDemoRowClick,
    description:
      'Table has inputDataType="catalog". Same table structure; click any row to see the registered row click handler.',
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Registered handler:</strong>
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`registry.registerRowClick("registry-demo-rowclick", (event, rowData) => {
  alert(\`Row clicked!\\n\\nProduct: \${rowData["Product"]}\\nStatus: \${rowData["Status"]}\\nPrice: \${rowData["Price"]}\\nCategory: \${rowData["Category"]}\\nRole: \${rowData["Role"]}\\nEmail: \${rowData["Email"]}\`);
});`}</CodeBlockCode>
        </CodeBlock>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Usage:</strong> The DataViewWrapper with{" "}
          <code>id: "registry-demo-rowclick"</code> automatically uses the
          registered handler. Click any row to see it in action!
        </Content>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <code>id</code> can be <code>"*"</code> to register a handler for all
          components with a given <code>inputDataType</code> (e.g.{" "}
          <code>registerRowClick("*", handler, "catalog")</code>).
        </Content>
      </>
    ),
  },
  {
    title: "Example 5: Pattern matching (RegExp)",
    data: registryDemoPatternMatching,
    description:
      'The first parameter of registerFormatterById, registerFormatterByName, and registerFormatterByDataPath can be a RegExp. Any field whose id (or name, or data_path) matches the pattern uses that formatter. This example uses inputDataType="pattern-demo" and a single RegExp to format both Product and Status columns.',
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Registered formatter (RegExp by id):</strong>
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`// Match field ids "product-name" and "product-status" with one pattern
registry.registerFormatterById(
  /^product-(name|status)$/,
  (value) => (
    <span style={{ borderLeft: "3px solid #0066cc", paddingLeft: "8px" }}>
      ${"{" + "String(value)}"}
    </span>
  ),
  "pattern-demo"
);`}</CodeBlockCode>
        </CodeBlock>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          The same works for <code>registerFormatterByName</code> (pattern
          matched against field <code>name</code>) and{" "}
          <code>registerFormatterByDataPath</code> (pattern matched against{" "}
          <code>data_path</code>). To unregister, pass the same RegExp instance
          to <code>unregisterFormatter</code>.
        </Content>
      </>
    ),
  },
  {
    title: "Example 6: CSS Classes",
    data: registryDemoCssClasses,
    description:
      "DataViewWrapper automatically adds CSS classes to the table wrapper and to each cell so you can target them in your styles. The wrapper gets a data-type class; each cell gets a field-id class.",
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Auto-generated classes:</strong>
        </Content>
        <Content component={ContentVariants.ul} style={{ marginTop: "8px" }}>
          <li>
            <strong>Wrapper:</strong> <code>data-view-{`{inputDataType}`}</code>{" "}
            — from <code>inputDataType</code>. This example uses{" "}
            <code>inputDataType="table-styling"</code>, so the root div has
            class <code>data-view-table-styling</code>.
          </li>
          <li>
            <strong>Table container:</strong>{" "}
            <code>dataview-table-container</code> — wraps the table for
            horizontal scroll.
          </li>
          <li>
            <strong>Cells:</strong>{" "}
            <code>field-id-{`{fieldId || fieldName}`}</code> — each{" "}
            <code>&lt;td&gt;</code> gets a class from the column&apos;s{" "}
            <code>field.id</code> or field name (sanitized). e.g.{" "}
            <code>field-id-product-name</code>,{" "}
            <code>field-id-product-status</code>.
          </li>
        </Content>
        <Content component={ContentVariants.p} style={{ marginTop: "12px" }}>
          Use these classes in your CSS or CSS-in-JS to style specific data
          types or columns without adding custom props:
        </Content>
        <CodeBlock style={{ marginTop: "8px" }}>
          <CodeBlockCode>{`/* Target this table's wrapper (inputDataType="table-styling") */
.data-view-table-styling {
  border: 1px solid var(--pf-v6-global--BorderColor--100);
}

/* Target a specific column (e.g. Status) */
.field-id-product-status {
  font-weight: 600;
}

/* Combine wrapper + column */
.data-view-table-styling .field-id-product-price {
  text-align: right;
}`}</CodeBlockCode>
        </CodeBlock>
      </>
    ),
  },
  {
    title: "Example 7: OneCardWrapper",
    data: registryDemoOneCard,
    description:
      "Demonstrates that the ComponentHandlerRegistry works with other components too, not just DataViewWrapper. OneCardWrapper can use the same formatters registered in the registry.",
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Registered formatters (shared with DataViewWrapper):</strong>
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`registry.registerFormatterById("server-status", ..., "servers")
registry.registerFormatterById("server-health", ..., "servers")`}</CodeBlockCode>
        </CodeBlock>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Usage:</strong> OneCardWrapper uses the same registry and
          formatter resolution strategies as DataViewWrapper. Formatters are
          automatically resolved by field id, name, or data_path.
        </Content>
        <CodeBlock style={{ marginTop: "8px" }}>
          <CodeBlockCode>{`<OneCardWrapper
  id="registry-demo-onecard"
  title="Server Details"
  inputDataType="servers"
  fields={[
    {
      id: "server-status",
      name: "Status",
      data_path: "servers.status",
      data: ["Running"]
    }
  ]}
/>`}</CodeBlockCode>
        </CodeBlock>
        <Alert
          variant={AlertVariant.info}
          isInline
          title="Cross-Component Formatters"
          style={{ marginTop: "12px" }}
        >
          <Content component={ContentVariants.p}>
            The same formatters registered for DataViewWrapper can be reused in
            OneCardWrapper and other components. This enables consistent
            formatting across your entire application.
          </Content>
        </Alert>
      </>
    ),
  },
];

export default function RegistryDemo() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<
    Record<string | number, boolean>
  >({});
  const exampleRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll to example when hash is present in URL
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.substring(1);
      const element = exampleRefs.current[hash];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.hash]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const [apiExpanded, setApiExpanded] = useState(false);

  return (
    <ComponentHandlerRegistryProvider>
      <style>
        {`
          /* Reduce empty space in collapsed ExpandableSection */
          .config-section-collapsed .pf-v6-c-expandable-section__content {
            padding-block-end: 0 !important;
            min-height: 0 !important;
            max-height: 0 !important;
            overflow: hidden !important;
          }
          .config-section-collapsed .pf-v6-c-expandable-section {
            padding-block-end: 0 !important;
          }
          /* Improve readability */
          .registry-demo-section {
            background-color: #fafafa;
            padding: 20px;
            border-radius: 8px;
            margin: 16px 0;
            border-left: 4px solid #0066cc;
          }
          .registry-demo-api-section {
            background-color: #ffffff;
            padding: 24px;
            border-radius: 8px;
            margin: 16px 0;
            border: 1px solid #d2d2d2;
          }
          .registry-demo-method {
            background-color: #f8f9fa;
            padding: 16px;
            border-radius: 6px;
            margin: 12px 0;
            border-left: 3px solid #0066cc;
          }
          .registry-demo-note {
            background-color: #fff3cd;
            border-left: 4px solid #f0ab00;
            padding: 12px 16px;
            margin: 12px 0;
            border-radius: 4px;
          }
          /* Example 6: demonstrate auto-generated data-view CSS classes */
          #registry-demo-css-classes.data-view-table-styling {
            border: 2px solid #0066cc;
            border-radius: 8px;
            padding: 12px;
          }
          .data-view-table-styling .field-id-product-status {
            font-weight: 600;
          }
          .data-view-table-styling .field-id-product-price {
            text-align: right;
          }
        `}
      </style>
      <RegistrySetup />
      <div className="registry-demo-section">
        <Content
          component={ContentVariants.h1}
          style={{ marginBottom: "16px" }}
        >
          ComponentHandlerRegistry
        </Content>
        <Content
          component={ContentVariants.p}
          style={{ fontSize: "1.1em", lineHeight: "1.6" }}
        >
          The ComponentHandlerRegistry provides a centralized way to register
          and resolve formatters and row click handlers for supported components
          like DataViewWrapper and OneCardWrapper. This enables data-aware
          formatter selection and reusable handler logic across your entire
          application.
        </Content>
      </div>

      <Divider style={{ margin: "32px 0" }} />

      <Content component={ContentVariants.h2} style={{ marginBottom: "16px" }}>
        Quick Start
      </Content>
      <div className="registry-demo-section">
        <Content component={ContentVariants.h3} style={{ marginTop: "0" }}>
          1. Wrap your app with the Provider
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`import { ComponentHandlerRegistryProvider } from '@rhngui/patternfly-react-renderer';

function App() {
  return (
    <ComponentHandlerRegistryProvider>
      {/* Your app content */}
    </ComponentHandlerRegistryProvider>
  );
}`}</CodeBlockCode>
        </CodeBlock>

        <Content component={ContentVariants.h3} style={{ marginTop: "24px" }}>
          2. Register formatters and handlers
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`import { useComponentHandlerRegistry } from '@rhngui/patternfly-react-renderer';

function MyComponent() {
  const registry = useComponentHandlerRegistry();

  useEffect(() => {
    // Register formatter by field id
    registry.registerFormatterById('subscriptions-endDate', (value) => {
      return formatDate(value);
    });

    // Register formatter by field name
    registry.registerFormatterByName('End Date', (value) => {
      return formatDate(value);
    });

    // Register formatter by data path
    registry.registerFormatterByDataPath('$..subscriptions[*].endDate', (value) => {
      return formatDate(value);
    });

    // Register with inputDataType for data-type specific matching
    registry.registerFormatterById(
      'subscriptions-endDate',
      (value) => formatDate(value),
      'table.dataset'  // Only matches when input_data_type is "table.dataset"
    );

    // Register with regex pattern
    registry.registerFormatterById(/.*-endDate$/, (value) => {
      return formatDate(value);
    });

    // Register a row click handler
    registry.registerRowClick('my-table', (event, rowData) => {
      console.log('Row clicked:', rowData);
    });
  }, [registry]);

  return <DataViewWrapper
    id="my-table"
    inputDataType="table.dataset"
    fields={[
      {
        id: "subscriptions-endDate",
        name: "End Date",
        data_path: "$..subscriptions[*].endDate",
        data: ["2024-12-24"]
        // Formatter automatically resolved by id/name/data_path
      }
    ]}
  />;
}`}</CodeBlockCode>
        </CodeBlock>
      </div>

      <Divider style={{ margin: "32px 0" }} />

      <Content component={ContentVariants.h2} style={{ marginBottom: "16px" }}>
        Examples
      </Content>

      {examples.map((example, index) => {
        const slug = createSlug(example.title);
        const isExpanded = expandedSections[index] ?? false;

        return (
          <div
            key={index}
            ref={(el) => {
              exampleRefs.current[slug] = el;
            }}
            id={slug}
            style={{ marginBottom: index < examples.length - 1 ? "32px" : 0 }}
          >
            <ExpandableSection
              isExpanded={isExpanded}
              onToggle={() => toggleSection(index)}
              toggleContent={
                <Content component={ContentVariants.h3}>
                  {example.title}
                </Content>
              }
            >
              <Content
                component={ContentVariants.p}
                style={{ marginTop: "16px" }}
              >
                {example.description}
              </Content>

              {example.strategyDetails && (
                <div style={{ marginTop: "16px" }}>
                  {example.strategyDetails}
                </div>
              )}

              <div
                style={{
                  marginTop: "16px",
                  border: "1px solid #d2d2d2",
                  padding: "16px",
                  borderRadius: "4px",
                  backgroundColor: "#fafafa",
                }}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(example.data as any).component === "one-card" ? (
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  <OneCardWrapper {...(example.data as any)} />
                ) : (
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  <DataViewWrapper {...(example.data as any)} />
                )}
              </div>

              <div
                style={{ marginTop: 16 }}
                className={
                  expandedSections[`${index}-config`]
                    ? "config-section-expanded"
                    : "config-section-collapsed"
                }
              >
                <ExpandableSection
                  toggleText="Configuration"
                  isExpanded={expandedSections[`${index}-config`] || false}
                  onToggle={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      [`${index}-config`]: !prev[`${index}-config`],
                    }))
                  }
                >
                  <CodeBlock>
                    <CodeBlockCode>
                      {JSON.stringify(example.data, null, 2)}
                    </CodeBlockCode>
                  </CodeBlock>
                </ExpandableSection>
              </div>
            </ExpandableSection>
          </div>
        );
      })}

      <Divider style={{ margin: "32px 0" }} />

      <ExpandableSection
        isExpanded={apiExpanded}
        onToggle={() => setApiExpanded(!apiExpanded)}
        toggleContent={
          <Content component={ContentVariants.h2}>API Reference</Content>
        }
      >
        <div className="registry-demo-api-section">
          <Content component={ContentVariants.h3} style={{ marginTop: "0" }}>
            Provider and Hook
          </Content>

          <Content component={ContentVariants.h3} style={{ marginTop: "24px" }}>
            Provider and Hook
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              ComponentHandlerRegistryProvider
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`import { ComponentHandlerRegistryProvider } from '@rhngui/patternfly-react-renderer';

<ComponentHandlerRegistryProvider>
  {/* Your app content */}
</ComponentHandlerRegistryProvider>`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Wraps your application to provide the registry context. All
              components that need to use the registry must be children of this
              provider.
            </Content>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              useComponentHandlerRegistry
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`import { useComponentHandlerRegistry } from '@rhngui/patternfly-react-renderer';

const registry = useComponentHandlerRegistry();`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Hook to access the registry instance. Returns a no-op registry if
              used outside of the provider.
            </Content>
          </div>

          <Content component={ContentVariants.h3} style={{ marginTop: "32px" }}>
            Formatter Registration Methods
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              registerFormatterById
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.registerFormatterById(
  id: string | RegExp,
  formatter: CellFormatter,
  inputDataType?: string
): void`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px" }}
            >
              <strong>Parameters:</strong>
            </Content>
            <ul>
              <li>
                <code>id</code> - The field id to match against (string or
                RegExp pattern)
              </li>
              <li>
                <code>formatter</code> - Function that takes a value and returns
                a ReactNode
              </li>
              <li>
                <code>inputDataType</code> - Optional: If provided, formatter
                will only match when input_data_type matches
              </li>
            </ul>
            <div className="registry-demo-note">
              <Content component={ContentVariants.p} style={{ margin: "0" }}>
                <strong>Note:</strong> Formatters registered with this method
                will <strong>only</strong> match when the registry checks the
                field <code>id</code> property. They will not match when
                checking <code>name</code> or <code>data_path</code> properties.
              </Content>
            </div>
            <CodeBlock style={{ marginTop: "12px" }}>
              <CodeBlockCode>{`// Register by exact field id
registry.registerFormatterById("product-name", (value) => (
  <strong>{String(value)}</strong>
));

// Register with data type scoping
registry.registerFormatterById("server-status", (value) => (
  <span>{/* formatted value */}</span>
), "servers");

// Register with regex pattern
registry.registerFormatterById(/.*-endDate$/, (value) => (
  formatDate(value)
));`}</CodeBlockCode>
            </CodeBlock>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              registerFormatterByName
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.registerFormatterByName(
  name: string | RegExp,
  formatter: CellFormatter,
  inputDataType?: string
): void`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px" }}
            >
              <strong>Parameters:</strong>
            </Content>
            <ul>
              <li>
                <code>name</code> - The field name to match against (string or
                RegExp pattern)
              </li>
              <li>
                <code>formatter</code> - Function that takes a value and returns
                a ReactNode
              </li>
              <li>
                <code>inputDataType</code> - Optional: If provided, formatter
                will only match when input_data_type matches
              </li>
            </ul>
            <div className="registry-demo-note">
              <Content component={ContentVariants.p} style={{ margin: "0" }}>
                <strong>Note:</strong> Formatters registered with this method
                will <strong>only</strong> match when the registry checks the
                field <code>name</code> property. They will not match when
                checking <code>id</code> or <code>data_path</code> properties.
              </Content>
            </div>
            <CodeBlock style={{ marginTop: "12px" }}>
              <CodeBlockCode>{`// Register by field name
registry.registerFormatterByName("Status", (value) => (
  <span>{/* formatted value */}</span>
));

// Register with data type scoping
registry.registerFormatterByName("CPU Usage", (value) => (
  <span>{/* formatted value */}</span>
), "pods");`}</CodeBlockCode>
            </CodeBlock>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              registerFormatterByDataPath
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.registerFormatterByDataPath(
  dataPath: string | RegExp,
  formatter: CellFormatter,
  inputDataType?: string
): void`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px" }}
            >
              <strong>Parameters:</strong>
            </Content>
            <ul>
              <li>
                <code>dataPath</code> - The field data_path to match against
                (string or RegExp pattern)
              </li>
              <li>
                <code>formatter</code> - Function that takes a value and returns
                a ReactNode
              </li>
              <li>
                <code>inputDataType</code> - Optional: If provided, formatter
                will only match when input_data_type matches
              </li>
            </ul>
            <div className="registry-demo-note">
              <Content component={ContentVariants.p} style={{ margin: "0" }}>
                <strong>Note:</strong> Formatters registered with this method
                will <strong>only</strong> match when the registry checks the
                field <code>data_path</code> property. They will not match when
                checking <code>id</code> or <code>name</code> properties.
              </Content>
            </div>
            <CodeBlock style={{ marginTop: "12px" }}>
              <CodeBlockCode>{`// Register by data path
registry.registerFormatterByDataPath("users.name", (value) => (
  <span>{/* formatted value */}</span>
));

// Register with data type scoping
registry.registerFormatterByDataPath("inventory.items.status", (value) => (
  <span>{/* formatted value */}</span>
), "inventory");`}</CodeBlockCode>
            </CodeBlock>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              unregisterFormatter
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.unregisterFormatter(
  id: string | RegExp
): void`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Removes a previously registered formatter. Accepts either a string
              id or RegExp pattern that was used during registration.
            </Content>
          </div>

          <Content component={ContentVariants.h3} style={{ marginTop: "32px" }}>
            Row Click Handler Methods
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              registerRowClick
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.registerRowClick(
  id: string,
  handler: RowClickHandler,
  inputDataType?: string
): void`}</CodeBlockCode>
            </CodeBlock>
            <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
              <strong>Parameters:</strong>
            </Content>
            <ul>
              <li>
                <code>id</code> - The component ID to associate the handler
                with. Use <code>"*"</code> to register a handler for all
                components with the specified <code>inputDataType</code>.
              </li>
              <li>
                <code>handler</code> - Function that receives the click event
                and row data.
              </li>
              <li>
                <code>inputDataType</code> - Optional: If provided, handler is
                scoped to that data type. With <code>id="*"</code>, the handler
                applies to all components with this <code>inputDataType</code>.
              </li>
            </ul>
            <CodeBlock style={{ marginTop: "12px" }}>
              <CodeBlockCode>{`// By component id only
registry.registerRowClick("my-table", (event, rowData) => {
  console.log("Row clicked:", rowData);
});

// By component id + inputDataType
registry.registerRowClick("my-table", (event, rowData) => {
  console.log("Row clicked:", rowData);
}, "products");

// For all components with a specific inputDataType (id="*")
registry.registerRowClick("*", (event, rowData) => {
  console.log("Any catalog table row clicked:", rowData);
}, "catalog");`}</CodeBlockCode>
            </CodeBlock>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              unregisterRowClick
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.unregisterRowClick(
  id: string,
  inputDataType?: string
): void`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Removes a previously registered row click handler. Pass the same{" "}
              <code>id</code> (and <code>inputDataType</code> if used) as at
              registration. For inputDataType-only handlers use{" "}
              <code>unregisterRowClick("*", inputDataType)</code>.
            </Content>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              getRowClick
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.getRowClick(
  id: string | null | undefined,
  inputDataType?: string
): RowClickHandler | undefined`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Retrieves a row click handler by component ID. Tries multiple
              lookup strategies in order:
              <ol>
                <li>
                  Data-type specific: <code>{"{inputDataType}.{id}"}</code>{" "}
                  (e.g., "catalog.my-table")
                </li>
                <li>
                  InputDataType-only: <code>inputDataType</code> (handlers
                  registered with <code>id="*"</code>)
                </li>
                <li>
                  Direct lookup by <code>id</code> (e.g., "my-table")
                </li>
                <li>Extract suffix from prefixed ID and try generic lookup</li>
              </ol>
            </Content>
          </div>

          <Content component={ContentVariants.h3} style={{ marginTop: "32px" }}>
            Formatter Retrieval Methods
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              getFormatter
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.getFormatter(
  id: string | null | undefined,
  context?: FormatterContext
): CellFormatter | undefined`}</CodeBlockCode>
            </CodeBlock>
            <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
              <strong>Parameters:</strong>
            </Content>
            <ul>
              <li>
                <code>id</code> - The identifier to look up (field id, name, or
                data_path)
              </li>
              <li>
                <code>context</code> - Optional context object with:
                <ul>
                  <li>
                    <code>fieldId</code> - The field id
                  </li>
                  <li>
                    <code>fieldName</code> - The field name
                  </li>
                  <li>
                    <code>dataPath</code> - The field data_path
                  </li>
                  <li>
                    <code>inputDataType</code> - The input data type
                  </li>
                  <li>
                    <code>componentId</code> - The component ID
                  </li>
                </ul>
              </li>
            </ul>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Retrieves a formatter using the resolution strategy for the
              registered formatter methods (<code>registerFormatterById</code>,{" "}
              <code>registerFormatterByName</code>,{" "}
              <code>registerFormatterByDataPath</code>). The registry
              automatically infers which field property (<code>id</code>,{" "}
              <code>name</code>, or <code>data_path</code>) the <code>id</code>{" "}
              parameter represents by comparing it with the context properties.
              It then only checks formatters registered for that specific field
              property type (e.g., <code>registerFormatterById</code> formatters
              only match when checking the <code>id</code> field).
            </Content>
          </div>

          <Content component={ContentVariants.h3} style={{ marginTop: "32px" }}>
            Utility Methods
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              isActive
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.isActive(): boolean`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Returns <code>true</code> if the registry is active (has a
              provider),
              <code>false</code> if it's a no-op (used outside provider).
            </Content>
          </div>

          <Content component={ContentVariants.h3} style={{ marginTop: "32px" }}>
            Types
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              CellFormatter
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`type CellFormatter = (
  value: string | number | boolean | null | (string | number)[]
) => React.ReactNode | string | number;`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Function type for formatting cell values. Receives the cell value
              and returns a ReactNode, string, or number.
            </Content>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              RowClickHandler
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`type RowClickHandler = (
  event: React.MouseEvent | React.KeyboardEvent,
  rowData: Record<string, string | number | boolean | null>
) => void;`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Function type for handling row click events. Receives the click
              event and the row data object.
            </Content>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              FormatterContext
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`interface FormatterContext {
  fieldId?: string;
  fieldName?: string;
  dataPath?: string;
  inputDataType?: string;
  componentId?: string;
}`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Context object passed to <code>getFormatter</code> to enable
              data-aware formatter selection.
            </Content>
          </div>
        </div>
      </ExpandableSection>
    </ComponentHandlerRegistryProvider>
  );
}
