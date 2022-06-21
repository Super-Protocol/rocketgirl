import { State } from '../hooks/useWorkflowProcess';
import { Status } from '../ProcessStatus/types';
import { CancellingState } from './types';

export const getCancellingState = (state?: State): CancellingState => {
    if (!state) return {};
    return Object.entries(state).reduce((acc, [process, { result }]) => {
        if (!result) return acc;
        if (typeof result === 'string') {
            return {
                ...acc,
                [process]: {
                    status: Status.PROGRESS,
                    value: [result],
                },
            };
        }
        if (result instanceof Map && (result as Map<string, string | null>)?.size) {
            return {
                ...acc,
                [process]: {
                    status: Status.PROGRESS,
                    value: [...result].map(([, orderId]) => orderId).filter((orderId) => orderId),
                },
            };
        }
        return acc;
    }, {});
};
