import TableWrapper from "@local-lib/components/TableWrapper";
import {
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
} from "@patternfly/react-core";

import { tableDemo, tableDemoComplexData } from "../demo/demoData";

export default function TableWrapperPage() {
  return (
    <div>
      <Content component={ContentVariants.h3}>Simple Table</Content>
      <TableWrapper {...tableDemo} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>{JSON.stringify(tableDemo, null, 2)}</CodeBlockCode>
      </CodeBlock>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h3}>Complex Data Types</Content>
      <TableWrapper {...tableDemoComplexData} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>
          {JSON.stringify(tableDemoComplexData, null, 2)}
        </CodeBlockCode>
      </CodeBlock>
    </div>
  );
}
