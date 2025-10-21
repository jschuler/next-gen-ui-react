import {
  PageSidebar,
  PageSidebarBody,
  Nav,
  NavList,
  NavItem,
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
      </NavList>
    </Nav>
  );

  return (
    <PageSidebar>
      <PageSidebarBody>{nav}</PageSidebarBody>
    </PageSidebar>
  );
}
