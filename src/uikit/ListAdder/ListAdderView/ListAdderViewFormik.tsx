import React, { memo, FC } from 'react';
import { useField } from 'formik';
import { ListAdderView } from '@/uikit';
import { ListAdderViewFormikProps } from './types';

export const ListAdderViewFormik: FC<ListAdderViewFormikProps> = memo(({ name, ...rest }) => {
    const [, { value }] = useField(name);
    return <ListAdderView {...rest} values={value} />;
});
