import { Status } from '../ProcessStatus/types';

export interface ProcessItemProps {
    name: string;
    status: Status;
    className?: string;
    error?: Error;
}
