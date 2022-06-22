import React, {
    memo,
    FC,
    useCallback,
    useContext,
    useState, useMemo,
} from 'react';
import { useMount } from 'react-use';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { WalletContext } from '@/common/context';
import { Box, Button, ProgressBar } from '@/uikit';
import { Process, cancelOrders } from '@/connectors/orders';
import { CancellingModalProps } from './types';
import classes from './CancellingModal.module.scss';
import { ProcessItem } from '../ProcessItem';
import { getCancellingState, getProgress, changeStatus } from './helpers';
import { Status } from '../ProcessStatus/types';

export const CancellingModal: FC<CancellingModalProps> = memo(({ state }) => {
    const { selectedAddress, instance } = useContext(WalletContext);
    const { showSuccessModal } = useErrorModal();
    const [loading, setLoading] = useState(true);
    const [cancellingState, changeCancellingState] = useState(() => getCancellingState(state));
    const progress = useMemo(() => getProgress(cancellingState), [cancellingState]);
    const runCancelOrders = useCallback(async () => {
        if (!cancellingState || !Object.entries(cancellingState).length) return;
        const entries = Object.entries(cancellingState);
        const canceledOrders = entries
            .reduce((acc, [, map]) => {
                return acc.concat([...map].filter(([, { status }]) => status !== Status.DONE).map(([orderId]) => orderId));
            }, [] as string[]);
        if (canceledOrders.length && selectedAddress && instance) {
            try {
                setLoading(true);
                changeCancellingState((s) => {
                    const entries = Object.entries(s);
                    return entries.reduce((acc, [process, map]) => {
                        const canceledOrdersInProcess = canceledOrders.filter((orderId) => map.get(orderId));
                        return {
                            ...acc,
                            [process]: canceledOrdersInProcess.reduce((acc, orderId) => {
                                map.set(orderId, { status: Status.PROGRESS });
                                return map;
                            }, map),
                        };
                    }, {});
                });
                const { success, error } = await cancelOrders({
                    canceledOrders,
                    web3: instance,
                    actionAccountAddress: selectedAddress,
                });
                changeStatus({
                    list: success,
                    state: cancellingState,
                    changeState: changeCancellingState,
                    status: Status.DONE,
                });
                changeStatus({
                    list: error,
                    state: cancellingState,
                    changeState: changeCancellingState,
                    status: Status.ERROR,
                });
                if (!error?.length) {
                    showSuccessModal('Your orders has been successfully canceled');
                }
            } catch (e) {
                console.warn('Cancelling error: ', e);
            } finally {
                setLoading(false);
            }
        }
    }, [selectedAddress, instance, cancellingState, showSuccessModal]);
    const getStatus = useCallback((process: Process) => {
        const processItem = cancellingState?.[process];
        if (!processItem) return Status.ERROR;
        if ([...processItem].every(([, { status }]) => status === Status.DONE)) {
            return Status.DONE;
        }
        if ([...processItem].some(([, { status }]) => status === Status.ERROR)) {
            return Status.ERROR;
        }
        if ([...processItem].some(([, { status }]) => status === Status.PROGRESS)) {
            return Status.PROGRESS;
        }
        return Status.QUEUE;
    }, [cancellingState]);
    const getError = useCallback((process: Process) => {
        const processItem = cancellingState?.[process];
        if (!processItem) return undefined;
        const errorProcessEntry = [...processItem].find(([, { status }]) => status === Status.ERROR);
        return errorProcessEntry ? errorProcessEntry?.[1]?.error : undefined;
    }, [cancellingState]);
    useMount(() => {
        runCancelOrders();
    });
    return (
        <Box direction="column" className={classes.wrap}>
            <ProgressBar progress={progress} />
            <Box className={classes.body} direction="column">
                <div className={classes.title}>Cancelling...</div>
                <div className={classes.mrb}>Please sign transactions to get deposit back</div>
                {!!cancellingState?.[Process.TEE] && (
                    <ProcessItem
                        name="Tee order"
                        className={classes.mrb}
                        status={getStatus(Process.TEE)}
                        error={getError(Process.TEE)}
                    />
                )}
                {!!cancellingState?.[Process.DATA] && (
                    <ProcessItem
                        name="Solution order"
                        className={classes.mrb}
                        status={getStatus(Process.DATA)}
                        error={getError(Process.DATA)}
                    />
                )}
                {!!cancellingState?.[Process.SOLUTION] && (
                    <ProcessItem
                        name="Solution order"
                        className={classes.mrb}
                        status={getStatus(Process.SOLUTION)}
                        error={getError(Process.SOLUTION)}
                    />
                )}
                {!!cancellingState?.[Process.STORAGE] && (
                    <ProcessItem
                        name="Storage order"
                        className={classes.mrb}
                        status={getStatus(Process.STORAGE)}
                        error={getError(Process.STORAGE)}
                    />
                )}
                <Box justifyContent="flex-end" className={classes.btns}>
                    {!loading && (
                        <Button
                            variant="primary"
                            onClick={runCancelOrders}
                        >
                            Try again
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
});
