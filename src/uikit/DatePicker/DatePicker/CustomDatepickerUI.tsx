/* eslint-disable import/no-extraneous-dependencies */
import {
    FC, memo, useEffect, useMemo, useCallback, useState, useRef, RefObject,
} from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import cn from 'classnames';
import dayjs from 'dayjs';
// import { useMediaLayout } from 'use-media';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { PopperContainer } from '@/uikit';
import { Item } from '@/uikit/Select/types';
import { CustomInput } from './CustomInput';
import { CustomDatePickerUIProps } from '../types';
import {
    finalizeDate, addTimezone, distractTimezone, getMonths, validateNewDate,
} from '../helpers';
import classes from './CustomDatepickerUI.module.scss';

type datePickerInstance = {
    setOpen: (state: boolean) => void;
}

export const CustomDatepickerUI: FC<CustomDatePickerUIProps> = memo(({
    touched,
    onChange = (): void => {},
    value,
    error,
    label,
    placeholder,
    minDate,
    maxDate,
    locale,
    showError,
    endOfDay,
    classNameErrorEmpty,
    classNameWrap,
    classNameWrapInput,
    popperPlacement,
    popperModifiers,
    endDate,
    dataTestId,
    useOverlay,
    tabIndex,
    appearance = 'default',
    ...props
}) => {
    const [isFocused, setFocused] = useState<boolean>(false);

    const getLocalValue = useCallback(() => (value ? distractTimezone(value) : undefined), [value]);
    const [localValue, setLocalValue] = useState(getLocalValue());
    useEffect(() => { setLocalValue(getLocalValue()); }, [getLocalValue]);

    const [selectedYear, setSelectedYear] = useState<number>(dayjs(localValue ?? new Date()).year());
    const months: Item[] = useMemo<Item[]>(
        () => getMonths(localValue ? new Date(finalizeDate(localValue)) : new Date(), selectedYear, minDate, maxDate),
        [localValue, selectedYear, minDate, maxDate],
    );

    // const isSmallScreenHeight = useMediaLayout({ maxHeight: '838px' });
    const isSmallScreenHeight = false;
    const datePickerRef: RefObject<datePickerInstance> = useRef(null);

    const popperPlacementDefault = isSmallScreenHeight ? 'right' : 'bottom-start';
    const popperPlacementFinal = popperPlacement || popperPlacementDefault;

    const isInvalid = useMemo(() => !!error && touched, [error, touched]);

    const onDataChange = useCallback((val) => {
        const v = val ? finalizeDate(val, endOfDay ? 'endOf' : 'startOf') : null;
        if (validateNewDate(v, minDate, maxDate)) {
            onChange(v ? addTimezone(v) : null);
            setSelectedYear(dayjs(v || new Date()).year());
        }
    }, [endOfDay, minDate, maxDate, onChange]);

    const closeDatepicker = useCallback(() => {
        if (datePickerRef.current) {
            datePickerRef.current.setOpen(false);
        }
    }, [datePickerRef]);

    const renderCustomHeader = useCallback(({
        changeYear,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
        date,
    }) => {
        const currentDate = date
            ? dayjs(finalizeDate(date, endOfDay ? 'endOf' : 'startOf'))
            : dayjs();

        const prevYear = currentDate.subtract(1, 'year');
        const nextYear = currentDate.add(1, 'year');
        const ableToSetPrevYear = validateNewDate(prevYear.toDate(), minDate, maxDate);
        const ableToSetNextYear = validateNewDate(nextYear.toDate(), minDate, maxDate);

        const setPreviousYear = () => {
            if (ableToSetPrevYear) {
                changeYear(dayjs(date).year() - 1);
            }
        };

        const setNextYear = () => {
            if (ableToSetNextYear) {
                changeYear(dayjs(date).year() + 1);
            }
        };

        return (
            <div className={classes.customHeader}>
                <div className={classes.month}>
                    <ChevronLeft
                        onClick={prevMonthButtonDisabled ? undefined : decreaseMonth}
                        className={cn(classes.chevronIcon, {
                            [classes.disabled]: prevMonthButtonDisabled,
                        })}
                    />
                    <div className={classes.monthName}>
                        {months[dayjs(date).month()]?.label}
                    </div>
                    <ChevronRight
                        onClick={nextMonthButtonDisabled ? undefined : increaseMonth}
                        className={cn(classes.chevronIcon, {
                            [classes.disabled]: nextMonthButtonDisabled,
                        })}
                    />
                </div>
                <div className={classes.year}>
                    <ChevronLeft
                        onClick={setPreviousYear}
                        className={cn(classes.chevronIcon, {
                            [classes.disabled]: !ableToSetPrevYear,
                        })}
                    />
                    <div className={classes.yearName}>{dayjs(date).year()}</div>
                    <ChevronRight
                        onClick={setNextYear}
                        className={cn(classes.chevronIcon, {
                            [classes.disabled]: !ableToSetNextYear,
                        })}
                    />
                </div>
            </div>
        );
    }, [endOfDay, maxDate, minDate, months]);

    return (
        <div className={cn(
            classes.customDatepicker,
            'custom-datepicker',
            classes[`appearance-${appearance}`],
            { [classes.customDatepickerError]: isInvalid },
            classNameWrap,
        )}
        >
            <Form.Group data-testid={`dp-formgroup-${dataTestId}`}>
                <DatePicker
                    ref={datePickerRef}
                    locale={locale}
                    data-testid="datepicker"
                    dateFormat="dd.MM.yyyy"
                    selected={(localValue && finalizeDate(localValue)) || null}
                    onChange={onDataChange}
                    minDate={minDate || null}
                    maxDate={maxDate || null}
                    className="form-control"
                    popperClassName={
                        cn(
                            classes.customDatepicker,
                            'custom-datepicker',
                            { [classes.customDatepickerError]: isInvalid },
                        )
                    }
                    popperPlacement={popperPlacementFinal}
                    popperModifiers={{
                        // flip: {
                        //     fallbackPlacements: ['right'],
                        //     rootBoundary: 'viewport',
                        // },
                        enabled: true,
                        phase: 'main',
                        name: '',
                        fn: () => {},
                        ...popperModifiers,
                    }}
                    placeholderText={placeholder}
                    customInput={(
                        <CustomInput {...{
                            value: localValue,
                            label,
                            dataTestId: `datepicker-${dataTestId}`,
                            classNameWrap: classNameWrapInput,
                            isFocused,
                            closeDatepicker,
                            tabIndex,
                            appearance,
                            minDate: minDate || undefined,
                            maxDate: maxDate || undefined,
                        }}
                        />
                    )}
                    endDate={(endDate && finalizeDate(endDate)) || null}
                    popperContainer={useOverlay ? PopperContainer : undefined}
                    showMonthDropdown
                    showYearDropdown
                    onCalendarOpen={() => setFocused(true)}
                    onCalendarClose={() => setFocused(false)}
                    renderDayContents={(day) => <div className={classes.day}>{day}</div>}
                    renderCustomHeader={renderCustomHeader}
                    {...props}
                />
                {
                    showError
                        ? isInvalid ? (
                            <div
                                className="invalid-feedback"
                            >
                                {error}
                            </div>
                        ) : (
                            <div className={cn(classes.errorEmpty, classNameErrorEmpty)}>
                                <span>&nbsp;</span>
                            </div>
                        )
                        : null
                }
            </Form.Group>
        </div>
    );
});
