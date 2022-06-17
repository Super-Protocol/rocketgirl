export enum Status {
    QUEUE = 'QUEUE',
    IN_PROGRESS = 'IN_PROGRESS',
    CREATED = 'CREATED',
}

export interface ProcessStatusProps {
    status: Status;
    className?: string;
}
