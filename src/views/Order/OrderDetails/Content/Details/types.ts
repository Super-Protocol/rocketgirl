export interface DetailsProps {
    id: string;
}

export type SubOrderInfo = {
    [x: string]: {
        cancelable: boolean;
        orderHoldDeposit: number;
    };
}
