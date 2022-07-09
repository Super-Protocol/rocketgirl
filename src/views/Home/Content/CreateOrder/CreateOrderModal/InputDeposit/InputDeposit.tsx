import React, { memo, FC, useCallback } from 'react';
import { useField } from 'formik';
import { Box, InputFormik } from '@/uikit';
import { InputDepositProps } from './types';
import { Fields } from '../types';
import classes from './InputDeposit.module.scss';
import { ErrorDeposit } from './ErrorDeposit';

export const InputDeposit: FC<InputDepositProps> = memo(({ min, classNameWrap }) => {
    const [, { error, touched }, { setValue }] = useField(Fields.deposit);
    const onSetMinDeposit = useCallback(() => {
        setValue(min);
    }, [min, setValue]);
    return (
        <Box direction="column" className={classNameWrap}>
            <InputFormik
                name={Fields.deposit}
                label="Deposit, TEE"
                classNameWrap={classes.inputWrap}
                checkTouched={false}
                showError={false}
            />
            {error && touched && min ? <ErrorDeposit onClick={onSetMinDeposit} min={min} /> : <div className={classes.empty} />}
        </Box>
    );
});
