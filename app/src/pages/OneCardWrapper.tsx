import OneCardWrapper from "@local-lib/components/OneCardWrapper";
import {
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
} from "@patternfly/react-core";

import {
  oneCardDemo,
  oneCardDemoNoImage,
  oneCardDemoSmallImage,
} from "../demo/demoData";

export default function OneCardWrapperPage() {
  return (
    <div>
      <Content component={ContentVariants.h3}>With Medium Image</Content>
      <OneCardWrapper {...oneCardDemo} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>{JSON.stringify(oneCardDemo, null, 2)}</CodeBlockCode>
      </CodeBlock>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h3}>Without Image</Content>
      <OneCardWrapper {...oneCardDemoNoImage} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>
          {JSON.stringify(oneCardDemoNoImage, null, 2)}
        </CodeBlockCode>
      </CodeBlock>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h3}>With Small Image</Content>
      <OneCardWrapper {...oneCardDemoSmallImage} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>
          {JSON.stringify(oneCardDemoSmallImage, null, 2)}
        </CodeBlockCode>
      </CodeBlock>
    </div>
  );
}
