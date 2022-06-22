import { State } from '../hooks/useWorkflowProcess';
import { Status } from '../ProcessStatus/types';
import { CancellingState } from './types';

export const getCancellingState = (state?: State): CancellingState => {
    if (!state) return {};
    return Object.entries(state).reduce((acc, [process, { result }]) => {
        if (!result) return acc;
        return {
            ...acc,
            [process]: {
                status: Status.PROGRESS,
                value: [...result].map(([, orderId]) => orderId).filter((orderId) => orderId),
            },
        };
    }, {});
};
