export enum Status {
    QUEUE = 'QUEUE',
    PROGRESS = 'PROGRESS',
    DONE = 'DONE',
    ERROR = 'ERROR',
}

export interface ProcessStatusProps {
    status: Status;
    className?: string;
}
