import ErrorPlaceholder from "@local-lib/components/ErrorPlaceholder";
import {
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
} from "@patternfly/react-core";

const demoNoContent = {
  hasError: false,
  noContentMessage: "No demo content",
};

const demoError = {
  hasError: true,
  errorMessage: "Demo error",
};

export default function ErrorPlaceholderPage() {
  return (
    <div>
      <Content component={ContentVariants.h3}>No content example</Content>
      <ErrorPlaceholder {...demoNoContent} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>{JSON.stringify(demoNoContent, null, 2)}</CodeBlockCode>
      </CodeBlock>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h3}>Error example</Content>
      <ErrorPlaceholder {...demoError} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>{JSON.stringify(demoError, null, 2)}</CodeBlockCode>
      </CodeBlock>
    </div>
  );
}
