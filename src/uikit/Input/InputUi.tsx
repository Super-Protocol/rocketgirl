import {
    memo,
    useCallback,
    useState,
    SyntheticEvent,
    FC,
    useEffect,
    createElement,
    useMemo,
    FormEvent,
    KeyboardEvent,
} from 'react';
import { v4 as uuid } from 'uuid';
import cn from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import InputMask from 'react-input-mask';

import { Tooltip, Spinner, Box } from '@/uikit';
import classes from './InputUi.module.scss';
import { InputUiProps, keyCodes } from './types';

export const InputUi: FC<InputUiProps> = memo(({
    id,
    label = '',
    name = '',
    value,
    tooltip,
    isNumber = false,
    isFloat = false,
    isPositive = false,
    isInvalid = false,
    disabled,
    min,
    max,
    error,
    prepend,
    showError = false,
    autoComplete = 'off',
    classNameWrap,
    classNameLabel,
    classNameInput,
    classNameErrorEmpty,
    classNameError,
    classNamePrepend,
    classNameInputLabelFocused,
    classNameInputLabel,
    innerTooltip,
    onChange = (value: string | number, evt: SyntheticEvent): void => {},
    onKeyDown = (evt: SyntheticEvent): void => {},
    onBlur = (evt: SyntheticEvent): void => {},
    onFocus = (evt: SyntheticEvent): void => {},
    loading = false,
    as,
    resize = 'none',
    autosize = false,
    // пропсы для инпута типа "mask"
    mask,
    alwaysShowMask,
    beforeMaskedStateChange,
    renderError,
    markLabelError = true,
    ...props
}) => {
    const [inputId] = useState<string>(id || uuid());
    const [focused, setFocused] = useState<boolean>(false);
    const [localValue, setLocalValue] = useState<string>(value ? `${value}` : '');

    const checkMin: (val: string | number) => string | number = useCallback(
        (val) => (min !== undefined && val < min ? min : val),
        [min],
    );
    const checkMax: (val: string | number) => string | number = useCallback(
        (val) => {
            if (max !== undefined) {
                if (isFloat || isNumber) {
                    return val > max ? max : val;
                }
                return (val as string).length <= max ? val : `${val}`.substr(0, max);
            }
            return val;
        },
        [max, isFloat, isNumber],
    );
    const checkMinMax: (val: string | number) => string | number = useCallback(
        (val) => checkMax(checkMin(val)),
        [checkMax, checkMin],
    );

    const getCheckedValue = useCallback((val: string | number | undefined): string | number | undefined => {
        if (!val && val !== 0) return isNumber || isFloat ? undefined : val === null ? val : '';
        if (isPositive && (isNumber || isFloat) && val < 0) return undefined;
        return checkMinMax(val);
    }, [isNumber, isFloat, isPositive, checkMinMax]);

    const handleBlur: (evt: FormEvent<EventTarget>) => void = useCallback((evt: React.FormEvent<EventTarget>) => {
        setFocused(false);
        onBlur(evt);
        if (isFloat && localValue) {
            const parsedValue: number = parseFloat(localValue);
            setLocalValue(!Number.isNaN(parsedValue) ? `${parsedValue}` : '');
        }
    }, [isFloat, localValue, onBlur]);

    const handleFocus: (evt: FormEvent<EventTarget>) => void = useCallback((evt: React.FormEvent<EventTarget>) => {
        setFocused(true);
        onFocus(evt);
    }, [onFocus]);

    const handleChangeFloat: (evt: SyntheticEvent) => void = useCallback((evt: SyntheticEvent) => {
        const val = `${checkMinMax(((evt.target as HTMLInputElement).value || '').replace(/,/g, '.'))}`;
        const parsedValue: number = parseFloat(val);
        const re = /^\d+(\.(\d+)?)/;
        if (re.test(val)) {
            setLocalValue(val.match(re)?.[0] || '');
        } else if (!isPositive && (val === '-' || /[-]\d+$|[-]\d+\.$/.test(val))) {
            setLocalValue(`${val}`);
        } else {
            setLocalValue(!Number.isNaN(parsedValue) ? `${parsedValue}` : '');
        }
        onChange(!Number.isNaN(parsedValue) ? parsedValue : undefined, evt);
    }, [onChange, isPositive, checkMinMax]);

    const handleChangeNumber: (evt: SyntheticEvent) => void = useCallback((evt: SyntheticEvent) => {
        const val = `${checkMinMax((evt.target as HTMLInputElement).value)}`;
        const parsedValue: number = parseInt(val, 10);
        if (!isPositive && (val === '-' || /[-]\d+$/.test(val))) {
            setLocalValue(`${val}`);
        } else {
            setLocalValue(!Number.isNaN(parsedValue) ? `${parsedValue}` : '');
        }
        onChange(!Number.isNaN(parsedValue) ? parsedValue : undefined, evt);
    }, [onChange, isPositive, checkMinMax]);

    const handleChangeText: (evt: SyntheticEvent) => void = useCallback((evt: SyntheticEvent) => {
        const val = `${checkMinMax((evt.target as HTMLInputElement).value)}`;
        setLocalValue(val);
        onChange(val, evt);
    }, [onChange, checkMinMax]);

    const handleChange: (evt: SyntheticEvent) => void = useCallback((evt: SyntheticEvent) => {
        if (isNumber) {
            return handleChangeNumber(evt);
        }
        if (isFloat) {
            return handleChangeFloat(evt);
        }
        return handleChangeText(evt);
    }, [isNumber, isFloat, handleChangeText, handleChangeFloat, handleChangeNumber]);

    const handleKeyDown: (evt: SyntheticEvent) => void = useCallback((evt: SyntheticEvent) => {
        const val: string = (evt.target as HTMLInputElement).value;
        onKeyDown(evt);
        if (isNumber || isFloat) {
            const keyCode: number = (evt as KeyboardEvent).keyCode || (evt as React.KeyboardEvent).which;
            if (keyCode && [keyCodes.ARROW_UP, keyCodes.ARROW_DOWN].includes(keyCode)) {
                const decimalAfterPoint: number = val?.split('.')?.[1]?.length || 0;
                const incremented: string = (+val + (keyCode === keyCodes.ARROW_UP ? 1 : -1)).toFixed(decimalAfterPoint);
                const newValue: number = checkMinMax(
                    isFloat ? parseFloat(incremented) : parseInt(incremented, 10),
                ) as number;
                if (newValue > 0 || !isPositive) {
                    setLocalValue(!Number.isNaN(newValue) ? `${newValue}` : '');
                    onChange(!Number.isNaN(newValue) ? newValue : undefined, evt);
                }
            }
        }
    }, [isNumber, isFloat, isPositive, onKeyDown, onChange, checkMinMax]);

    const inputAs = useMemo(() => {
        if (as === 'textarea') {
            if (autosize) {
                return TextareaAutosize;
            }

            return 'textarea';
        }

        if (mask) {
            return InputMask;
        }

        return 'input';
    }, [as, autosize, mask]);

    const InputElement = createElement(
        inputAs,
        {
            'data-testid': 'input',
            id: inputId,
            value: localValue,
            onChange: handleChange,
            onKeyDown: handleKeyDown,
            onBlur: handleBlur,
            onFocus: handleFocus,
            className: cn(classes.input, { [classes.textarea]: as === 'textarea' }, classNameInput),
            style: as === 'textarea' && resize ? { resize } : undefined,
            autoComplete,
            disabled,
            mask,
            ...(mask ? { alwaysShowMask, beforeMaskedStateChange } : {}),
            ...props,
        },
    );

    useEffect(() => {
        const checkedValue: string | number | undefined = getCheckedValue(value);
        if (checkedValue !== value && value !== undefined) {
            onChange(checkedValue);
        }
        if (
            (isFloat && parseFloat(value as string) !== parseFloat(localValue))
            || (isNumber && parseInt(value as string, 10) !== parseInt(localValue, 10))
        ) {
            const val: number = isFloat ? parseFloat(checkedValue as string) : parseInt(checkedValue as string, 10);
            setLocalValue(!Number.isNaN(val) ? `${val}` : '');
        } else if (!isNumber && !isFloat && checkedValue !== localValue) {
            setLocalValue(checkedValue ? `${checkedValue}` : '');
        } else if (checkedValue !== localValue && checkedValue === value && isNumber) {
            setLocalValue(`${checkedValue}`);
        }
    }, [value, isFloat, localValue, isNumber, getCheckedValue, isPositive, onChange]);

    return (
        <div className={cn(classes.wrap, classNameWrap)}>
            {!!label && (
                <div
                    className={cn(classes.label, classNameLabel, { [classes.label_invalid]: isInvalid && markLabelError })}
                    data-testid="input-label"
                >
                    {label}
                    {tooltip && <Tooltip tooltip={tooltip} />}
                </div>
            )}
            <label
                data-testid="input-label-for"
                htmlFor={inputId}
                className={
                    cn(
                        classes.inputWrap,
                        classNameInputLabel,
                        {
                            [classes.inputWrap_invalid]: isInvalid,
                            [cn(classes.inputWrap_focused, classNameInputLabelFocused)]: focused,
                        },
                    )
                }
            >
                {
                    !!prepend && (
                        <Box
                            className={cn(classes.prepend, classNamePrepend)}
                            data-testid="input-prepend"
                            alignItems="center"
                        >
                            {prepend}
                        </Box>
                    )
                }
                <>
                    {loading
                    && (

                        <Spinner
                            as="span"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            animation="grow"
                            className={classes.loading}
                        />
                    )}
                    {InputElement}
                </>
                {innerTooltip ? (
                    <Tooltip
                        className={classes.tooltip}
                        tooltip={innerTooltip}
                    />
                ) : null}
            </label>
            {showError && (isInvalid && error ? (
                renderError
                    ? renderError(error)
                    : <span data-testid="input-error" className={cn(classes.error, classNameError)}>{error}</span>
            ) : (
                <div data-testid="input-error-empty" className={cn(classes.errorEmpty, classNameErrorEmpty)} />
            ))}
        </div>
    );
});
