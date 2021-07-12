import { parse, parseISO, isAfter, lastDayOfMonth } from 'date-fns';

import { dd } from './ddd-whitelist';
import { hasntOnlySameChars, hasOnlyNumbers } from './string';
const FULL_NAME_REGEX = /^[A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-zÀ-ÿ']+$/;

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const ZIP_CODE_REGEX = /^\d{5}[-]\d{3}$/;
const DATE_REGEX = /^((0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/](19|20)[0-9]{2})*$/;
const HEIGHT_REGEX = /^([1-2][0-9][0-9])|([1-9][0-9])$/;
const WEIGHT_REGEX = /^([1-9][0-9]?[0-9]?.?[0-9])$/;
const NAME_REGEX = /^[A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-zÀ-ÿ']+$/;
const PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]*/;
const SPACE_ONLY = /^\s*$/;
const PHONE_REGEX = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/;
export const NO_SPECIAL_CHARS = /^\s|[!§@º•ªª˚ÄÅÁËÉÏÍÖÓÜÚÀÈÌÒÙÃÕÂÊÎÔÛçÇâäåáàãëéêèïîíìóôõöòúûùü´°¨#$%;`'~&*_\][˜^ˆ+=(),.?":{}/\-|<>]/g;
export function haveNotOnlySpaces(text): boolean {
  return !SPACE_ONLY.test(text);
}

export function isEmailValid(email): boolean {
  if (email !== undefined && email !== null && email.trim().length === 0) {
    return true;
  }
  return EMAIL_REGEX.test(email);
}

export function isDomainEmailValid(email: string): boolean {
  if (email === undefined || email === null || email.trim().length === 0) {
    return true;
  }

  const str = email.split('@')[1];

  if (str) {
    const onlyNumbers = hasOnlyNumbers(str);
    const sameChars = hasntOnlySameChars(str);
    return !onlyNumbers && sameChars;
  }
  return false;
}

export function isHeightValid(height): boolean {
  return HEIGHT_REGEX.test(height);
}

export function isWeightValid(weight): boolean {
  return WEIGHT_REGEX.test(weight);
}

export function isNameValid(name): boolean {
  return NAME_REGEX.test(name);
}

export function isPhoneValid(phone): boolean {
  if (
    !phone ||
    (phone !== undefined && phone !== null && phone.trim().length === 0)
  ) {
    return true;
  }
  return PHONE_REGEX.test(phone);
}
export function isDDValid(phone): boolean {
  if (
    !phone ||
    (phone !== undefined && phone !== null && phone.trim().length === 0)
  ) {
    return true;
  }
  const onlyNumbers = phone.replace(/\D/g, '');
  if (dd.includes(onlyNumbers[0] + onlyNumbers[1])) {
    return true;
  }
  return false;
}

export function isDateValid(date?): boolean {
  if (date instanceof Date || !date) {
    return true;
  }
  return DATE_REGEX.test(date);
}

export const isFutureDate = (date?: string) => {
  if (!isDateValid(date) || !date) return false;
  const isoString = parse(date, 'dd/MM/yyyy', new Date()).toISOString();

  const isoDate = parseISO(isoString);

  return isAfter(isoDate, new Date()); // true
};

export function maxDate(max, value) {
  if (value === null || value === '') {
    return true;
  }

  return value <= max;
}

export const isFullNameValid = (value: string) =>
  value ? FULL_NAME_REGEX.test(value) : true;

export function isPasswordValid(password): boolean {
  return PASSWORD_REGEX.test(password);
}

export function isZipCodeValid(value: string): boolean {
  if (!value) {
    return true;
  }
  const onlyNumbers = value.replace(/\D/g, '');
  if (onlyNumbers === value && value.length === 8) {
    return true;
  }
  if (!value.includes('-')) {
    return value.length === 8;
  }
  return ZIP_CODE_REGEX.test(value);
}

export function isCnsValid(value): boolean {
  const CnsLength = 15;
  const CheckSumModule = 11;

  const checkSum = (cns: string): number => {
    const length = 0;
    let sum = 0;

    for (let i = 0; i < length; i++) {
      const digit: number = +cns.charAt(i) * (CnsLength - i);
      sum += digit;
    }

    return sum;
  };

  if (value === undefined) {
    return false;
  }

  const onlyNumbers = value.replace(/\D/g, '');

  const invalidMatches: boolean =
    !onlyNumbers.match('[1-2]\\d{10}00[0-1]\\d') &&
    !onlyNumbers.match('[7-9]\\d{14}');
  if (
    onlyNumbers.length !== CnsLength ||
    invalidMatches ||
    checkSum(onlyNumbers) % CheckSumModule !== 0
  ) {
    return false;
  }

  return true;
}

// Pega um valor de string de cartão de crédito e retorna true em um número válido
export function isCreditCardNumberValid(value: string): boolean {
  // Accept only digits, dashes or spaces
  if (/[^0-9-\s]+/.test(value)) return false;

  // The Luhn Algorithm. It's so pretty.
  let nCheck = 0;
  let bEven = false;
  value = value.replace(/\D/g, '');

  for (let n = value.length - 1; n >= 0; n--) {
    const cDigit = value.charAt(n);
    let nDigit = parseInt(cDigit, 10);

    if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

    nCheck += nDigit;
    bEven = !bEven;
  }

  return nCheck % 10 === 0;
}

/** Valida se a data de validade do cartão é válida e retorna true caso seja. Formato: `10/2010` */
export function isCardDueDateValid(dueDate?: string): boolean {
  try {
    if (dueDate?.length !== 7 || !dueDate?.includes('/')) return false;
    const splittedDueDate = dueDate.split('/').map(Number);

    let parsedDueDate = new Date(splittedDueDate[1], splittedDueDate[0] - 1);
    parsedDueDate = lastDayOfMonth(parsedDueDate);
    const dateNow = new Date();

    if (isAfter(dateNow, parsedDueDate)) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
