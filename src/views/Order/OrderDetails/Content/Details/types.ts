export interface DetailsProps {
    id: string;
}

export type SubOrderInfo = {
    [x: string]: {
        cancellable: boolean;
        orderHoldDeposit: number;
    };
}
