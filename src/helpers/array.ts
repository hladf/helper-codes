// both eslint-disable below are NECESSARY for the generic function of order array
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable security/detect-object-injection */

import { get } from './objects';

export function orderArrayByKey<T = any[]>(
  array: T,
  key?: string,
  order: 'asc' | 'desc' = 'asc'
): T {
  if (!Array.isArray(array)) {
    return array;
  }

  if (!key) {
    return array.sort((first, second) => {
      const isObject = typeof first === 'object' || typeof second === 'object';
      if (isObject) {
        throw new Error(
          "To sort an array of objects, you must pass 'key' parameter"
        );
      }

      return String(order === 'asc' ? first : second).localeCompare(
        String(order === 'asc' ? second : first)
      );
    });
  }

  return array.sort((first, second) =>
    String(order === 'asc' ? get(first, key) : get(second, key)).localeCompare(
      String(order === 'asc' ? get(second, key) : get(first, key))
    )
  );
}

export function removeDuplicatesFromArray<T>(array: Array<T>): Array<T> {
  return Array.from(new Set(array));
}

export function removeDuplicatesFromArrayOfObjects<T>(
  arrayOfObjects: Array<T>,
  keys: (keyof T)[]
): Array<T> {
  const checkKeyValue = (data: T, item: T) => (key: typeof keys[0]) =>
    get(item, key as string) === get(data, key as string);

  return arrayOfObjects.filter(
    (data, index, array) =>
      array.findIndex((item) => keys.every(checkKeyValue(data, item))) === index
  );
}
