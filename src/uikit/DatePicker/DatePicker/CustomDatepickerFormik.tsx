import { FC, useCallback, memo } from 'react';
import { useField } from 'formik';

import { CustomDatePickerFormikProps } from '../types';
import { CustomDatepickerUI } from './CustomDatepickerUI';

export const CustomDatepickerFormik: FC<CustomDatePickerFormikProps> = memo(({ name, ...props }) => {
    const [, { value, error, touched }, { setValue }] = useField(name);

    const onChange = useCallback((value) => {
        setValue(value);
    }, [setValue]);

    return (
        <CustomDatepickerUI
            value={value}
            error={error}
            touched={touched}
            onChange={onChange}
            {...props}
        />
    );
});
