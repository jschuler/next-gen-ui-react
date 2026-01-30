/**
 * When true, enables console logging from the registry and wrapper components.
 *
 * To enable: set window.__REGISTRY_DEBUG__ = true in the browser console (no reload needed—
 * logs will appear for the next actions), or set it in your app entry before rendering so
 * it's on after every reload.
 */

function isRegistryDebugEnabled(): boolean {
  return (
    typeof window !== "undefined" &&
    (window as unknown as { __REGISTRY_DEBUG__?: boolean })
      .__REGISTRY_DEBUG__ === true
  );
}

export function debugLog(...args: unknown[]): void {
  if (isRegistryDebugEnabled()) {
    console.log(...args);
  }
}

export function debugWarn(...args: unknown[]): void {
  if (isRegistryDebugEnabled()) {
    console.warn(...args);
  }
}
