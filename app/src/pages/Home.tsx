import { Content, ContentVariants } from "@patternfly/react-core";
import { Link } from "react-router-dom";

import { componentRegistry } from "../config/componentRegistry";

export default function Home() {
  return (
    <div>
      <Content component={ContentVariants.h2}>Welcome</Content>
      <p>
        Select a component from the sidebar or use the links below to open a
        demo:
      </p>
      <ul>
        {componentRegistry.map((component) => (
          <li key={component.id}>
            <Link to={component.path}>{component.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
