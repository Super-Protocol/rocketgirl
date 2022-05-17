import React, { memo, FC } from 'react';
import { UseTablesSkipType } from '@/views/Home/hooks/useTables';
import { NoAccountBlock } from '@/common/components/NoAccountBlock';
import { SkipBlockProps } from './types';

export const SkipBlock: FC<SkipBlockProps> = memo(({ skip }) => {
    switch (skip?.type) {
        case UseTablesSkipType.wallet:
            return <NoAccountBlock />;
        default:
            return null;
    }
});
