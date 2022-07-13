/* eslint-disable max-len */
export const transmittalText = 'Please do not reload or close this window until all the processes have been completed. We will open MetaMask and ask you to sign several transactions';

export const gotoOrder = (address?: string): void => {
    if (address) {
        window.open(`/order/${address}`, '_self');
    }
};
