import { State } from '../hooks/useWorkflowProcess';
import { Status } from '../ProcessStatus/types';

export interface CancellingModalProps {
    state?: State;
}

export interface CancellingState {
    [process: string]: {
        status: Status.PROGRESS,
        value: string[];
        error?: Error;
    }
}
