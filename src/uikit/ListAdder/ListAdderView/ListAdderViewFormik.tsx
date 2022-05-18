import React, { memo, FC, useMemo } from 'react';
import { useField } from 'formik';
import { ListAdderView } from '@/uikit';
import { ListAdderViewFormikProps, Info } from './types';

export const ListAdderViewFormik: FC<ListAdderViewFormikProps<Info>> = memo(({ name, ...rest }) => {
    const [, { value, error }] = useField(name);
    const isInvalid: boolean = useMemo(() => !!error, [error]);
    return <ListAdderView {...rest} values={value} isInvalid={isInvalid} error={error} />;
});
