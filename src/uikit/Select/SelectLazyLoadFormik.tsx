import {
    memo,
    FC,
} from 'react';
import { SelectLazyLoadUi } from '@/uikit';
import { SelectLazyLoadFormikProps } from './types';
import { useSelectFormik } from './hooks/useSelectFormik';

export const SelectLazyLoadFormik: FC<SelectLazyLoadFormikProps> = memo(({
    name,
    onChange,
    checkTouched,
    error,
    mode,
    fetcher,
    ...props
}) => {
    const { value, isInvalid, handleOnChange } = useSelectFormik({
        name,
        error,
        onChange,
        checkTouched,
    });
    if (!fetcher) return null;

    return (
        <SelectLazyLoadUi
            {...props}
            name={name}
            value={value}
            error={error}
            isInvalid={isInvalid}
            onChange={handleOnChange}
            mode="async-query"
            fetcher={fetcher}
        />
    );
});
