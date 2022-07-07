import React, { memo, FC, useMemo } from 'react';
import { useField } from 'formik';
import { ListAdderView } from '@/uikit';
import { ListAdderViewFormikProps, Info } from './types';

export const ListAdderViewFormik: FC<ListAdderViewFormikProps<Info>> = memo(({ name, checkTouched = true, ...rest }) => {
    const [, { value, error, touched }] = useField(name);
    const isInvalid: boolean = useMemo(() => !!(error && (!checkTouched || touched)),
        [error, touched, checkTouched]);
    return <ListAdderView {...rest} values={value} isInvalid={isInvalid} error={error} name={name} />;
});
