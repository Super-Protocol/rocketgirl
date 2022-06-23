import { State } from '../hooks/useWorkflowProcess';
import { Status } from '../ProcessStatus/types';
import { CancellingState, ChangeStatusProps } from './types';

export const getCancellingState = (state?: State): CancellingState => {
    if (!state) return {};
    return Object.entries(state).reduce((acc, [process, { result }]) => {
        if (!result) return acc;
        return {
            ...acc,
            [process]: [...result].map(([, orderId]) => orderId).filter((orderId) => orderId).reduce((acc, orderId) => {
                acc.set(orderId, { status: Status.PROGRESS });
                return acc;
            }, new Map()),
        };
    }, {});
};

export const getOrders = (cancellingState: CancellingState, status?: Status): string[] => {
    if (!cancellingState) return [];
    const entries = Object.entries(cancellingState);
    if (!entries.length) return [];
    return entries.reduce((acc, [, map]) => {
        return acc.concat(
            status
                ? [...map]
                    .filter(([, { status: statusFromMap }]) => statusFromMap === status)
                    .map(([orderId]) => orderId)
                : [...map]
                    .map(([orderId]) => orderId),
        );
    }, [] as string[]);
};

export const getProgress = (state: CancellingState): number => {
    const entries = Object.entries(state);
    if (!entries.length) return 0;
    const doneOrders = getOrders(state, Status.DONE);
    const allOrders = getOrders(state);
    if (!allOrders?.length) return 0;
    return Math.floor((doneOrders.length / allOrders.length) * 100);
};

export const changeStatus = ({
    changeState,
    list,
    state,
    status,
}: ChangeStatusProps): void => {
    const entries = Object.entries(state);
    list.forEach(({ value: orderId, error }) => {
        const entry = entries.find(([, map]) => map.get(orderId));
        if (entry) {
            const [process, map] = entry;
            changeState((s) => ({
                ...s,
                [process]: new Map([...map]).set(orderId, { status, error }),
            }));
        }
    });
};
