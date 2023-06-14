/**
 * Same as `Object.assign()`, but only assigns defined values.
 * @param target
 * @param source
 */
export function assignDefined<T>(target: T, source: Partial<T>): T {
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val !== undefined) {
      target[key] = val;
    }
  }
  return target;
}
