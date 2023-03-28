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
export const debounceFn = <F extends (...args: unknown[]) => unknown | void>(
  func: F,
  waitFor: number,
  uniqueId = 1
): ((...args: Parameters<F>) => ReturnType<F>) => {
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
