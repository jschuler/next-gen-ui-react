import VideoPlayerWrapper from "@local-lib/components/VideoPlayerWrapper";
import {
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
} from "@patternfly/react-core";

import { videoDemo, videoDemoAuto, videoDemo4x3 } from "../demo/demoData";

export default function VideoPlayerWrapperPage() {
  return (
    <div>
      <Content component={ContentVariants.h3}>
        YouTube with Poster Image (16:9)
      </Content>
      <VideoPlayerWrapper {...videoDemo} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>{JSON.stringify(videoDemo, null, 2)}</CodeBlockCode>
      </CodeBlock>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h3}>
        Direct Video with Auto Aspect Ratio
      </Content>
      <VideoPlayerWrapper {...videoDemoAuto} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>{JSON.stringify(videoDemoAuto, null, 2)}</CodeBlockCode>
      </CodeBlock>

      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      <Content component={ContentVariants.h3}>Classic 4:3 Format</Content>
      <VideoPlayerWrapper {...videoDemo4x3} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>{JSON.stringify(videoDemo4x3, null, 2)}</CodeBlockCode>
      </CodeBlock>
    </div>
  );
}
