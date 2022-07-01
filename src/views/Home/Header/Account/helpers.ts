import { BigNumber } from 'bignumber.js';

export const getBalanceView = (balance: string | null): string => {
    return balance ? new BigNumber(balance).toFixed(3) : '-';
};
