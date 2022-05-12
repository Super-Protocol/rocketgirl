import { memo } from 'react';

import { WalletContextProvider, useWallet } from '@/common/context/WalletProvider';
import { Box } from '@/uikit';
import { Header } from './Header';
import { Content } from './Content';

const OrderDetails = () => {
    const wallet = useWallet();
    return (
        <WalletContextProvider value={wallet}>
            <Box direction="column">
                <Header />
                <Content />
            </Box>
        </WalletContextProvider>
    );
};

export default memo(OrderDetails);
