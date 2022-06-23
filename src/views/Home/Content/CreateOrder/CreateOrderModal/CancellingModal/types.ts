import { Dispatch, SetStateAction } from 'react';
import { CancelOrdersResultError } from '@/connectors/orders';
import { State } from '../hooks/useWorkflowProcess';
import { Status } from '../ProcessStatus/types';

export interface CancellingModalProps {
    state?: State;
}

export interface CancellingState {
    [process: string]: Map<string, { status: Status, error?: Error }>;
}

export interface ChangeStatusProps {
    changeState: Dispatch<SetStateAction<CancellingState>>
    list: CancelOrdersResultError[];
    state: CancellingState;
    status: Status;
}
