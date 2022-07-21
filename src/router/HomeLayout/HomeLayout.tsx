import React, { memo, FC } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { WalletContextProvider } from '@/common/context';
import { useBlockchainConnector } from '@/common/hooks/useBlockchainConnector';
import { Spinner } from '@/uikit';
import { HomeLayoutProps } from './types';

dayjs.extend(relativeTime);

const HomeLayout: FC<HomeLayoutProps> = ({ children }) => {
    const init = useBlockchainConnector();
    if (!init) return <Spinner fullscreen />;
    return (
        <WalletContextProvider>
            {children}
        </WalletContextProvider>
    );
};

export default memo(HomeLayout);
