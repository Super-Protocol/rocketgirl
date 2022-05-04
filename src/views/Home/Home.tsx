import {
    memo, FC,
} from 'react';
import { Box } from '@/uikit';
import { ModalOkCancelProvider } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { Content } from './Content';
import { Header } from './Header';
import { HomeProps } from './types';
import { WalletContextProvider, useWallet } from './context/walletContext';

const Home: FC<HomeProps> = () => {
    const wallet = useWallet();
    return (
        <WalletContextProvider value={wallet}>
            <ModalOkCancelProvider>
                <Box direction="column">
                    <Header />
                    <Content />
                </Box>
            </ModalOkCancelProvider>
        </WalletContextProvider>
    );
};

export default memo(Home);
