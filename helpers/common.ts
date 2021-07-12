export function getEnvVar(
  envVarName: string,
  defaultValue?: string,
  convertToHTTPS = false,
  isDebuggerOn = false
) {
  const env = `REACT_APP_${envVarName.toUpperCase()}`;
  const value = process.env[env] || defaultValue || 'Env_var_not_found';

  if (isDebuggerOn) {
    /* eslint-disable no-console */
    console.groupCollapsed(`🐞 Debugging env: ${env}`);
    console.log(`Env tag name: ${env}`);
    console.log(`Env tag value: ${process.env[env]}`);
    console.log(`Env default value: ${defaultValue}`);
    console.log(`Returned value: ${value}`);
    console.groupEnd();
    /* eslint-enable no-console */
  }

  return convertToHTTPS
    ? value?.toLowerCase().replace('http:', 'https:')
    : value;
}

interface TimeoutObject {
  1: ReturnType<typeof setTimeout> | undefined;
  [key: number]: ReturnType<typeof setTimeout> | undefined;
}
const timeout: TimeoutObject = { 1: undefined };
/**
 * Atrasa a chamada de uma função e impede que ela seja executada varias
 * vezes se chamada repetidamente.
 * Ex.:
 * const funcao = debounceFn(() => console.log('Log atrasado em 1s'), 1000);
 *
 * funcao(); // Log atrasado em 1s
 *
 * @param func Função a ser chamada no callback
 * @param waitFor Tempo (delay) em milisegundos pra chamar a `func`
 * @param uniqueId Id do timeout a ser guardado. é usado para evitar que um debounce sobrescreva o outro
 */
export const debounceFn = <F extends (...args: any[]) => any | void>(
  func: F,
  waitFor: number,
  uniqueId = 1
) => {
  const debounced = (...args: Parameters<F>) => {
    const tm = timeout[uniqueId];
    if (tm !== undefined) {
      clearTimeout(tm);
      timeout[uniqueId] = undefined;
    }
    timeout[uniqueId] = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

/**
 * Compara objetos de forma profunda, percorrendo todas as propriedades dentro deles.
 * Retorna `true` se houver diferenças
 */
export const objectsHasDifferences = (
  object1: Record<any, any>,
  object2: Record<any, any>,
  blacklistKeys?: string[]
): boolean => {
  if (!object1 && !object2) {
    return false;
  }

  if (
    !object1 ||
    !object2 ||
    typeof object1 !== 'object' ||
    typeof object2 !== 'object'
  ) {
    return object1 !== object2;
  }

  const obj1Keys = Object.keys(object1);
  const obj2Keys = Object.keys(object2);
  const keys = obj1Keys.length < obj2Keys.length ? obj2Keys : obj1Keys;
  return keys?.some((key) => {
    if (blacklistKeys?.includes(key)) {
      return false;
    }

    const isDiff =
      typeof object1[key] === 'object'
        ? objectsHasDifferences(object1[key], object2[key], blacklistKeys)
        : object1[key] !== object2[key];

    return isDiff;
  });
};

export const createUrlFromBlob = (dataBlob: any, filetype: string) => {
  const blob = new Blob([dataBlob], { type: filetype });
  return window.URL.createObjectURL(blob);
};

// Turn enum into array
export const enumToOptions = (
  enumme: any,
  clearOption: IOption = { label: 'Todos', value: 0 }
): IOption[] => [
  ...Object.keys(enumme)
    .filter(StringIsNumber)
    .map((key: any) => ({ label: enumme[key], value: Number(key) })),
  clearOption,
];
