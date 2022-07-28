export interface DetailsProps {
    id?: string;
}

export type SubOrderInfo = {
    [x: string]: {
        cancelable: boolean;
        orderHoldDeposit: string;
        depositSpent: string;
        holdSum: string;
    };
}
