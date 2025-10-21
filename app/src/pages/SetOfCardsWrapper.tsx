import SetOfCardsWrapper from "@local-lib/components/SetOfCardsWrapper";
import {
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
} from "@patternfly/react-core";

import { setOfCardsDemo, setOfCardsDemoTwoCards } from "../demo/demoData";

export default function SetOfCardsWrapperPage() {
  return (
    <div>
      <Content component={ContentVariants.h3}>Three Cards</Content>
      <SetOfCardsWrapper {...setOfCardsDemo} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>{JSON.stringify(setOfCardsDemo, null, 2)}</CodeBlockCode>
      </CodeBlock>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h3}>Two Cards</Content>
      <SetOfCardsWrapper {...setOfCardsDemoTwoCards} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>
          {JSON.stringify(setOfCardsDemoTwoCards, null, 2)}
        </CodeBlockCode>
      </CodeBlock>
    </div>
  );
}
