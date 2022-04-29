import React, {
    FC, memo, useCallback, useMemo,
} from 'react';
import { Form } from 'react-bootstrap';
import cn from 'classnames';
import { useField } from 'formik';

import { Tooltip } from '@/uikit';
import { CheckboxFormik } from '.';
import { CheckboxGroupProps, themes } from './types';
import { getDisabledName } from './helpers';

import classes from './CheckboxGroup.module.scss';

export const CheckboxGroup: FC<CheckboxGroupProps> = memo(({
    name,
    options,
    tooltip,
    tooltips = {},
    label,
    horizontal = false,
    labelClassName,
    groupClassName,
    formGroupClassName,
    dataTestId,
    limit,
    localState,
    isMulti = true,
    theme = themes.light,
    classNameWrapCheckbox,
    classNameLabelCheckbox,
    classNameCheckboxGroupItem,
    onChange: onChangeProps = () => {},
    withLabelTooltip = false,
}) => {
    const [, { value, error }, { setValue }] = useField(name);
    const isInvalid = useMemo(() => !!error, [error]);
    const disabledName = useMemo(() => (
        limit ? getDisabledName(value, options, limit as number) : undefined
    ), [value, options, limit]);
    const onChange = useCallback((item, isCheck) => {
        setValue({ ...(isMulti ? value : {}), [item.value]: isCheck });
        onChangeProps(item, isCheck);
    }, [isMulti, setValue, value, onChangeProps]);

    return (
        <Form.Group className={formGroupClassName}>
            {label ? (
                <Form.Label className={classes['with-tooltip']}>
                    <span className={cn(classes.label, labelClassName)}>{label}</span>
                    {tooltip && <Tooltip tooltip={tooltip} />}
                </Form.Label>
            ) : null}
            <div
                className={cn(
                    classes['checkbox-group'], {
                        [classes['checkbox-group--horizontal']]: horizontal,
                    },
                    groupClassName,
                )}
                data-testid={dataTestId}
            >
                {options.map((item, i) => (
                    <div className={cn(classes['checkbox-group__item'], classNameCheckboxGroupItem)} key={item.value}>
                        <CheckboxFormik
                            isInvalid={isInvalid}
                            name={`${name}.${item.value}`}
                            label={item.label}
                            disabled={limit ? disabledName?.includes(item.value) : item.disabled}
                            labelURL={item.labelURL && `${item.labelURL}`}
                            tooltip={tooltips[i]}
                            localState={localState}
                            onChange={(isCheck) => onChange(item, isCheck)}
                            theme={theme}
                            classNameWrap={classNameWrapCheckbox}
                            classNameLabel={classNameLabelCheckbox}
                            withLabelTooltip={withLabelTooltip}
                            dataTestId={`${dataTestId}-${item.value}`}
                        />
                    </div>
                ))}
            </div>
        </Form.Group>
    );
});
