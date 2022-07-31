export enum DepositErrors {
    MIN = 'MIN',
    BALANCE = 'BALANCE'
}

export interface ErrorDepositProps {
    min?: number;
    onClick?: () => void;
    error: DepositErrors;
}
