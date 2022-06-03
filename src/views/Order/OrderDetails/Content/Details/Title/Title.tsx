import React, {
    memo,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import { OrderStatus } from '@super-protocol/sp-sdk-js';
import { Box, Button } from '@/uikit';
import { cancelOrder } from '@/connectors/orders';
import { WalletContext } from '@/common/context/WalletProvider';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import classes from './Title.module.scss';
import { TitleProps } from './types';
import { ReplenishOrderModal } from './ReplenishOrderModal';

export const Title = memo<TitleProps>(({ order, orderInfo, updateOrderInfo }) => {
    const { showModal } = useContext(ModalOkCancelContext);
    const { selectedAddress, instance } = useContext(WalletContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const [loading, setLoading] = useState(false);
    const status = useMemo(() => orderInfo?.status, [orderInfo]);
    const isShowCancelBtn = useMemo(() => status && ![OrderStatus.Canceled, OrderStatus.Done].includes(status), [status]);
    const isShowReplenishBtn = useMemo(() => status && ![OrderStatus.Canceled, OrderStatus.Done].includes(status), [status]);

    const onCancelOrder = useCallback(async () => {
        setLoading(true);
        try {
            await cancelOrder({
                orderAddress: order?.address,
                actionAccountAddress: selectedAddress,
                web3: instance,
            });
            await updateOrderInfo();
            showSuccessModal('Order successfully canceled');
        } catch (e) {
            showErrorModal(e);
        }
        setLoading(false);
    }, [showErrorModal, selectedAddress, instance, order, showSuccessModal, updateOrderInfo]);

    const onSuccessReplenish = useCallback(async () => {
        await updateOrderInfo();
    }, [updateOrderInfo]);

    const onReplenishOrder = useCallback(async () => {
        showModal({
            children: <ReplenishOrderModal orderAddress={order?.address} onSuccess={onSuccessReplenish} />,
            messages: {
                header: 'Replenish deposit',
            },
        });
    }, [showModal, order, onSuccessReplenish]);

    const onGetResult = useCallback(async () => {
        setLoading(true);
        // todo
        setLoading(false);
    }, []);

    return (
        <Box justifyContent="space-between" className={classes.wrap}>
            <div className={classes.title}>Order details</div>
            <Box>
                {!!isShowCancelBtn && (
                    <Button
                        variant="tertiary"
                        loading={loading}
                        onClick={onCancelOrder}
                    >
                        Cancel order
                    </Button>
                )}
                {!!isShowReplenishBtn && (
                    <Button
                        variant="quaternary"
                        className={classes.replenishbtn}
                        loading={loading}
                        onClick={onReplenishOrder}
                    >
                        Replenish Deposit
                    </Button>
                )}
                <Button
                    variant="primary"
                    className={classes.resultbtn}
                    loading={loading}
                    onClick={onGetResult}
                    disabled
                >
                    Get Result
                </Button>
            </Box>
        </Box>
    );
});
