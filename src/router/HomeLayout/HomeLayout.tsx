import React, { memo, FC } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Outlet } from 'react-router-dom';
import { RouteGuard } from '@/router/RouteGuard';
import { ModalOkCancelProvider, WalletContextProvider } from '@/common/context';
import { useBlockchainConnector } from '@/common/hooks/useBlockchainConnector';
import { AccessTokenAndWalletChecker } from '@/common/components/AccessTokenAndWalletChecker';
import { Spinner } from '@/uikit';
import { HomeLayoutProps } from './types';

dayjs.extend(relativeTime);

const HomeLayout: FC<HomeLayoutProps> = ({ children }) => {
    const init = useBlockchainConnector();
    if (!init) return <Spinner fullscreen />;
    return (
        <RouteGuard>
            <WalletContextProvider>
                <ModalOkCancelProvider>
                    <AccessTokenAndWalletChecker>
                        <Outlet />
                    </AccessTokenAndWalletChecker>
                </ModalOkCancelProvider>
            </WalletContextProvider>
        </RouteGuard>
    );
};

export default memo(HomeLayout);
