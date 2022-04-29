import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { Item } from '@/uikit/Select/types';
import { DatePickerMinMaxDate } from './types';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const distractTimezone = (date: DatePickerMinMaxDate): Date => {
    const offsetInMins = dayjs().utcOffset();
    return dayjs(date).subtract(offsetInMins, 'minute').toDate();
};

export const finalizeDate = (date: DatePickerMinMaxDate, to: 'startOf' | 'endOf' = 'startOf'): Date => (
    dayjs(date)[to]('day').toDate()
);

export const addTimezone = (date: DatePickerMinMaxDate): Date => {
    const offsetInMins = dayjs().utcOffset();
    return dayjs(date).add(offsetInMins, 'minute').toDate();
};

export const getMonths = (
    currentDate?: DatePickerMinMaxDate,
    selectedYear?: number,
    minDate?: DatePickerMinMaxDate,
    maxDate?: DatePickerMinMaxDate,
): Item[] => ([
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
].map((item) => {
    const result: Item = { ...item, isDisabled: false };
    const targetDate = dayjs(currentDate)
        .year(selectedYear ?? dayjs(currentDate).year())
        .month(item.value);
    if (minDate) {
        result.isDisabled = targetDate.date(targetDate.daysInMonth()).isBefore(dayjs(minDate));
    }
    if (maxDate && !result.isDisabled) {
        result.isDisabled = targetDate.date(1).isAfter(dayjs(maxDate));
    }
    return result;
}));

export const validateNewDate = (
    date: Date | null,
    minDate?: DatePickerMinMaxDate,
    maxDate?: DatePickerMinMaxDate,
): boolean => {
    if (date === null) {
        return true;
    }

    const minDateValid = minDate === undefined
        || !dayjs(minDate).isValid()
        || Number(date) >= Number(new Date(minDate));

    const maxDateValid = maxDate === undefined
        || !dayjs(maxDate).isValid()
        || Number(date) <= Number(new Date(maxDate));

    return minDateValid && maxDateValid;
};
