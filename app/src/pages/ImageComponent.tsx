import ImageComponent from "@local-lib/components/ImageComponent";
import {
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
} from "@patternfly/react-core";

import { imageDemo, imageDemoLarge } from "../demo/demoData";

export default function ImageComponentPage() {
  return (
    <div>
      <Content component={ContentVariants.h3}>Standard Image</Content>
      <ImageComponent {...imageDemo} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>{JSON.stringify(imageDemo, null, 2)}</CodeBlockCode>
      </CodeBlock>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h3}>Large Image</Content>
      <ImageComponent {...imageDemoLarge} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>{JSON.stringify(imageDemoLarge, null, 2)}</CodeBlockCode>
      </CodeBlock>
    </div>
  );
}
