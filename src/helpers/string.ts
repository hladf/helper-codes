//
// ATENÇÃO:
// Alguns validadores retornam TRUE se o parametro passado for inválido pq
// o papel de validar se é null/false/undefined é de outra validação
// que deveria acontecer antes dessas

export function hasOnlyNumbers(text: string): boolean {
  if (!text) return true;
  return !!text.match(/^[0-9]+$/);
}

export function hasNumbers(text: string): boolean {
  const regex = /\d/g;
  return regex.test(text);
}

export function hasOnlyLetters(text?: string): boolean {
  if (!text) return true;
  return !!text.match(/^[a-zA-Z\u00C0-\u00ff\s]+$/);
}

export function hasIsolatedAccents(text?: string): boolean {
  if (!text) return true;
  return !!text.match(/^[a-zA-Z\u00C0-\u00FF\s]*$/);
}

export function hasSpecialCharacter(text: string): boolean {
  if (!text) return true;
  const regex = /[@!#$%^&*]/;
  return regex.test(text);
}

// const mapLetters = {
//   'e': true,
//   'y': true,
//   'd': true,
//   'o': true,
//   'u': true,
//   'i': true,
// }

export function hasNoIsolatedLetters(text?: string, acceptEY = true): boolean {
  if (!text) return true;
  const lettersToIgnore = ['e', 'y', 'd', 'o', 'u', 'i'];
  const verifyIfHaveLettersToIgnore = (char: string): boolean =>
    lettersToIgnore
      .map((letter) => letter.toLowerCase() === char.toLowerCase())
      .some(Boolean);

  const name = text
    .split(' ')
    .find((char) =>
      acceptEY
        ? char.length === 1 && !verifyIfHaveLettersToIgnore(char)
        : char.length === 1
    );
  return !name;
}

export function removeSpaces(text: string): string {
  return text.replace(/[\s]/g, '');
}

export function firstNameThreeChar(text?: string): boolean {
  if (!text) return true;
  return !!(text && text.split(' ')[0].length >= 3);
}

export function firstNameTwoOrOneChar(text?: string): boolean {
  if (!text) return true;
  const lettersToAccept = ['D', 'I', 'O', 'U', 'Y'];
  const firstName = text.split(' ')[0];
  const oneLetter =
    firstName.length === 1 &&
    lettersToAccept
      .map((letter) => letter.toLowerCase() === firstName.toLowerCase())
      .some(Boolean);
  return !!(oneLetter || firstName.length >= 2);
}

export function firstNameTwoOrOneCharFinder(text?: string): boolean {
  if (!text) return true;
  const firstName = text.split(' ')[0];
  const oneLetter = firstName.length === 1;
  return !!(oneLetter || firstName.length >= 2);
}

export function hasMoreLettersThanNumbers(text?: string): boolean {
  const numbers = String(text).match(/[0-9]/g)?.length || 0;
  const letters = String(text).match(/[a-zA-Z]/g)?.length || 0;
  return letters > numbers;
}

export function hasLettersAndNumbers(str: string): boolean {
  return (
    !!str.match(/^(?:[0-9]+[a-z\s]|[a-z\s]+[0-9])[a-z0-9\s]*$/i)?.length ||
    false
  );
}

/** valida se o texto tem no máximo 1 letra. Numeros sao ignorados */
export function hasOnlyTwoLetterMax(text?: string): boolean {
  if (!text) return true;
  const letters = String(text).match(/[a-zA-Z]/g)?.length || 0;
  return letters <= 2;
}

export function hasTwoNames(value?: any) {
  if (!value) return true;
  return value?.includes(' ');
}

export function validatePhoneDDD(fullNumber?: string) {
  if (!fullNumber) return true;

  const ddd = fullNumber && fullNumber.substr(0, 2);
  if (ddd.startsWith('0')) return false;
  if (ddd.length !== 2) return false;

  return true;
}

export function validatePhoneWithDDD(value?: string) {
  if (!value || value.length < 1) return true;

  const phone = value && value.substr(2);

  if (phone.startsWith('0')) return false;

  const blacklist = [
    '11111111',
    '22222222',
    '33333333',
    '00000000',
    '111111111',
    '222222222',
    '333333333',
    '000000000',
  ];
  if (blacklist.includes(phone)) return false;

  return true;
}

/** Valida se `NÃO` há apenas caracteres repetidos. ex.: 'EEEEE' = false */
export function hasntOnlySameChars(str: string) {
  if (!str) return true;
  return !str.split('').every((char) => char === str.substr(0, 1));
}

export function putLeftZeros(valueToPut: string, zerosLength = 12) {
  return (Array(zerosLength).fill('0').join('') + valueToPut).slice(
    -1 * zerosLength
  );
}

export const nameListToLocaleString = (
  selectedBeneficiaries?: string[]
): string => {
  if (!selectedBeneficiaries || !selectedBeneficiaries.length) {
    return '';
  }

  return selectedBeneficiaries?.reduce((combinedStr, curr, index) => {
    const first = index === 0;
    const last = index === selectedBeneficiaries.length - 1;
    if (first) {
      return curr;
    }
    return last ? `${combinedStr} e ${curr}` : `${combinedStr}, ${curr}`;
  }, '');
};

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const verifyCep = (cep: string) => {
  const regex = /^[0-9]{5}-[0-9]{3}$/;
  return regex.test(cep);
};
