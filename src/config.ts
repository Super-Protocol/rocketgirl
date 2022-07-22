/* eslint-disable max-len */
import { getConfigWithEnv } from '@/utils/env';

export type Config = {
    // base app config
    REACT_APP_API_ENDPOINT: string;
    REACT_APP_AUTH: string;
    REACT_APP_BLOCKCHAIN_URL: string;
    REACT_APP_IS_USE_PROXY?: string;
    REACT_APP_SP_MAIN_CONTRACT_ADDRESS: string;
    REACT_APP_SP_GAS_PRICE: string;
    REACT_APP_SP_GAS_LIMIT: number;
    REACT_APP_FAUCET_MATIC_API: string;
    REACT_APP_S3_UPLOAD_ACCESS_KEY_ID: string;
    REACT_APP_S3_UPLOAD_ACCESS_SECRET_KEY: string;
    REACT_APP_S3_DOWNLOAD_ACCESS_KEY_ID: string;
    REACT_APP_S3_DOWNLOAD_ACCESS_SECRET_KEY: string;
    REACT_APP_S3_ENDPOINT: string;
    REACT_APP_ARGS_BUCKET_READ_ACCESS: string;

    // network
    REACT_APP_NETWORK_CHAIN_ID: number;
    REACT_APP_NETWORK_NAME: string;
    REACT_APP_NETWORK_RPC: string;
    REACT_APP_NETWORK_TEE_TOKEN: string;
    REACT_APP_NETWORK_POLYGON_SCAN: string;
};

const DEFAULT_CONFIG: Config = {
    // base app config
    REACT_APP_API_ENDPOINT: '',
    REACT_APP_AUTH: '',
    REACT_APP_SP_MAIN_CONTRACT_ADDRESS: '0xc03fcA4dC2BBaC4a48fB2A68b65b70204e0bF801',
    REACT_APP_BLOCKCHAIN_URL: 'wss://wandering-snowy-sun.matic-testnet.quiknode.pro/98e3f8f8fe7ef3c53743ba59fbe6fd6771638d61/',
    REACT_APP_SP_GAS_PRICE: '60000000000',
    REACT_APP_SP_GAS_LIMIT: 7000000,
    REACT_APP_FAUCET_MATIC_API: 'https://api.faucet.matic.network',
    REACT_APP_S3_UPLOAD_ACCESS_KEY_ID: '',
    REACT_APP_S3_UPLOAD_ACCESS_SECRET_KEY: '',
    REACT_APP_S3_DOWNLOAD_ACCESS_KEY_ID: '',
    REACT_APP_S3_DOWNLOAD_ACCESS_SECRET_KEY: '',
    REACT_APP_ARGS_BUCKET_READ_ACCESS: '',
    REACT_APP_S3_ENDPOINT: 'https://gateway.storjshare.io',

    // network settings
    REACT_APP_NETWORK_POLYGON_SCAN: 'https://mumbai.polygonscan.com',
    REACT_APP_NETWORK_RPC: 'https://matic-mumbai.chainstacklabs.com',
    REACT_APP_NETWORK_CHAIN_ID: 80001,
    REACT_APP_NETWORK_NAME: 'Matic Testnet Mumbai',
    REACT_APP_NETWORK_TEE_TOKEN: '0x9B8cCA544255c61116513414817A774908925bB1',
};

const CONFIG: Config = getConfigWithEnv<Config>(
    DEFAULT_CONFIG,
);

export default CONFIG;
