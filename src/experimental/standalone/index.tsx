import React from "react";
import ReactDOM from "react-dom/client";

import DynamicComponent from "../../components/DynamicComponents";
import "../../global.css";

export interface ComponentConfig {
  component: string;
  key: string;
  props: Record<string, unknown>;
}

interface MountedComponent {
  unmount: () => void;
  update: (newProps: ComponentConfig) => void;
}

interface MountedMultipleComponents {
  unmount: () => void;
  update: (newProps: ComponentConfig[]) => void;
}

class RHNGUIRenderer {
  private mountedComponents: Map<string, ReactDOM.Root> = new Map();

  /**
   * Render a component into a container element
   * @param containerId - The ID of the DOM element to render into
   * @param componentConfig - The component configuration
   * @returns Object with unmount and update methods
   */
  render(
    containerId: string,
    componentConfig: ComponentConfig
  ): MountedComponent {
    const container = document.getElementById(containerId);

    if (!container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }

    // Create or reuse root
    let root = this.mountedComponents.get(containerId);
    if (!root) {
      root = ReactDOM.createRoot(container);
      this.mountedComponents.set(containerId, root);
    }

    // Render the component
    root.render(
      <React.StrictMode>
        <DynamicComponent config={componentConfig} />
      </React.StrictMode>
    );

    return {
      unmount: () => this.unmount(containerId),
      update: (newProps: ComponentConfig) => this.render(containerId, newProps),
    };
  }

  /**
   * Render multiple components
   * @param containerId - The ID of the DOM element to render into
   * @param components - Array of component configurations
   */
  renderMultiple(
    containerId: string,
    components: ComponentConfig[]
  ): MountedMultipleComponents {
    const container = document.getElementById(containerId);

    if (!container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }

    let root = this.mountedComponents.get(containerId);
    if (!root) {
      root = ReactDOM.createRoot(container);
      this.mountedComponents.set(containerId, root);
    }

    root.render(
      <React.StrictMode>
        <>
          {components.map((config, index) => (
            <DynamicComponent key={config.key || index} config={config} />
          ))}
        </>
      </React.StrictMode>
    );

    return {
      unmount: () => this.unmount(containerId),
      update: (newComponents: ComponentConfig[]) =>
        this.renderMultiple(containerId, newComponents),
    };
  }

  /**
   * Unmount a component from its container
   * @param containerId - The ID of the container to unmount from
   */
  unmount(containerId: string): void {
    const root = this.mountedComponents.get(containerId);
    if (root) {
      root.unmount();
      this.mountedComponents.delete(containerId);
    }
  }

  /**
   * Unmount all components
   */
  unmountAll(): void {
    this.mountedComponents.forEach((root) => root.unmount());
    this.mountedComponents.clear();
  }
}

// Create global instance
const renderer = new RHNGUIRenderer();

// Expose to window for use in non-module scripts
declare global {
  interface Window {
    RHNGUIRenderer: RHNGUIRenderer;
  }
}

if (typeof window !== "undefined") {
  window.RHNGUIRenderer = renderer;
}

export default renderer;
