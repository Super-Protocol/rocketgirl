import { memo } from 'react';
import { useParams } from 'react-router-dom';

import { WalletContextProvider, useWallet } from '@/common/context/WalletProvider';
import { Box } from '@/uikit';
import { Header } from './Header';

const OrderDetails = () => {
    const { id } = useParams();

    const wallet = useWallet();
    return (
        <WalletContextProvider value={wallet}>
            <Box direction="column">
                <Header />
                <div>{id}</div>
            </Box>
        </WalletContextProvider>
    );
};

export default memo(OrderDetails);
