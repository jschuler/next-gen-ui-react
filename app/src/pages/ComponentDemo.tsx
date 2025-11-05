import DynamicComponents from "@local-lib/components/DynamicComponents";
import EmptyStateWrapper from "@local-lib/components/EmptyStateWrapper";
import ErrorPlaceholder from "@local-lib/components/ErrorPlaceholder";
import ImageComponent from "@local-lib/components/ImageComponent";
import OneCardWrapper from "@local-lib/components/OneCardWrapper";
import SetOfCardsWrapper from "@local-lib/components/SetOfCardsWrapper";
import TableWrapper from "@local-lib/components/TableWrapper";
import VideoPlayerWrapper from "@local-lib/components/VideoPlayerWrapper";
import {
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
  ExpandableSection,
} from "@patternfly/react-core";
import { lazy, Suspense, useState } from "react";
import { useParams } from "react-router-dom";

import { getComponentById } from "../config/componentRegistry";

// Lazy load ChartComponent for code-splitting
const ChartComponent = lazy(
  () => import("@local-lib/components/ChartComponent")
);

// Map component IDs to their actual React components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, React.ComponentType<any>> = {
  chart: ChartComponent,
  dynamic: DynamicComponents,
  emptystate: EmptyStateWrapper,
  error: ErrorPlaceholder,
  image: ImageComponent,
  onecard: OneCardWrapper,
  setofcards: SetOfCardsWrapper,
  table: TableWrapper,
  video: VideoPlayerWrapper,
};

export default function ComponentDemo() {
  const { componentId } = useParams<{ componentId: string }>();
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});

  if (!componentId) {
    return <div>Component not found</div>;
  }

  const config = getComponentById(componentId);

  if (!config) {
    return (
      <div>
        <Content component={ContentVariants.h3}>Component not found</Content>
        <p>The component "{componentId}" does not exist in the registry.</p>
      </div>
    );
  }

  const Component = componentMap[componentId];

  if (!Component) {
    return (
      <div>
        <Content component={ContentVariants.h3}>Component not mapped</Content>
        <p>
          The component "{componentId}" exists in the registry but is not mapped
          in ComponentDemo.tsx.
        </p>
      </div>
    );
  }

  return (
    <div>
      {config.examples.map((example, index) => (
        <div key={index}>
          {index > 0 && <Divider style={{ marginTop: 32, marginBottom: 32 }} />}

          <Content component={ContentVariants.h3}>{example.title}</Content>

          {/* Render the component with its data */}
          <Suspense fallback={<div>Loading component...</div>}>
            <div
              style={
                componentId === "chart"
                  ? { maxWidth: "900px", overflow: "visible" }
                  : undefined
              }
            >
              {componentId === "dynamic" ? (
                <Component config={example.data as Record<string, unknown>} />
              ) : (
                <Component {...(example.data as Record<string, unknown>)} />
              )}
            </div>
          </Suspense>

          <ExpandableSection
            toggleText="Configuration"
            isExpanded={expandedSections[index] || false}
            onToggle={() =>
              setExpandedSections((prev) => ({
                ...prev,
                [index]: !prev[index],
              }))
            }
            style={{ marginTop: 16 }}
          >
            <CodeBlock>
              <CodeBlockCode>
                {JSON.stringify(example.data, null, 2)}
              </CodeBlockCode>
            </CodeBlock>
          </ExpandableSection>
        </div>
      ))}
    </div>
  );
}
