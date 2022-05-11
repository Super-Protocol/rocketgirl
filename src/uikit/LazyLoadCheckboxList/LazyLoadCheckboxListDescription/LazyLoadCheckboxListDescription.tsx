import React, { memo, FC } from 'react';
import { Box } from '@/uikit';
import { LazyLoadCheckboxListDescriptionProps } from './types';

// todo hide, if more than 150 characters
export const LazyLoadCheckboxListDescription: FC<LazyLoadCheckboxListDescriptionProps> = memo(({ classNameWrap, value }) => {
    return <Box className={classNameWrap}>{value}</Box>;
});
