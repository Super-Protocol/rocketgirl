import {
    memo, FC,
} from 'react';
import { Box } from '@/uikit';
import { Content } from './Content';
import { Header } from './Header';
import { HomeProps } from './types';
import { WalletContextProvider, useWallet } from './context/walletContext';

const Home: FC<HomeProps> = () => {
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

export default memo(Home);
