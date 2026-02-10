/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from "react";

/**
 * Registry for custom Hand Build Components (HBC)
 * Maps component names to React components
 */
const customComponentRegistry: Map<string, ComponentType<any>> = new Map();

/**
 * Registers custom components for Hand Build Component (HBC) support.
 * Can register a single component or multiple components at once.
 *
 * @example Single component:
 * ```tsx
 * import { register } from '@rhngui/patternfly-react-renderer';
 *
 * const MovieDetail = ({ data }) => (
 *   <div>
 *     <h1>{data.movie.title}</h1>
 *     <img src={data.movie.poster} />
 *   </div>
 * );
 *
 * register('movies:movie-detail', MovieDetail);
 * ```
 *
 * @example Multiple components:
 * ```tsx
 * register({
 *   'movies:movie-detail': MovieDetail,
 *   'movies:movie-list': MovieList,
 * });
 * ```
 */
export function register(
  nameOrComponents: string | Record<string, ComponentType<any>>,
  component?: ComponentType<any>
): void {
  if (typeof nameOrComponents === "string") {
    // Single component registration
    if (!component) {
      throw new Error("Component must be provided");
    }
    customComponentRegistry.set(nameOrComponents, component);
  } else {
    // Multiple components registration
    Object.entries(nameOrComponents).forEach(([name, comp]) => {
      if (!name || typeof name !== "string") {
        throw new Error("Component name must be a non-empty string");
      }
      if (!comp) {
        throw new Error(`Component for "${name}" must be provided`);
      }
      customComponentRegistry.set(name, comp);
    });
  }
}

/**
 * Gets a custom component from the registry (internal use)
 */
export function getCustomComponent(
  componentName: string
): ComponentType<any> | undefined {
  return customComponentRegistry.get(componentName);
}
