import React, { memo, FC, useMemo } from 'react';
import { StatusBar as StatusBarUi } from '@/uikit';
import { getOrderStatusName } from '@/common/helpers';
import { StatusBarProps } from './types';
import { getStatusBarColor, getIsSpinner } from './helpers';

export const StatusBar: FC<StatusBarProps> = memo(({ status }) => {
    const statusBar = useMemo(() => ({
        color: getStatusBarColor(status),
        text: getOrderStatusName(status),
        isSpinner: getIsSpinner(status),
    }), [status]);
    return (
        <StatusBarUi
            color={statusBar.color}
            isSpinner={statusBar.isSpinner}
            isStatus={!statusBar.isSpinner}
        >
            {statusBar.text}
        </StatusBarUi>
    );
});
