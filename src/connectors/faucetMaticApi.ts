import CONFIG from '@/config';

export const transferTokens = async (
    address: string,
): Promise<any> => {
    return fetch(
        `${CONFIG.REACT_APP_FAUCET_MATIC_API}/transferTokens`,
        {
            method: 'POST',
            body: JSON.stringify(({ address, network: 'mumbai', token: 'maticToken' })),
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
};
