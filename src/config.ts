/* eslint-disable max-len */
import { getConfigWithEnv } from '@/utils/env';

export type Config = {
    // base app config
    REACT_APP_API_ENDPOINT?: string;
    REACT_APP_POLYGON_SCAN: string;
    REACT_APP_BLOCKCHAIN_URL?: string;
    REACT_APP_CHAIN_ID?: string;
    REACT_APP_SP_MAIN_CONTRACT_ADDRESS: string;
    REACT_APP_SP_GAS_PRICE: string;
    REACT_APP_SP_GAS_LIMIT: number;
    REACT_APP_FILE_PATH: string,
    REACT_APP_FAUCET_MATIC_API: string,
    REACT_APP_MATIC_ADDRESS: string,
};

const DEFAULT_CONFIG: Config = {
    // base app config
    REACT_APP_API_ENDPOINT: '',
    REACT_APP_SP_MAIN_CONTRACT_ADDRESS: '0x4c0801aaaD2f1e01b73560f9fE4b4300a4438E34',
    REACT_APP_MATIC_ADDRESS: '0x0b43a08e13cf0a22e7286c73de73e8a076aa82a6',
    REACT_APP_POLYGON_SCAN: 'https://mumbai.polygonscan.com/tx',
    REACT_APP_CHAIN_ID: '0x13881',
    REACT_APP_BLOCKCHAIN_URL: 'wss://wandering-snowy-sun.matic-testnet.quiknode.pro/98e3f8f8fe7ef3c53743ba59fbe6fd6771638d61/',
    REACT_APP_SP_GAS_PRICE: '30000000000',
    REACT_APP_SP_GAS_LIMIT: 7000000,
    REACT_APP_FILE_PATH: 'https://link.eu1.storjshare.io/raw/jxfrrjqfuuds2im76fc4zlbc4wya',
    REACT_APP_FAUCET_MATIC_API: 'https://api.faucet.matic.network',
};

const CONFIG: Config = getConfigWithEnv<Config>(
    DEFAULT_CONFIG,
);

export default CONFIG;
