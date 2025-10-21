import DynamicComponents from "@local-lib/components/DynamicComponents";
import {
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
} from "@patternfly/react-core";

import {
  dynamicDemo,
  dynamicDemoImage,
  dynamicDemoTable,
} from "../demo/demoData";

export default function DynamicComponentsPage() {
  return (
    <div>
      <Content component={ContentVariants.h3}>One Card Component</Content>
      <DynamicComponents config={dynamicDemo} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>{JSON.stringify(dynamicDemo, null, 2)}</CodeBlockCode>
      </CodeBlock>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h3}>Image Component</Content>
      <DynamicComponents config={dynamicDemoImage} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>
          {JSON.stringify(dynamicDemoImage, null, 2)}
        </CodeBlockCode>
      </CodeBlock>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h3}>Table Component</Content>
      <DynamicComponents config={dynamicDemoTable} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>
          {JSON.stringify(dynamicDemoTable, null, 2)}
        </CodeBlockCode>
      </CodeBlock>
    </div>
  );
}
