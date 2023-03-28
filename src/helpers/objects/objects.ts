export function formatEnumToStatusDict(enumParam: Record<string, string>) {
  return Object.keys(enumParam).map((key) => ({
    name: enumParam[`${key}`],
    description: enumParam[`${key}`],
  }));
}

/* https://youmightnotneed.com/lodash/#get */
export const get = <T = any>(
  obj: Record<string, any>,
  path: string | Array<string | number>,
  defaultValue?: any
): T | undefined => {
  // If path is not defined or it has false value
  if (!path) return undefined;
  // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
  // Regex explained: https://regexr.com/58j0k
  const pathArray = (
    Array.isArray(path) ? path : path.match(/([^[.\]])+/g)
  ) as Array<string>;
  // Find value
  const result = pathArray.reduce(
    (prevObj: Record<string, any>, key: string) => prevObj && prevObj[key],
    obj
  );
  // If found value is undefined return default value; otherwise return the value
  return result === undefined ? defaultValue : result;
};

export function deleteUndefinedValuesFromObject(
  params: Record<string | number, unknown>
) {
  const copyOfParams = { ...params };
  Object.keys(copyOfParams).forEach((field) => {
    if (copyOfParams[field as keyof typeof params] === undefined) {
      // delete is slow to process, so we need to use WISELY
      delete copyOfParams[field as keyof typeof params];
    }
  });

  return copyOfParams;
}
