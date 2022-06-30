import React, {
    FC, memo, useState, SyntheticEvent, useMemo, useCallback,
} from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { v1 as uuidv1 } from 'uuid';

import { ReactComponent as CheckmarkIcon } from '@/assets/icons/checkmark.svg';
import { Tooltip, Box } from '@/uikit';
import { calcLabelLimit } from './helpers';
import { CheckboxUiProps, themes } from './types';
import classes from './CheckboxUi.module.scss';

export const CheckboxUi: FC<CheckboxUiProps> = memo(({
    label,
    tooltip,
    labelURL,
    checked = false,
    disabled,
    semi,
    onChange = () => {},
    onClick = () => {},
    isInvalid,
    name,
    classNameWrap,
    classNameLabel,
    classNameCheckboxCheckmark,
    classNameError,
    labelClickDisabled,
    dataTestId,
    theme = themes.orange,
    labelLimit,
    localState,
    withLabelTooltip = false,
    showError,
    error,
    ...rest
}) => {
    const [nameFor] = useState(name || uuidv1());

    const handleOnClick = useCallback((e: SyntheticEvent) => {
        if (labelClickDisabled) {
            e.preventDefault();
            onClick();
        }
    }, [labelClickDisabled, onClick]);

    const renderLabel = useMemo(() => {
        if (labelLimit && typeof label === 'string' && label.length > labelLimit) {
            return calcLabelLimit(label, labelLimit);
        }
        return label;
    }, [labelLimit, label]);

    const renderTooltip = useMemo(() => {
        if (tooltip) {
            return tooltip;
        }

        if (withLabelTooltip) {
            return renderLabel;
        }

        return undefined;
    }, [tooltip, withLabelTooltip, renderLabel]);

    return (
        <Box direction="column">
            <label
                className={cn(classes.checkbox, classNameWrap, { [classes.disabled]: disabled })}
                htmlFor={nameFor}
                data-testid={dataTestId}
            >
                <input
                    id={nameFor}
                    name={nameFor}
                    checked={checked}
                    type="checkbox"
                    disabled={disabled}
                    className={classes.checkbox__control}
                    onChange={(evt) => {
                        if (!disabled) {
                            onChange(evt.target.checked, evt);
                        }
                    }}
                    {...rest}
                />
                <i className={cn(classes.checkbox__checkmark, classes[theme], classNameCheckboxCheckmark,
                    { [classes.checkbox__checkmark_invalid]: isInvalid },
                    { [classes.checkbox__checkmark_disabled]: disabled },
                    { [classes.checkbox__checkmark_semi]: semi })}
                >
                    <CheckmarkIcon />
                </i>
                <span
                    className={cn(classes.checkbox__label,
                        classNameLabel,
                        { [classes.checkbox__label_invalid]: isInvalid },
                        { [classes.checkbox__label_disabled]: disabled })}
                    data-testid="checkbox-label"
                    onClick={handleOnClick}
                >
                    {labelURL ? (
                        <Link to={{ pathname: labelURL, state: { from: document.location.pathname, localState } }}>
                            {label}
                        </Link>
                    ) : (
                        <>
                            {
                                renderTooltip && (
                                    <Tooltip tooltip={renderTooltip} classNamePopoverChildren={classes.labelTooltip}>
                                        {renderLabel}
                                    </Tooltip>
                                )
                            }
                            {
                                !renderTooltip && renderLabel
                            }
                        </>
                    )}
                </span>
            </label>
            {showError && isInvalid && error && (
                <span data-testid="checkbox-error" className={cn(classes.error, classNameError)}>{error}</span>
            )}
        </Box>
    );
});
