
import DynamicComponents from "@local-lib/components/DynamicComponents";
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
} from "@patternfly/react-core";
import { useParams } from "react-router-dom";

import { getComponentById } from "../config/componentRegistry";

// Map component IDs to their actual React components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, React.ComponentType<any>> = {
  dynamic: DynamicComponents,
  error: ErrorPlaceholder,
  image: ImageComponent,
  onecard: OneCardWrapper,
  setofcards: SetOfCardsWrapper,
  table: TableWrapper,
  video: VideoPlayerWrapper,
};

export default function ComponentDemo() {
  const { componentId } = useParams<{ componentId: string }>();

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
          {componentId === "dynamic" ? (
            <Component config={example.data as Record<string, unknown>} />
          ) : (
            <Component {...(example.data as Record<string, unknown>)} />
          )}

          <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
            Props
          </Content>
          <CodeBlock>
            <CodeBlockCode>{JSON.stringify(example.data, null, 2)}</CodeBlockCode>
          </CodeBlock>
        </div>
      ))}
    </div>
  );
}
