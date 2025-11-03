import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
// PatternFly React base styles
import "@patternfly/react-core/dist/styles/base.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
