import {
    memo,
    FC,
    useMemo,
    useCallback,
} from 'react';
import cn from 'classnames';
import Select, { OnChangeValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { AsyncPaginate } from 'react-select-async-paginate';
import { Tooltip } from '@/uikit';
import {
    SelectUiProps,
    Value,
    Item,
} from './types';
import classes from './SelectUi.module.scss';
import { styles } from './helpers';

export const SelectUi: FC<SelectUiProps> = memo(({
    isInvalid = false,
    name,
    options,
    isMulti = false,
    loading,
    disabled = false,
    isNumber = false,
    showError = true,
    error,
    placeholder,
    defaultValue = '',
    label,
    getValue: customGetValue,
    onChange = (): void => {},
    onCreate = (): void => {},
    value,
    classNameError,
    classNameErrorEmpty,
    classNameLabel,
    classNameWrap,
    classNameSelect,
    tooltip,
    tooltipComponent,
    isClearable = false,
    classNamePrefix,
    customStyles = {},
    components,
    menuPlacement = 'auto',
    dataTestId = '',
    mode = 'default',
    defaultOptions,
    ...props
}) => {
    const Component = useMemo(() => {
        switch (mode) {
            case 'create':
                return CreatableSelect;
            case 'async':
            case 'async-query':
                return AsyncPaginate as any; // todo
            default:
                return Select;
        }
    }, [mode]);
    const getValue = useMemo<Item | Item[] | Value | Value[]>(() => {
        const checkedOptions = options || defaultOptions;
        if (checkedOptions) {
            return isMulti
                ? checkedOptions.filter(
                    (option) => value && (value as Value[]).indexOf(isNumber ? Number(option.value) : option.value) >= 0,
                )
                : checkedOptions.find((option) => option?.value === value)
                || defaultValue;
        }
        return isMulti ? ([] as Item[]) : isNumber ? undefined : '';
    }, [defaultValue, isMulti, isNumber, options, value, defaultOptions]);

    const handleChange = useCallback((values?: OnChangeValue<Item, true> | OnChangeValue<Item, false>) => {
        if (isMulti) {
            onChange(values ? (values as Item[]).map((item) => (isNumber ? Number(item.value) : item.value)) : []);
        } else {
            onChange((values as Item)?.value);
        }
    }, [isMulti, onChange, isNumber]);

    const hasDataTestId = useMemo(() => (dataTestId ? `${dataTestId}-` : dataTestId), [dataTestId]);

    const selectValue = useMemo(() => customGetValue || getValue, [customGetValue, getValue]);

    const onCreateOption = useCallback((val) => {
        onCreate(val);
        onChange(val);
    }, [onChange, onCreate]);

    const noOptionsMessage = useCallback(({ inputValue }) => (inputValue ? 'Nothing found' : 'Enter search string'), []);

    const loadingMessage = useCallback(() => 'Loading...', []);

    return (
        <div
            className={cn(classes.wrap, classNameWrap, { [classes.invalid]: isInvalid })}
            data-testid={`${hasDataTestId}select-wrap`}
        >
            {!!label && (
                <div className={cn(classes.label, classNameLabel)} data-testid={`${hasDataTestId}select-label`}>
                    {label}
                    {tooltip && <Tooltip tooltip={tooltip} />}
                    {tooltipComponent}
                </div>
            )}
            <Component
                name={name}
                className={cn(classes.select, classNameSelect)}
                classNamePrefix={classNamePrefix || 'select-ui-prefix'}
                value={selectValue}
                onChange={handleChange}
                options={options}
                defaultOptions={defaultOptions}
                isMulti={isMulti}
                placeholder={placeholder !== undefined ? placeholder : 'Choose values...'}
                styles={useMemo(() => ({ ...styles, ...customStyles }) as any, [customStyles])}
                isLoading={loading}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                isDisabled={disabled}
                isClearable={isClearable}
                components={components}
                menuPlacement={menuPlacement}
                onCreateOption={onCreateOption}
                {...props}
            />
            {showError && (isInvalid && error ? (
                <span className={cn(classes.error, classNameError)} data-testid={`${hasDataTestId}select-error`}>{error}</span>
            ) : (
                <div className={cn(classes.errorEmpty, classNameErrorEmpty)} data-testid={`${hasDataTestId}select-error-empty`} />
            ))}
        </div>
    );
});
