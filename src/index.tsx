import DynamicComponent from "./components/DynamicComponents";
export default DynamicComponent;

// API for registering custom components (HBC)
export { register } from "./utils/customComponentRegistry";

// Export HBCConfig type for TypeScript consumers
export type { HBCConfig } from "./types/HBCConfig";
