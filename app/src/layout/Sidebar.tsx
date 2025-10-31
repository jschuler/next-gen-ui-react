import {
  PageSidebar,
  PageSidebarBody,
  Nav,
  NavList,
  NavItem,
  NavExpandable,
} from "@patternfly/react-core";
import { Link } from "react-router-dom";

import { componentRegistry } from "../config/componentRegistry";

export default function Sidebar() {
  const nav = (
    <Nav aria-label="Main navigation">
      <NavList>
        <NavItem itemId={0}>
          <Link to="/">Home</Link>
        </NavItem>
        {componentRegistry.map((component, index) => (
          <NavItem key={component.id} itemId={index + 1}>
            <Link to={component.path}>{component.name}</Link>
          </NavItem>
        ))}
        <NavExpandable
          title="Non-React Integration"
          groupId="integration-examples"
        >
          <NavItem itemId="standalone-example">
            <Link to="/examples/standalone">Standalone Bundle</Link>
          </NavItem>
          <NavItem itemId="webcomponents-example">
            <Link to="/examples/webcomponents">Web Components</Link>
          </NavItem>
        </NavExpandable>
      </NavList>
    </Nav>
  );

  return (
    <PageSidebar>
      <PageSidebarBody>{nav}</PageSidebarBody>
    </PageSidebar>
  );
}
