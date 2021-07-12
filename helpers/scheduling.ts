import { parseISOToDate } from 'helpers';
import {
  CreateSchedule,
  DateHourScheduleApiResponse,
  DateHourScheduleInfos,
  ListBeneficiariesSchedule,
  MakeAppointmentFormValues,
  Schedule,
  ScheduleInfos,
  ScheduleInfosApiResponse,
} from 'interfaces';
import { dissoc } from 'ramda';
import store from 'store';

const getOrganizationKey = (param: ScheduleInfosApiResponse) =>
  `${param.organizationIndentifier}/${param.location.identifier}`;

export function mapScheduleInfosResponse(
  scheduleInfosResponse: ScheduleInfosApiResponse[],
  scheduleInfosToEdit?: ScheduleInfosApiResponse
): ScheduleInfos[] {
  /** É preciso fazer um merge dos médicos antes de filtrar para que não falte nenhum no Select */
  const uniqueResults = scheduleInfosResponse
    .reduce<ScheduleInfosApiResponse[]>((unique, curr) => {
      const duplicateds = scheduleInfosResponse.filter(
        (info) => getOrganizationKey(info) === getOrganizationKey(curr)
      );
      if (duplicateds?.length > 1) {
        const mergedObjects = duplicateds.map((item) => {
          const combinedMedics = scheduleInfosToEdit
            ? [...curr.practitioners, ...scheduleInfosToEdit.practitioners]
            : curr.practitioners;

          return {
            ...item,
            practitioners: combinedMedics.filter(
              (item, i, arr) =>
                arr.findIndex(
                  (t) =>
                    t.scheduleId === item.scheduleId ||
                    t.identifier === item.identifier
                ) === i
            ),
          };
        });
        unique.push(...mergedObjects);
      }

      if (duplicateds?.length === 1) {
        unique.push(...duplicateds);
      }
      return unique;
    }, [])
    .filter(
      (scheduleInfo, i, arr) =>
        arr.findIndex(
          (t) => getOrganizationKey(t) === getOrganizationKey(scheduleInfo)
        ) === i
    );

  return uniqueResults.map((infos) => ({
    unit: {
      name: infos.organizationName,
      // mockado por problemas na api externa
      id: infos.organizationIndentifier || '60765823',
    },
    address: {
      name: infos.location.address,
      id: infos.location.identifier,
    },
    medics: infos.practitioners.map((medic) => ({
      scheduleId: medic.scheduleId,
      name: medic.name,
      id: medic.identifier,
    })),
  }));
}

const months = {
  0: 'Jan',
  1: 'Fev',
  2: 'Mar',
  3: 'Abr',
  4: 'Mai',
  5: 'Jun',
  6: 'Jul',
  7: 'Ago',
  8: 'Set',
  9: 'Out',
  10: 'Nov',
  11: 'Dez',
  99: 'Err',
};

const weekDays = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sab',
  99: 'Err',
};

const hourFormatOptions: Intl.DateTimeFormatOptions = {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
};

export function mapDateHourSchedulesResponse(
  dateHourSchedules: DateHourScheduleApiResponse[]
): DateHourScheduleInfos[] {
  const allDates = dateHourSchedules
    .sort((a, b) => (a.mainDateTime < b.mainDateTime ? -1 : 1))
    .map((slotHour) => {
      const parsedDate = parseISOToDate(slotHour.mainDateTime);
      const dateIsValid = parsedDate instanceof Date;

      const mapHours = (slots: DateHourScheduleApiResponse) =>
        slots.slotsInfo
          .map(() => ({
            id: slots.mainDateTime,
            text:
              parseISOToDate(slots.mainDateTime)?.toLocaleTimeString(
                undefined,
                hourFormatOptions
              ) || '00:00',
          }))
          .reduce<DateHourScheduleInfos['availableHours']>((uniqueList, curr) => {
            if (!uniqueList.find(({ id }) => id === curr.id)) {
              uniqueList.push(curr);
            }
            return uniqueList;
          }, []);

      return {
        month: months[dateIsValid ? parsedDate.getMonth() : 99],
        monthday: dateIsValid ? parsedDate.getDate() : 0,
        weekday: weekDays[dateIsValid ? parsedDate.getDay() : 99],
        availableHours: mapHours(slotHour),
      };
    });

  const uniqueDates: DateHourScheduleInfos[] = [];

  allDates.forEach((date) => {
    const foundIndex = uniqueDates.findIndex(
      (unique) => unique.month === date.month && unique.monthday === date.monthday
    );

    if (foundIndex >= 0) {
      uniqueDates[foundIndex].availableHours.push(...date.availableHours);
    } else {
      uniqueDates.push(date);
    }
  });

  return uniqueDates;
}

export const getScheduleDateKey = (monthDay: number, month: string) =>
  `${monthDay}/${month}`;

export const getScheduleDateKeyByDateISO = (date: string) => {
  try {
    const parsedDate = parseISOToDate(date);
    const dateIsValid = parsedDate instanceof Date;

    const month = months[dateIsValid ? parsedDate.getMonth() : 99];
    const monthday = dateIsValid ? parsedDate.getDate() : 0;
    return getScheduleDateKey(monthday, month);
  } catch (error) {
    return 'error';
  }
};

export const hasDiffInScheduleValues = (
  currentValues: MakeAppointmentFormValues,
  oldValues?: MakeAppointmentFormValues
): boolean => {
  if (!oldValues) {
    return true;
  }

  return Object.values(oldValues).reduce((_hasDiff, value) => {
    return !Object.values(currentValues).includes(value);
  }, true);
};

export const getLatestSchedule = (
  selectedBeneficiaries?: ListBeneficiariesSchedule[]
): Schedule | undefined => {
  try {
    if (!selectedBeneficiaries) {
      return undefined;
    }
    const firstSelected = (selectedBeneficiaries || [])[0];
    const length = firstSelected?.schedules?.length || 0;
    const latestSchedule = length
      ? firstSelected?.schedules && firstSelected?.schedules[length - 1]
      : undefined;

    return latestSchedule;
  } catch (_e) {
    return undefined;
  }
};

export const mapSchedulesToCreation = (values: MakeAppointmentFormValues) => {
  const {
    schedulesInfos,
    availableSlots,
    selectedBeneficiaries,
    prospects,
  } = store.getState().scheduling.data;

  const schedule = schedulesInfos.find((sc) =>
    sc.medics.some((md) => md.id === values.medic)
  );
  const doctor = dissoc(
    'scheduleId',
    schedule?.medics.find((md) => md.id === values.medic)
  );
  const hospital = {
    name: schedule?.unit.name,
    id: schedule?.address.id,
    address: schedule?.address.name,
  };
  const organizationIndentifier = schedule?.unit.id;
  const slots = availableSlots?.find((sl) => sl.mainDateTime === values.hour)
    ?.slotsInfo;

  const schedules = [] as CreateSchedule[];

  selectedBeneficiaries?.forEach((ben, i) => {
    const slot = slots && slots[i];
    if (!slot) return;

    const prospectInfo = prospects?.find(({ cpf }) => cpf === ben.beneficiary.cpf);
    const item = {
      slotId: slot.id,
      startDateTime: slot.start,
      endDateTime: slot.end,
      hospital,
      doctor,
      prospectId: String(prospectInfo?.id || 0),
      prospectType: Number(prospectInfo?.type || 0),
      organizationIndentifier,
      serviceId: slot.serviceId,
    } as CreateSchedule;

    schedules.push(item);
  });

  return schedules;
};

export const isPendingRectification = (status?: string) => {
  // melhorar essa parte toda de scheduling usando enum ou objeto contendo esses status
  // e substituir todos os lugares que usam essas strings para usar o novo enum
  return ['createdScheduling', 'pending'].includes(status || '');
};
