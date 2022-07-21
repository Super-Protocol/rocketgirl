import React, { memo, FC } from 'react';
import dayjs from 'dayjs';
import { Outlet } from 'react-router-dom';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ModalOkCancelProvider } from '@/common/context';
import { LoginLayoutProps } from './types';

dayjs.extend(relativeTime);

const LoginLayout: FC<LoginLayoutProps> = () => {
    return (
        <ModalOkCancelProvider>
            <Outlet />
        </ModalOkCancelProvider>
    );
};

export default memo(LoginLayout);
