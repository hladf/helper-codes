export const SessionStorage = {
  getItem: (key: string | number): string | null => {
    try {
      if (!window || typeof window === undefined) {
        return null;
      }

      return window.sessionStorage.getItem(String(key));
    } catch (_) {
      return null;
    }
  },
  setItem: (
    key: string | number,
    value: string,
    /** Run after save value in storage, generally to run `setState` function */
    callbackFn?: (value: string) => void
  ): void => {
    try {
      if (!window || typeof window === undefined) {
        return;
      }

      window.sessionStorage.setItem(String(key), value);
      callbackFn && callbackFn(value);
    } catch (_) {}
  },
};
