import dayjs from 'dayjs';

import { DatePickerMinMaxDate } from '../types';

export const inputRanges = [[0, 2], [3, 5], [6, 10]];

export const maskRegex = /([_дdмmгy])/g;

export const isMask = (str: string): boolean => {
    return str.search(maskRegex) >= 0;
};

export const parseValue = (val: string): string[] | null => {
    const matchResult = val.match(/([\d_дd]{2})\.([\d_mм]{2})\.([\d_yг]{4})/);

    if (matchResult) {
        return matchResult.slice(1);
    }

    return null;
};

export const validateNewDate = (
    str: string,
    minDate?: DatePickerMinMaxDate,
    maxDate?: DatePickerMinMaxDate,
    checkUnderline = true,
): boolean => {
    const matchResult = parseValue(str);

    if (matchResult) {
        const [day, month, year] = matchResult;

        if (checkUnderline && (isMask(day) || isMask(month) || isMask(year))) {
            return true;
        }

        const date = dayjs(`${day}-${month}-${year}`, 'DD-MM-YYYY');

        if (
            !date.isValid()
            || date.date() !== Number(day)
            || date.month() !== Number(month) - 1
            || date.year() !== Number(year)
        ) {
            return false;
        }

        const minDateValid = minDate === undefined
            || !dayjs(minDate).isValid()
            || Number(date) >= Number(new Date(minDate));

        const maxDateValid = maxDate === undefined
            || !dayjs(minDate).isValid()
            || Number(date) <= Number(new Date(maxDate));

        return minDateValid && maxDateValid;
    }

    return true;
};

export const calcStartOver = (
    day: string,
    month: string,
    year: string,
    direction: 'up' | 'down',
    partOfDate: 'month' | 'year',
    minDate?: DatePickerMinMaxDate,
    maxDate?: DatePickerMinMaxDate,
): string => {
    const currentDate = dayjs(`${day}-${month}-${year}`, 'DD-MM-YYYY');
    const newDate = direction === 'up' ? currentDate.startOf(partOfDate) : currentDate.endOf(partOfDate);

    const addPad = (str: string) => `${str}`.padStart(2, '0');
    const gettersMap = {
        month: (date) => addPad(date.date()),
        year: (date) => addPad(date.month() + 1),
    };

    if (minDate && Number(minDate) > Number(newDate)) {
        return gettersMap[partOfDate](dayjs(minDate));
    }

    if (maxDate && Number(maxDate) < Number(newDate)) {
        return gettersMap[partOfDate](dayjs(maxDate));
    }

    return gettersMap[partOfDate](newDate);
};
