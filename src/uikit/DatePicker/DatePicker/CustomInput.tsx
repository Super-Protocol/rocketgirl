import {
    MutableRefObject, FC, useEffect, useState, useRef, useCallback, forwardRef, RefObject,
} from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import InputMask from 'react-input-mask';
import { Calendar } from 'react-feather';
import { useDebouncedCallback } from 'use-debounce';
import { setCaretPosition, getCaretPosition } from '@/utils/dom/caret-position';
import { CustomInputProps } from '../types';
import classes from './CustomInput.module.scss';
import { inputParts, nextCaretData } from './CustomInput.types';
import {
    maskRegex, isMask, calcStartOver, inputRanges, parseValue, validateNewDate,
} from './CustomInput.helpers';

// todo mb implement validation for manual input, because invalid value is changed, but the model is not changed
const CustomInputComponent: FC<CustomInputProps> = ({
    placeholder = '',
    value = '',
    id,
    parentRef,
    onClick = (): void => {},
    onChange = (): void => {},
    label = '',
    dataTestId = '',
    classNameWrap = '',
    isFocused = false,
    closeDatepicker,
    minDate,
    maxDate,
    tabIndex,
    appearance,
}) => {
    const inputMaskRef: RefObject<any> = useRef(null);
    const [focused, setFocused] = useState(false);
    const nextCaretPosition: MutableRefObject<nextCaretData> = useRef({ start: 0, end: 0 });
    const parseFormat = typeof value === 'string' ? 'DD.MM.YYYY' : undefined;
    const [inputValue, setInputValue] = useState<string>(
        value && dayjs(value, parseFormat).format('DD.MM.YYYY'),
    );
    const setValue = useCallback((newValue: string) => {
        setInputValue(newValue);

        if (inputMaskRef && inputMaskRef.current) {
            inputMaskRef.current.value = newValue;
        }
    }, []);

    const setValueAndThrowChange = useCallback((
        newValue: string,
        nextCaretStart?: number,
        nextCaretEnd?: number,
    ): void => {
        setValue(newValue); // always change the local value
        if (validateNewDate(newValue, minDate, maxDate)) {
            if (typeof nextCaretStart === 'number' && typeof nextCaretEnd === 'number') {
                nextCaretPosition.current.start = nextCaretStart;
                nextCaretPosition.current.end = nextCaretEnd;
            }
            if (validateNewDate(newValue, minDate, maxDate, false)) {
                onChange({ target: { value: newValue } }); // change only the valid value in the model
            }
        }
    }, [setValue, onChange, minDate, maxDate]);

    useEffect(() => {
        setValue(value as string);
    }, [value, setValue]);

    useEffect(() => {
        if (nextCaretPosition.current.start != null) {
            setCaretPosition(inputMaskRef.current, nextCaretPosition.current.start, nextCaretPosition.current.end);
            nextCaretPosition.current.start = null;
            nextCaretPosition.current.end = null;
        }
    }, [inputValue]);

    useEffect(() => {
        parentRef(inputMaskRef.current);
    }, [parentRef]);

    const intelligentlyPrepareValue = useCallback((val: string): string => {
        const matchResult = parseValue(val);
        if (matchResult) {
            const [day, month, year] = matchResult;

            const dayFirstNum = parseInt(day[0], 10);
            const monthFirstNum = parseInt(month[0], 10);
            const monthNum = parseInt(month.replaceAll(maskRegex, ''), 10);
            const dayDefinitelyLessTen = monthNum === 2 ? dayFirstNum >= 3 : dayFirstNum >= 4;
            const finalDay = dayDefinitelyLessTen ? `0${dayFirstNum}` : day;
            const finalMonth = monthFirstNum >= 2 ? `0${monthFirstNum}` : monthNum > 12 ? '12' : month;

            if (isMask(month[1]) && monthFirstNum >= 2) {
                nextCaretPosition.current.start = 6;
                nextCaretPosition.current.end = 6;
            }

            if (isMask(day[1]) && dayDefinitelyLessTen) {
                nextCaretPosition.current.start = 3;
                nextCaretPosition.current.end = 3;
            }

            const date = `${finalDay}.${finalMonth}.${year}`;

            if (maxDate && !date.includes('_') && dayjs(date, 'DD.MM.YYYY').isAfter(dayjs(maxDate).endOf('day'))) {
                return dayjs(maxDate).format('DD.MM.YYYY');
            }

            if (minDate && !date.includes('_') && dayjs(date, 'DD.MM.YYYY').isBefore(dayjs(minDate))) {
                return dayjs(minDate).format('DD.MM.YYYY');
            }

            return date;
        }

        return val;
    }, [maxDate, minDate]);

    const goToNextSection = useCallback(() => {
        const matchResult = parseValue(inputValue);

        if (matchResult) {
            const [day, month, year] = matchResult;
            const caretPosition = getCaretPosition(inputMaskRef.current);

            if (caretPosition === 1 && isMask(day[1])) {
                const finalDay = `0${day[0]}`;
                const finalValue = `${finalDay}.${month}.${year}`;
                setValueAndThrowChange(finalValue, 3, 3);
            }

            if (caretPosition === 4 && isMask(month[1])) {
                const finalMonth = `0${month[0]}`;
                const finalValue = `${day}.${finalMonth}.${year}`;
                setValueAndThrowChange(finalValue, 6, 6);
            }
        }
    }, [inputValue, setValueAndThrowChange]);

    const updateCurrentSection = useCallback((direction: 'up' | 'down') => {
        const matchResult = parseValue(value as string);

        if (matchResult) {
            const [day, month, year] = matchResult;
            const caretPosition = getCaretPosition(inputMaskRef.current);

            inputRanges.forEach(([startPos, endPos], partIndex) => {
                if (typeof caretPosition === 'number' && caretPosition >= startPos && caretPosition <= endPos) {
                    const fieldValue = matchResult[partIndex];
                    const padLen = partIndex === inputParts.YEAR ? 4 : 2;

                    const parsedVal = (parseInt(fieldValue.replaceAll(maskRegex, ''), 10) || 0);
                    const changedVal = direction === 'up' ? parsedVal + 1 : parsedVal - 1;

                    const finalNum = `${changedVal}`.padStart(padLen, '0');
                    const finalDay = partIndex === inputParts.DAY ? finalNum : day;
                    const finalMonth = partIndex === inputParts.MONTH ? finalNum : month;
                    const finalYear = partIndex === inputParts.YEAR ? finalNum : year;
                    const finalValue = `${finalDay}.${finalMonth}.${finalYear}`;

                    const newValueValid = validateNewDate(finalValue, minDate, maxDate);

                    if (newValueValid) {
                        setValueAndThrowChange(finalValue, startPos, endPos);
                    } else {
                        const finalDay2 = partIndex === inputParts.DAY
                            ? calcStartOver(day, month, year, direction, 'month', minDate, maxDate) : day;

                        const finalMonth2 = partIndex === inputParts.MONTH
                            ? calcStartOver(day, month, year, direction, 'year', minDate, maxDate) : month;

                        setValueAndThrowChange(`${finalDay2}.${finalMonth2}.${finalYear}`, startPos, endPos);
                    }
                }
            });
        }
    }, [value, minDate, maxDate, setValueAndThrowChange]);

    const onChangeHandler = useCallback((event) => {
        const finalValue = intelligentlyPrepareValue(event.target.value);
        setValueAndThrowChange(finalValue);
    }, [setValueAndThrowChange, intelligentlyPrepareValue]);

    const onKeyDown = useCallback((event) => {
        if (event.key === 'Tab') {
            closeDatepicker();
        }

        const nextSectionSymbols = ['б', 'ю', ',', '.', ' '];
        if (nextSectionSymbols.includes(event.key) && inputMaskRef.current) {
            event.preventDefault();
            goToNextSection();
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            updateCurrentSection('up');
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            updateCurrentSection('down');
        }
    }, [closeDatepicker, goToNextSection, updateCurrentSection]);

    const onMouseUp = useCallback(() => {
        const caretPosition = getCaretPosition(inputMaskRef.current);
        inputRanges.forEach(([startPos, endPos]) => {
            if (typeof caretPosition === 'number' && caretPosition >= startPos && caretPosition <= endPos) {
                setTimeout(() => {
                    if (inputMaskRef.current) {
                        inputMaskRef.current.focus();
                        setCaretPosition(inputMaskRef.current, startPos, endPos);
                    }
                }, 100);
            }
        });
    }, []);

    const onFocus = useCallback(() => {
        setFocused(true);
    }, []);

    const onBlur = useDebouncedCallback(() => {
        setFocused(false);
    }, 200, { leading: false });

    return (
        <div className={cn(classes.root, classes[`appearance-${appearance}`], { focused: isFocused })} onClick={onClick}>
            <div className={cn(classes.wrap, classNameWrap, { [classes.wrapWithoutLabel]: !label })}>
                {!!label && <span>{label}</span>}
                <InputMask
                    className={cn({ [classes.inactive]: !inputValue && !focused })}
                    ref={inputMaskRef}
                    mask="99.99.9999"
                    maskPlaceholder={focused ? 'дд.мм.гггг' : undefined}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={onChangeHandler}
                    onKeyDown={onKeyDown}
                    onMouseUp={onMouseUp}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    id={id}
                    data-testid={dataTestId}
                    tabIndex={tabIndex}
                />
            </div>
            <Calendar />
        </div>
    );
};

export const CustomInput = forwardRef((props: CustomInputProps, ref) => <CustomInputComponent {...props} parentRef={ref} />);
