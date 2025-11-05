import {
  Page,
  PageSection,
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  MastheadToggle,
  PageToggleButton,
  Content,
  ContentVariants,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { CodeIcon, GithubIcon } from "@patternfly/react-icons";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { getComponentByPath } from "./config/componentRegistry";
import Sidebar from "./layout/Sidebar";
import ComponentDemo from "./pages/ComponentDemo";
import Home from "./pages/Home";
import StandaloneExample from "./pages/StandaloneExample";
import WebComponentsExample from "./pages/WebComponentsExample";

function AppContent() {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/examples/standalone")
      return "Standalone Bundle Example";
    if (location.pathname === "/examples/webcomponents")
      return "Web Components Example";
    const component = getComponentByPath(location.pathname);
    return component?.name || "Home";
  };

  const getSourceCodeUrl = () => {
    const component = getComponentByPath(location.pathname);
    return component?.sourceUrl;
  };

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton isHamburgerButton aria-label="Global navigation" />
        </MastheadToggle>
        <MastheadBrand>
          <div style={{ paddingLeft: 8, paddingTop: 3 }}>
            <Content component={ContentVariants.h1}>
              Next Gen UI - Component Demo
            </Content>
          </div>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar id="toolbar" isStatic>
          <ToolbarContent>
            <ToolbarGroup
              variant="action-group-plain"
              align={{ default: "alignEnd" }}
              gap={{ default: "gapNone", md: "gapMd" }}
            >
              <ToolbarItem>
                <Button
                  variant="plain"
                  component="a"
                  href="https://github.com/RedHat-UX/next-gen-ui-react"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub"
                >
                  <GithubIcon />
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );

  const mainContainerId = "main-content";

  return (
    <Page
      masthead={masthead}
      sidebar={<Sidebar />}
      mainContainerId={mainContainerId}
      isManagedSidebar
      defaultManagedSidebarIsOpen
      additionalGroupedContent={
        <PageSection isWidthLimited aria-labelledby="main-title">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              minHeight: "48px",
            }}
          >
            <Content
              component={ContentVariants.h1}
              id="main-title"
              style={{ margin: 0 }}
            >
              {getPageTitle()}
            </Content>
            {getSourceCodeUrl() && (
              <Button
                component="a"
                href={getSourceCodeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                variant="link"
                icon={<CodeIcon />}
              >
                View Source
              </Button>
            )}
          </div>
        </PageSection>
      }
    >
      <PageSection aria-label="Main">
        <div id={mainContainerId} tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/component/:componentId" element={<ComponentDemo />} />
            <Route
              path="/examples/standalone"
              element={<StandaloneExample />}
            />
            <Route
              path="/examples/webcomponents"
              element={<WebComponentsExample />}
            />
          </Routes>
        </div>
      </PageSection>
    </Page>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <AppContent />
    </BrowserRouter>
  );
}
