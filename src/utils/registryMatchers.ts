/**
 * Pure helpers for formatter registry matcher logic. Used by ComponentHandlerRegistry.
 */

export function matchesContextValue(
  value: string | undefined,
  matcher: string | RegExp
): boolean {
  if (value === undefined) return false;
  if (typeof matcher === "string") return value === matcher;
  return matcher.test(value);
}

/** Shape compatible with FormatterContextMatcher (id/name/dataPath). */
export function formatterContextMatchersEqual(
  a: {
    id?: string | RegExp;
    name?: string | RegExp;
    dataPath?: string | RegExp;
  },
  b: {
    id?: string | RegExp;
    name?: string | RegExp;
    dataPath?: string | RegExp;
  }
): boolean {
  const keys = ["id", "name", "dataPath"] as const;
  for (const key of keys) {
    const av = a[key];
    const bv = b[key];
    if (av === undefined && bv === undefined) continue;
    if (av === undefined || bv === undefined) return false;
    if (typeof av === "string" || typeof bv === "string") {
      if (av !== bv) return false;
    } else {
      if (av.source !== bv.source || av.flags !== bv.flags) return false;
    }
  }
  return true;
}

export function inputDataTypeMatches(
  a: string | RegExp | undefined,
  b: string | RegExp | undefined
): boolean {
  if (a === undefined && b === undefined) return true;
  if (a === undefined || b === undefined) return false;
  if (typeof a === "string" && typeof b === "string") return a === b;
  if (a instanceof RegExp && b instanceof RegExp)
    return a.source === b.source && a.flags === b.flags;
  return false;
}
