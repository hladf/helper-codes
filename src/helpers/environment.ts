export function isDevOrTestNodeEnv() {
  try {
    const NODE_ENV = process.env.NODE_ENV;
    return Boolean(NODE_ENV && ['development', 'test'].includes(NODE_ENV));
  } catch (_) {
    // eslint-disable-next-line no-console
    console.error('\n\nError getting NODE_ENV:', _);
    return false;
  }
}

export function isDevNodeEnv() {
  try {
    const NODE_ENV = process.env.NODE_ENV;
    return NODE_ENV === 'development';
  } catch (_) {
    // eslint-disable-next-line no-console
    console.error('\n\nError getting NODE_ENV:', _);
    return false;
  }
}

export function isLocalhost() {
  try {
    const host = window?.location.hostname;
    return host === 'localhost';
  } catch (_) {
    return false;
  }
}

/**
 * Returns `TRUE` if must system get local data from fake API.
 * Change the `return` value AS YOU NEED.
 *
 * Never commit changes in `return` of this function.
 *
 * Examples:
 *
 * return isDevNodeEnv() || isLocalhost();
 *
 * return true;
 *
 * return false;
 */
export function mustGetMockedData() {
  return false;
}

/** Gets TRUE if you are in a localhost environment. When mustGetMockedData is true, you must use BootstrapSF */
export const isLocalEnvironment = (): boolean =>
  (isDevOrTestNodeEnv() || isLocalhost()) && !mustGetMockedData();
