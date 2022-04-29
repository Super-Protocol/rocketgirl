import { useCallback, useState } from 'react';
import BlockchainConnector from '@super-protocol/sp-sdk-js';
import { useMount } from 'react-use';
import toastr from '@/services/Toastr/toastr';
import CONFIG from '@/config';

export const useBlockchainConnector = (): boolean => {
    const [isInit, setIsInit] = useState(false);
    const init = useCallback(async () => {
        try {
            await BlockchainConnector.init({
                blockchainUrl: CONFIG.REACT_APP_BLOCKCHAIN_URL,
                contractAddress: CONFIG.REACT_APP_SP_MAIN_CONTRACT_ADDRESS,
                gasPrice: CONFIG.REACT_APP_SP_GAS_PRICE,
                gasLimit: CONFIG.REACT_APP_SP_GAS_LIMIT,
            });
        } catch (e) {
            toastr.error(e);
        }
        setIsInit(true);
    }, []);
    useMount(() => {
        init();
    });
    return isInit;
};
