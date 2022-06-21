import React, {
    memo,
    FC,
    useCallback,
    useContext, useState,
} from 'react';
import { useMount } from 'react-use';
import { Box } from '@/uikit';
import { WalletContext } from '@/common/context';
import { cancelOrders, Process } from '@/connectors/orders';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { CancellingModalProps, CancellingState } from './types';
import { State } from '../hooks/useWorkflowProcess';
import classes from './CancellingModal.module.scss';
import { ProcessItem } from '../ProcessItem';
import { getCancellingState } from './helpers';

export const CancellingModal: FC<CancellingModalProps> = memo(({ state }) => {
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const { selectedAddress, instance } = useContext(WalletContext);
    const [cancellingState] = useState(() => getCancellingState(state));
    const runCancelOrders = useCallback(async (cancellingState?: CancellingState) => {
        // if (!cancellingState) return;
        // if (orders.length && selectedAddress && instance) {
        //     try {
        //         const { success, error } = await cancelOrders({
        //             canceledOrders: orders,
        //             web3: instance,
        //             actionAccountAddress: selectedAddress,
        //         });
        //         showSuccessModal(
        //             `${success.length ? `Success canceled orders: ${success.map(({ value }) => value).join(', ')}` : ''}
        //             ${error?.length ? `\nError canceled orders: ${error.map(({ value }) => value)?.join(', ')}` : ''}`,
        //         );
        //     } catch (e) {
        //         showErrorModal(e);
        //     }
        // }
    }, [selectedAddress, instance, showErrorModal, showSuccessModal]);
    useMount(() => {
        runCancelOrders(cancellingState);
    });
    return (
        <Box direction="column" className={classes.wrap}>
            <Box className={classes.body} direction="column">
                <div className={classes.title}>Cancelling...</div>
                <div className={classes.mrb}>Please sign transactions to get deposit back</div>
                {!!cancellingState?.[Process.TEE] && (
                    <ProcessItem
                        name="Tee order"
                        className={classes.mrb}
                        status={cancellingState?.[Process.TEE]?.status}
                        error={cancellingState?.[Process.TEE]?.error}
                    />
                )}
            </Box>
        </Box>
    );
});
