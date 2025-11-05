import React from "react";
import ReactDOM from "react-dom/client";

import DynamicComponent from "../../components/DynamicComponents";
import "../../global.css";

interface ComponentConfig {
  component: string;
  key: string;
  props: Record<string, unknown>;
}

// Base class for all web components
abstract class RHNGUIElement extends HTMLElement {
  protected root: ReactDOM.Root | null = null;
  protected mountPoint: HTMLDivElement | null = null;

  connectedCallback() {
    // Create mount point and append directly (no Shadow DOM)
    // This allows PatternFly styles from the main document to apply
    this.mountPoint = document.createElement("div");
    this.appendChild(this.mountPoint);

    // Create React root and render
    this.root = ReactDOM.createRoot(this.mountPoint);
    this.render();
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  attributeChangedCallback() {
    if (this.root) {
      this.render();
    }
  }

  protected abstract getComponentConfig(): ComponentConfig;

  protected render() {
    if (this.root) {
      const config = this.getComponentConfig();
      this.root.render(
        <React.StrictMode>
          <DynamicComponent config={config} />
        </React.StrictMode>
      );
    }
  }

  protected parseJsonAttribute(
    attrName: string,
    defaultValue: unknown = null
  ): unknown {
    const attr = this.getAttribute(attrName);
    if (!attr) return defaultValue;
    try {
      return JSON.parse(attr);
    } catch (e) {
      console.error(`Failed to parse ${attrName} attribute:`, e);
      return defaultValue;
    }
  }
}

// Chart Component
class RHNGUIChart extends RHNGUIElement {
  static get observedAttributes() {
    return [
      "data",
      "chart-type",
      "title",
      "width",
      "height",
      "scale",
      "theme-color",
      "legend-position",
    ];
  }

  protected getComponentConfig(): ComponentConfig {
    return {
      component: "chart",
      key: "web-component-chart",
      props: {
        id: this.getAttribute("id") || "chart",
        title: this.getAttribute("title") || undefined,
        chartType: this.getAttribute("chart-type") || "bar",
        data: this.parseJsonAttribute("data", []),
        width: parseInt(this.getAttribute("width") || "600"),
        height: parseInt(this.getAttribute("height") || "400"),
        scale: parseFloat(this.getAttribute("scale") || "1"),
        themeColor: this.getAttribute("theme-color") || "multi",
        legendPosition: this.getAttribute("legend-position") || "bottom",
      },
    };
  }
}

// Table Component
class RHNGUITable extends RHNGUIElement {
  static get observedAttributes() {
    return ["fields", "title"];
  }

  protected getComponentConfig(): ComponentConfig {
    return {
      component: "table",
      key: "web-component-table",
      props: {
        id: this.getAttribute("id") || "table",
        title: this.getAttribute("title") || undefined,
        fields: this.parseJsonAttribute("fields", []),
      },
    };
  }
}

// Image Component
class RHNGUIImage extends RHNGUIElement {
  static get observedAttributes() {
    return ["image", "title"];
  }

  protected getComponentConfig(): ComponentConfig {
    return {
      component: "image",
      key: "web-component-image",
      props: {
        id: this.getAttribute("id") || "image",
        image: this.getAttribute("image") || "",
        title: this.getAttribute("title") || undefined,
      },
    };
  }
}

// One Card Component
class RHNGUICard extends RHNGUIElement {
  static get observedAttributes() {
    return ["fields", "title", "image", "image-size"];
  }

  protected getComponentConfig(): ComponentConfig {
    return {
      component: "one-card",
      key: "web-component-card",
      props: {
        id: this.getAttribute("id") || "card",
        title: this.getAttribute("title") || undefined,
        image: this.getAttribute("image") || undefined,
        imageSize: this.getAttribute("image-size") || "md",
        fields: this.parseJsonAttribute("fields", []),
      },
    };
  }
}

// Auto-register when loaded
if (typeof window !== "undefined" && "customElements" in window) {
  customElements.define("rhngui-chart", RHNGUIChart);
  customElements.define("rhngui-table", RHNGUITable);
  customElements.define("rhngui-image", RHNGUIImage);
  customElements.define("rhngui-card", RHNGUICard);
}

export { RHNGUIChart, RHNGUITable, RHNGUIImage, RHNGUICard };
