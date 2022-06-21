import {
    useCallback, useMemo, useRef, useState,
} from 'react';
import { Process, Status } from '@/connectors/orders';

export interface State {
    [process: string]: {
        status: Status,
        error?: Error,
        result?: string;
    };
}

export interface ChangeStateProps {
    process: Process;
    status: Status;
    error?: Error;
    result?: string;
}

export interface UseWorkflowProcessResult {
    state: State;
    progress: number;
    changeState: (props: ChangeStateProps) => void;
    init: (processList: Process[]) => void;
}

export const getInitialState = (processList: Process[]): State => {
    return processList.reduce((acc, process) => ({ ...acc, [process]: { status: Status.QUEUE } }), {});
};

export const useWorkflowProcess = (): UseWorkflowProcessResult => {
    const [state, setState] = useState<State>({});
    const refState = useRef();
    const changeState = useCallback((props: ChangeStateProps) => {
        const { process, ...rest } = props || {};
        setState((s) => ({ ...s, [process]: { ...rest } }));
    }, []);
    const progress = useMemo(() => {
        const entries = Object.entries(state);
        if (!entries.length) return 0;
        return Math.floor((entries.filter(([, { status }]) => status === Status.DONE).length / entries.length) * 100);
    }, [state]);
    const init = useCallback((processList: Process[]) => {
        setState(getInitialState(processList));
    }, []);
    return {
        progress,
        state,
        changeState,
        init,
    };
};
