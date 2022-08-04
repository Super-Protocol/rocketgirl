import React, { memo, FC, useCallback } from 'react';
import { useField } from 'formik';
import { Box, InputFormik } from '@/uikit';
import { InputDepositProps } from './types';
import { Fields } from '../types';
import classes from './InputDeposit.module.scss';
import { ErrorDeposit } from './ErrorDeposit';
import { DepositErrors } from './ErrorDeposit/types';

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
                markLabelError={false}
                isNumber
            />
            {
                error && touched
                    ? <ErrorDeposit onClick={onSetMinDeposit} min={min} error={error as DepositErrors} />
                    : <div className={classes.empty} />
            }
        </Box>
    );
});
