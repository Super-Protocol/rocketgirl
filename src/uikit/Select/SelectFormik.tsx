import {
    memo, FC,
} from 'react';
import { SelectUi } from '@/uikit';
import { SelectFormikProps } from './types';
import { useSelectFormik } from './hooks/useSelectFormik';

export const SelectFormik: FC<SelectFormikProps> = memo(({
    name,
    onChange,
    checkTouched,
    error,
    mode,
    ...props
}) => {
    const { value, isInvalid, handleOnChange } = useSelectFormik({
        name,
        error,
        onChange,
        checkTouched,
    });

    return (
        <SelectUi
            {...props}
            name={name}
            value={value}
            error={error}
            isInvalid={isInvalid}
            onChange={handleOnChange}
        />
    );
});
