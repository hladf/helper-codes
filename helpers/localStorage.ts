export function getStorageItem(key: string) {
  try {
    const serializedItem = localStorage.getItem(key);

    if (serializedItem === null) {
      return undefined;
    }

    return JSON.parse(serializedItem);
  } catch (_err) {
    return undefined;
  }
}

export function setStorageItem<T>(key: string, item: T) {
  try {
    const serializedItem = JSON.stringify(item);

    return localStorage.setItem(key, serializedItem);
  } catch (_err) {
    return undefined;
  }
}

export function removeStorageItem(key: string) {
  try {
    return localStorage.removeItem(key);
  } catch (_err) {
    return undefined;
  }
}
