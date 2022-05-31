import {
    memo, FC, useEffect,
} from 'react';
import Web3 from 'web3';
import eccrypto from 'eccrypto';
import { Box } from '@/uikit';
import { generateKeys } from '@/utils/crypto';
import { getBase64FromHex } from '@/common/helpers';
import { Content } from './Content';
import { Header } from './Header';
import { HomeProps } from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bip39 = require('bip39');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

const Home: FC<HomeProps> = () => {
    useEffect(() => {
        const mnemonic = bip39.generateMnemonic(256);
        const privateKey = Buffer.from(mnemonic.slice(0, 32));
        const publicKey = eccrypto.getPublic(privateKey);
        const privateKeyBase64 = privateKey.toString('base64');
        const publicKeyBase64 = publicKey.toString('base64');
        // console.log('generateKeys', generateKeys(bip39.generateMnemonic()));
        // console.log('crypto', crypto);
        // const mnemonic = bip39.generateMnemonic().slice(0, 32);
        // console.log('bip39', bip39);
        // console.log('m', mnemonic, Buffer.from(mnemonic));
    }, []);
    return (
        <Box direction="column">
            <Header />
            <Content />
        </Box>
    );
};

export default memo(Home);
