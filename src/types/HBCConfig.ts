/**
 * Component Data for HandBuildComponent rendered by hand-build code registered
 * in the renderer for the given `component` type.
 *
 * Matches the server-side JSON schema:
 * [hand-build-component.schema.json](https://github.com/RedHat-UX/next-gen-ui-agent/blob/main/spec/component/hand-build-component.schema.json)
 *
 * When using DynamicComponent with a registered custom component, pass a config
 * that conforms to this shape (or a superset of it). Config uses snake_case (e.g.
 * input_data_type); the renderer maps these to camelCase when calling your
 * component (e.g. inputDataType).
 */
export interface HBCConfig {
  /** Type of the component to be used in renderer to select hand-build rendering implementation. */
  component: string;
  /** Id of the backend data this component is for. */
  id: string;
  /** JSON backend data to be rendered by the hand-build rendering implementation. */
  data: unknown;
  /**
   * Optional type of the input data. Can be used for frontend customization of the component
   * for concrete data type.
   */
  input_data_type?: string | null;
}
