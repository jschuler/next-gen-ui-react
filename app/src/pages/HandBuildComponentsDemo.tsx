import DynamicComponent from "@local-lib/components/DynamicComponents";
import type { HBCConfig } from "@local-lib/types/HBCConfig";
import { register } from "@local-lib/utils/customComponentRegistry";
import {
  Alert,
  AlertVariant,
  Badge,
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
  ExpandableSection,
  Title,
} from "@patternfly/react-core";

// Example HBC: feature/release highlight card
type FeatureData = {
  title?: string;
  description?: string;
  version?: string;
  date?: string;
};

const FeatureCard = ({ data, id }: { data?: FeatureData; id?: string }) => (
  <div
    style={{
      border: "1px solid var(--pf-v6-global--BorderColor--100)",
      borderRadius: 8,
      padding: 16,
      maxWidth: 400,
      boxShadow: "var(--pf-v6-global--BoxShadow--sm)",
    }}
  >
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
    >
      <Title headingLevel="h3" style={{ margin: 0, flex: 1 }}>
        {data?.title ?? "—"}
      </Title>
      {data?.version && (
        <Badge
          style={{
            backgroundColor: "var(--pf-v6-global--palette--blue-500)",
            color: "#fff",
          }}
        >
          v{data.version}
        </Badge>
      )}
    </div>
    {data?.description && (
      <p
        style={{
          margin: "0 0 8px",
          fontSize: 14,
          color: "var(--pf-v6-global--Color--200)",
        }}
      >
        {data.description}
      </p>
    )}
    {data?.date && (
      <span style={{ fontSize: 12, color: "var(--pf-v6-global--Color--300)" }}>
        {data.date}
      </span>
    )}
    {id && (
      <span
        style={{
          fontSize: 11,
          color: "var(--pf-v6-global--Color--300)",
          marginTop: 8,
          display: "block",
        }}
      >
        id: {id}
      </span>
    )}
  </div>
);

// Example HBC: service/deployment card with status badge and metadata
type ServiceData = {
  title?: string;
  status?: "running" | "degraded" | "stopped";
  items?: Array<{ label: string; value: string }>;
};

const KeyValueList = ({ data }: { data?: ServiceData }) => {
  const statusColors = {
    running: "#3e8635",
    degraded: "#c58c00",
    stopped: "#c9190b",
  };
  const status = data?.status ?? "running";
  const statusColor = statusColors[status] ?? statusColors.running;
  return (
    <div
      style={{
        border: "1px solid var(--pf-v6-global--BorderColor--100)",
        borderRadius: 8,
        padding: 16,
        maxWidth: 360,
        boxShadow: "var(--pf-v6-global--BoxShadow--sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        {data?.title && (
          <Title headingLevel="h4" style={{ margin: 0 }}>
            {data.title}
          </Title>
        )}
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            color: statusColor,
            letterSpacing: "0.05em",
          }}
        >
          {status}
        </span>
      </div>
      <dl style={{ margin: 0 }}>
        {data?.items?.map((item, i) => (
          <div
            key={i}
            style={{
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <dt
              style={{
                fontSize: 13,
                color: "var(--pf-v6-global--Color--200)",
                margin: 0,
              }}
            >
              {item.label}
            </dt>
            <dd style={{ margin: 0, fontWeight: 500, textAlign: "right" }}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

// Example HBC: metric card (label, value, unit, trend)
type MetricData = {
  label?: string;
  value?: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
};

const MetricCard = ({ data }: { data?: MetricData }) => {
  const trendSymbol =
    data?.trend === "up" ? "↑" : data?.trend === "down" ? "↓" : null;
  const trendColor =
    data?.trend === "up"
      ? "var(--pf-v6-global--success-color--100)"
      : data?.trend === "down"
        ? "var(--pf-v6-global--danger-color--100)"
        : "var(--pf-v6-global--Color--200)";
  return (
    <div
      style={{
        border: "1px solid var(--pf-v6-global--BorderColor--100)",
        borderRadius: 8,
        padding: 20,
        minWidth: 160,
        textAlign: "center",
        boxShadow: "var(--pf-v6-global--BoxShadow--sm)",
      }}
    >
      {data?.label && (
        <div
          style={{
            fontSize: 12,
            color: "var(--pf-v6-global--Color--200)",
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {data.label}
        </div>
      )}
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <span>{data?.value ?? "—"}</span>
        {data?.unit && (
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--pf-v6-global--Color--200)",
            }}
          >
            {data.unit}
          </span>
        )}
        {trendSymbol && (
          <span style={{ fontSize: 14, color: trendColor }}>{trendSymbol}</span>
        )}
      </div>
      {data?.subtitle && (
        <div
          style={{
            fontSize: 12,
            color: "var(--pf-v6-global--Color--200)",
            marginTop: 4,
          }}
        >
          {data.subtitle}
        </div>
      )}
    </div>
  );
};

// Register demo HBCs at module load so they exist before first render
register("demo:feature-card", FeatureCard);
register("demo:key-value-list", KeyValueList);
register("demo:metric-card", MetricCard);

const REGISTRATION_SNIPPET = `import DynamicComponent, { register, type HBCConfig } from "@rhngui/patternfly-react-renderer";

const FeatureCard = ({ data, id }) => ( ... );
const KeyValueList = ({ data }) => ( ... );
const MetricCard = ({ data }) => ( ... );

register("demo:feature-card", FeatureCard);
register("demo:key-value-list", KeyValueList);
register("demo:metric-card", MetricCard);

// Example 1: feature card
const featureConfig: HBCConfig = {
  component: "demo:feature-card",
  id: "release-1",
  data: { title: "Hand Build Components", version: "1.0", description: "Register custom React components and render them via DynamicComponent.", date: "2025-02-06" },
};
<DynamicComponent config={featureConfig} />

// Example 2: service card
const serviceConfig: HBCConfig = {
  component: "demo:key-value-list",
  id: "api-gateway",
  data: { title: "api-gateway", status: "running", items: [{ label: "Version", value: "2.4.1" }, { label: "Region", value: "us-east-1" }] },
};
<DynamicComponent config={serviceConfig} />

// Example 3: metric card
const metricConfig: HBCConfig = {
  component: "demo:metric-card",
  id: "users",
  data: { label: "Active users", value: "12.4k", unit: "", trend: "up", subtitle: "vs last 30 days" },
};
<DynamicComponent config={metricConfig} />`;

export default function HandBuildComponentsDemo() {
  const example1Config: HBCConfig & Record<string, unknown> = {
    id: "release-1",
    component: "demo:feature-card",
    data: {
      title: "Hand Build Components",
      version: "1.0",
      description:
        "Register custom React components and render them through DynamicComponent using config from the Next Gen UI Agent or any JSON config.",
      date: "2025-02-06",
    },
  };

  const example3Config: HBCConfig & Record<string, unknown> = {
    id: "service-api",
    component: "demo:key-value-list",
    data: {
      title: "api-gateway",
      status: "running",
      items: [
        { label: "Version", value: "2.4.1" },
        { label: "Region", value: "us-east-1" },
        { label: "Uptime", value: "42d 14h" },
        { label: "Replicas", value: "3" },
      ],
    },
  };

  const example4Config: HBCConfig & Record<string, unknown> = {
    id: "service-degraded",
    component: "demo:key-value-list",
    data: {
      title: "payment-service",
      status: "degraded",
      items: [
        { label: "Version", value: "1.9.0" },
        { label: "Region", value: "eu-west-1" },
        { label: "Uptime", value: "7d 2h" },
        { label: "Replicas", value: "2" },
      ],
    },
  };

  const example5Configs: (HBCConfig & Record<string, unknown>)[] = [
    {
      id: "metric-1",
      component: "demo:metric-card",
      data: {
        label: "Active users",
        value: "12.4k",
        unit: "",
        trend: "up" as const,
        subtitle: "vs last 30 days",
      },
    },
    {
      id: "metric-2",
      component: "demo:metric-card",
      data: {
        label: "Error rate",
        value: "0.2",
        unit: "%",
        trend: "down" as const,
        subtitle: "target < 0.5%",
      },
    },
    {
      id: "metric-3",
      component: "demo:metric-card",
      data: {
        label: "Avg latency",
        value: "84",
        unit: "ms",
        trend: "neutral" as const,
        subtitle: "p99",
      },
    },
  ];

  return (
    <div>
      <Alert
        variant={AlertVariant.info}
        isInline
        title="Hand Build Components (HBC)"
        style={{ marginBottom: 24 }}
      >
        <p>
          Hand Build Components let you register custom React components and
          render them through <strong>DynamicComponent</strong> using config
          from the Next Gen UI Agent (or any JSON config). The config shape is
          typed as <code>HBCConfig</code> (component, id, data,
          input_data_type). The <code>component</code> value must match the name
          you passed to <code>register()</code>; the structure of the{" "}
          <code>data</code> payload is defined by your app or the agent.
        </p>
        <p style={{ marginTop: 8, marginBottom: 0 }}>
          <a
            href="https://redhat-ux.github.io/next-gen-ui-agent/spec/component/#hand-build-component-aka-hbc"
            target="_blank"
            rel="noopener noreferrer"
          >
            HBC specification
          </a>
        </p>
      </Alert>

      <Content component={ContentVariants.h2}>Registration code</Content>
      <p style={{ marginBottom: 16 }}>
        These demos register three custom components at load time:
      </p>
      <CodeBlock>
        <CodeBlockCode>{REGISTRATION_SNIPPET}</CodeBlockCode>
      </CodeBlock>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h2}>Feature card</Content>
      <p style={{ marginBottom: 16 }}>
        <code>demo:feature-card</code> with <code>data</code>: title, version
        badge, description, and date.
      </p>
      <DynamicComponent config={example1Config} />
      <ExpandableSection toggleText="Config JSON" style={{ marginTop: 16 }}>
        <CodeBlock>
          <CodeBlockCode>
            {JSON.stringify(example1Config, null, 2)}
          </CodeBlockCode>
        </CodeBlock>
      </ExpandableSection>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h2}>
        Service / deployment cards
      </Content>
      <p style={{ marginBottom: 16 }}>
        <code>demo:key-value-list</code> with <code>status</code> and metadata.
        Same component, different data (running vs degraded).
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        <DynamicComponent config={example3Config} />
        <DynamicComponent config={example4Config} />
      </div>
      <ExpandableSection
        toggleText="Config JSON (first card)"
        style={{ marginTop: 16 }}
      >
        <CodeBlock>
          <CodeBlockCode>
            {JSON.stringify(example3Config, null, 2)}
          </CodeBlockCode>
        </CodeBlock>
      </ExpandableSection>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h2}>
        Metric cards (dashboard-style)
      </Content>
      <p style={{ marginBottom: 16 }}>
        <code>demo:metric-card</code> with label, value, unit, trend
        (up/down/neutral), and optional subtitle. Multiple instances from one
        component type.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {example5Configs.map((cfg) => (
          <DynamicComponent key={cfg.id} config={cfg} />
        ))}
      </div>
      <ExpandableSection
        toggleText="Config JSON (first metric)"
        style={{ marginTop: 16 }}
      >
        <CodeBlock>
          <CodeBlockCode>
            {JSON.stringify(example5Configs[0], null, 2)}
          </CodeBlockCode>
        </CodeBlock>
      </ExpandableSection>
    </div>
  );
}
