/* eslint-disable @typescript-eslint/no-explicit-any */
// Import minimal PatternFly CSS (no-reset version is smaller)
import "@patternfly/react-core/dist/styles/base-no-reset.css";
import "../global.css";

import {
  cloneElement,
  isValidElement,
  useState,
  ReactElement,
  MouseEvent,
} from "react";

import { componentsMap } from "../constants/componentsMap";
import { getCustomComponent } from "../utils/customComponentRegistry";

// Type for component configuration
interface ComponentConfig {
  component?: string;
  key?: string;
  props?: Record<string, unknown>;
  children?: ComponentConfig[] | ReactElement;
  [key: string]: unknown;
}

// Type for custom props values
type CustomPropValue = unknown | ((...args: unknown[]) => void) | ReactElement;

interface IProps {
  config: ComponentConfig;
  customProps?: Record<string, Record<string, CustomPropValue>>;
}

const DynamicComponent = ({ config, customProps = {} }: IProps) => {
  const [customData, setCustomData] = useState(null);

  if (!config || Object.keys(config).length === 0) {
    console.error("Config is empty");
    return null;
  }

  const componentKey = config?.key || config?.component;

  const parseProps = (props?: Record<string, unknown>) => {
    const newProps: Record<string, unknown> = { ...props };

    if (componentKey && customProps[componentKey]) {
      Object.entries(customProps[componentKey]).forEach(([key, value]) => {
        if (typeof value === "function") {
          newProps[key] = (...args: unknown[]) =>
            value(...args, {
              componentKey,
              // config,
              customData,
            });
        } else if (isValidElement(value)) {
          newProps[key] = cloneElement(value, {
            onClick: (event: MouseEvent) =>
              value.props.onClick?.(event, {
                componentKey,
                // config,
                customData,
              }),
          });
        } else if (Array.isArray(value) && value.every(isValidElement)) {
          newProps[key] = value.map((element) =>
            cloneElement(element, {
              onClick: (event: MouseEvent) =>
                element.props.onClick?.(event, {
                  componentKey,
                  // config,
                  customData,
                }),
            })
          );
        } else {
          newProps[key] = value;
        }
      });
    }

    newProps.customProps = customProps;
    newProps.setCustomData = setCustomData;

    if (Array.isArray(newProps.actions)) {
      newProps.actions = newProps.actions.map((action) => ({
        ...action,
        onClick:
          typeof action.onClick === "string"
            ? new Function("event", action.onClick)
            : action.onClick,
      }));
    }

    if (typeof newProps.onRowSelect === "string") {
      newProps.onRowSelect = new Function("data", newProps.onRowSelect);
    }

    return newProps;
  };

  // Check if component exists in componentsMap
  let Component =
    componentsMap[config?.component as keyof typeof componentsMap];

  // If not found in standard components, check custom component registry (HBC)
  if (!Component) {
    Component = getCustomComponent(config?.component as string);

    if (!Component) {
      // Return null for unknown components instead of throwing an error
      console.warn(
        `Component "${config?.component}" is not available in the React package or registered as a custom component. Available components: ${Object.keys(componentsMap).join(", ")}`
      );
      return null;
    }
  }

  // For HBC (Hand Build Components), pass the data field as props
  // Standard components use props or the entire config
  const isCustomComponent =
    !componentsMap[config?.component as keyof typeof componentsMap];
  let propsToParse: Record<string, unknown>;

  if (isCustomComponent && config?.data !== undefined) {
    // For HBC: pass data, input_data_type, and other config fields (like id) as props
    propsToParse = {
      ...config,
      data: config.data,
      input_data_type: config.input_data_type,
    };
  } else {
    // For standard components: use props or the entire config
    propsToParse = config?.props || config;
  }

  const newProps = parseProps(propsToParse);

  const ComponentToRender = Component as React.ComponentType<any>;

  return (
    <ComponentToRender {...newProps}>
      {Array.isArray(config?.children)
        ? config?.children.map((child: any, index: number) => (
            <DynamicComponent
              config={child}
              key={(child.key || child.component || index) + index}
              customProps={customProps}
            />
          ))
        : config?.children}
    </ComponentToRender>
  );
};

export default DynamicComponent;
