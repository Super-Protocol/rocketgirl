import React, { FC, memo, useMemo } from 'react';
import { useField } from 'formik';

import { CheckboxUi } from '.';
import { CheckboxFormikProps } from './types';

export const CheckboxFormik: FC<CheckboxFormikProps> = memo(({
    isInvalid: isInvalidProp,
    name,
    checkTouched = true,
    onChange = () => {},
    ...rest
}) => {
    const [, { value, error, touched }, { setValue }] = useField(name);
    const isInvalid: boolean = useMemo(() => !!(error && (!checkTouched || touched)) || !!isInvalidProp,
        [error, touched, checkTouched, isInvalidProp]);

    return (
        <CheckboxUi
            {...rest}
            isInvalid={isInvalid}
            checked={!!value}
            onChange={(val) => {
                setValue(val);
                onChange(val);
            }}
            name={name}
        />
    );
});
