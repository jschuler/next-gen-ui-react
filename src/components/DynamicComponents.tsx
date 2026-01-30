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
import { debugWarn } from "../utils/debug";

// Type for component configuration
export interface ComponentConfig {
  component?: string;
  key?: string;
  props?: Record<string, unknown>;
  children?: ComponentConfig[] | ReactElement;
  [key: string]: unknown;
}

// Type for custom props values
type CustomPropValue = unknown | ((...args: unknown[]) => void) | ReactElement;

export interface DynamicComponentProps {
  config: ComponentConfig;
  customProps?: Record<string, Record<string, CustomPropValue>>;
}

const DynamicComponent = ({
  config,
  customProps = {},
}: DynamicComponentProps) => {
  const [customData, setCustomData] = useState(null);

  if (!config || Object.keys(config).length === 0) {
    console.error("Config is empty");
    return null;
  }

  const componentKey = config?.key || config?.component;

  const parseProps = (props?: Record<string, unknown>) => {
    const newProps: Record<string, unknown> = { ...props };

    // Map snake_case props from JSON to camelCase props expected by components
    if (newProps.input_data_type !== undefined) {
      newProps.inputDataType = newProps.input_data_type;
      delete newProps.input_data_type;
    }
    if (newProps.on_row_click !== undefined && newProps.on_row_click !== null) {
      newProps.onRowClick = newProps.on_row_click;
      delete newProps.on_row_click;
    }

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
          const elementWithProps = value as ReactElement<{
            onClick?: (event: MouseEvent, context?: unknown) => void;
          }>;
          newProps[key] = cloneElement(elementWithProps, {
            onClick: (event: MouseEvent) =>
              (
                elementWithProps.props as {
                  onClick?: (event: MouseEvent, context?: unknown) => void;
                }
              ).onClick?.(event, {
                componentKey,
                // config,
                customData,
              }),
          } as Partial<{ onClick: (event: MouseEvent) => void }>);
        } else if (Array.isArray(value) && value.every(isValidElement)) {
          newProps[key] = value.map((element) => {
            const elementWithProps = element as ReactElement<{
              onClick?: (event: MouseEvent, context?: unknown) => void;
            }>;
            return cloneElement(elementWithProps, {
              onClick: (event: MouseEvent) =>
                (
                  elementWithProps.props as {
                    onClick?: (event: MouseEvent, context?: unknown) => void;
                  }
                ).onClick?.(event, {
                  componentKey,
                  // config,
                  customData,
                }),
            } as Partial<{ onClick: (event: MouseEvent) => void }>);
          });
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
  const Component =
    componentsMap[config?.component as keyof typeof componentsMap];

  if (!Component) {
    // Return null for unknown components instead of throwing an error
    debugWarn(
      `Component "${config?.component}" is not available in the React package. Available components: ${Object.keys(componentsMap).join(", ")}`
    );
    return null;
  }

  const newProps = parseProps(config?.props || config);

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
