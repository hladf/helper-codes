import { IOption } from 'components';
import {
  parse,
  subHours,
  addDays,
  format,
  parseISO,
  addHours,
  addBusinessDays,
} from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { VigencyDateSLADays } from 'interfaces';
export const defaultDateFormat = 'dd/MM/yyyy';

const formatOptions: Intl.DateTimeFormatOptions = {
  hour12: false,
  day: '2-digit',
  weekday: 'long',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
};

export function stringToDate(
  dateStr: string | undefined,
  formatString = defaultDateFormat,
  referenceDate = new Date()
) {
  const date = dateStr
    ? parse(dateStr, formatString, referenceDate)
    : undefined;
  return date?.getTime() ? date : undefined;
}

export function formatDate(date: Date, formatString = defaultDateFormat) {
  return format(date, formatString);
}

export const formatDateToServer = (date: string) => {
  const parsed = stringToDate(date, 'dd/MM/yyyy', new Date());
  if (!parsed) return;
  return format(parsed, 'yyyy-MM-dd');
};

export const formatDateToClient = (date: string) => {
  const parsed = stringToDate(date, 'yyyy-MM-dd', new Date());
  if (!parsed) return;
  return format(parsed, 'dd/MM/yyyy');
};

export const mapDatesToOptions = (datesList: Date[]) =>
  datesList.map((date) => ({
    value: format(date, 'yyyy-MM-dd'),
    label: format(date, 'dd/MM/yyyy'),
  }));

type ListDateRangeParams = {
  /** Quantidade de dias antes do inicio da contagem. (startDate + initialDays) */
  initialDays?: number;
  /** Retorna apenas datas com os dias restritos informados */
  onlyTheseDays?: number[];
  /** Data de início. Caso não informado, pegará data atual */
  startDate?: Date;
  ignoreDays?: number[];
  /** Tamanho da lista de retorno (dias) */
  listSize?: number;
  /** weekend/weekdays verification  weekend or weekdays */
  dayType?: string;
};

export const listDateRange = ({
  startDate,
  onlyTheseDays,
  initialDays,
  ignoreDays,
  listSize,
}: ListDateRangeParams): Date[] => {
  try {
    let defaultListSize = listSize || 31;
    const baseDate =
      startDate || zonedTimeToUtc(subHours(new Date(), 3), 'America/Sao_Paulo');
    const dates: Date[] = [];
    const initialDate = initialDays
      ? addBusinessDays(baseDate, initialDays)
      : baseDate;
    for (let index = 0; index < defaultListSize; index++) {
      const incrementDate = addDays(initialDate, index);

      const restrictButNotIgnored =
        onlyTheseDays?.includes(incrementDate.getDate()) &&
        !ignoreDays?.includes(incrementDate.getDate());

      const notRestrictedAndNotFoundIgnored =
        !onlyTheseDays && !ignoreDays?.includes(incrementDate.getDate());

      const dontHaveRestrictionAndIgnoreList =
        !onlyTheseDays?.length && !ignoreDays?.length;

      const listIsFull = defaultListSize === dates.length;
      if (
        (restrictButNotIgnored ||
          notRestrictedAndNotFoundIgnored ||
          dontHaveRestrictionAndIgnoreList) &&
        !listIsFull
      ) {
        dates.push(incrementDate);
      } else if (!listIsFull) {
        defaultListSize = defaultListSize + 1;
      }
    }

    return dates;
  } catch (_error) {
    return [];
  }
};

export const getRangeOfDates = (): IOption[] =>
  mapDatesToOptions(
    listDateRange({
      initialDays: 22,
    })
  );

export const parseISOToDate = (isoString: string) => {
  let date = parseISO(isoString);

  /**
   * Caso a iso da string não contenha o timezone, é preciso adicionar 3 horas
   * Sem TZ: 2020-11-26T19:00:00Z
   * Com TZ: 2020-11-26T19:00:00+03:00
   */
  if (isoString.toUpperCase().endsWith('Z')) {
    date = addHours(date, 3);
  }
  return date;
};

export const parseDateWithTzCompensation = (str: string) =>
  parseISOToDate(str)
    .toLocaleString('pt-BR', formatOptions)
    .replace(/^\w/, (c) => c.toUpperCase());
// `${parseISOToDate(str).toLocaleString('pt-BR', formatOptions)} hrs`;
