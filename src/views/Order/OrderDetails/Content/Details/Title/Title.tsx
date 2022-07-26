import React, {
    memo,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import { OrderStatus, Order } from '@super-protocol/sp-sdk-js';
import { Box, Button } from '@/uikit';
import { cancelOrder } from '@/connectors/orders';
import { WalletContext } from '@/common/context/WalletProvider';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import classes from './Title.module.scss';
import { TitleProps } from './types';
import { ReplenishOrderModal } from './ReplenishOrderModal';
import { GetResultModal } from './GetResultModal';

export const Title = memo<TitleProps>(({
    order, orderSdk, updateOrderInfo, subOrdersList, unspentDeposit,
}) => {
    const { showModal } = useContext(ModalOkCancelContext);
    const { selectedAddress, instance } = useContext(WalletContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const [loading, setLoading] = useState(false);
    const status = useMemo(() => orderSdk?.orderInfo?.status, [orderSdk]);
    const isShowCancelBtn = useMemo(() => !!status && ![
        OrderStatus.Canceled,
        OrderStatus.Done,
        OrderStatus.Canceling,
        OrderStatus.Error,
    ].includes(status), [status]);
    const isShowReplenishBtn = useMemo(() => !!status && ![
        OrderStatus.Canceled,
        OrderStatus.Done,
        OrderStatus.Canceling,
        OrderStatus.Error,
    ].includes(status), [status]);
    const isShowWithdrawBtn = useMemo(() => {
        const {
            orderInfo: orderInfoSdk,
        } = orderSdk || {};
        const { status } = orderInfoSdk || {};
        return !!status && [
            OrderStatus.Canceled,
            OrderStatus.Done,
            OrderStatus.Error,
            OrderStatus.Canceling,
        ].includes(status) && !!unspentDeposit?.isGreaterThan?.(0);
    }, [orderSdk, unspentDeposit]);
    const isShowResultBtn = useMemo(
        () => !!status && [OrderStatus.Done, OrderStatus.Error].includes(status),
        [status],
    );

    const onCancelOrder = useCallback(async () => {
        setLoading(true);
        try {
            await cancelOrder({
                orderAddress: order?.id,
                subOrdersList,
                actionAccountAddress: selectedAddress,
                web3: instance,
            });
            await updateOrderInfo();
            showSuccessModal('Order cancellation process started');
        } catch (e) {
            showErrorModal(e);
        }
        setLoading(false);
    }, [showErrorModal, selectedAddress, instance, order, showSuccessModal, updateOrderInfo, subOrdersList]);

    const onSuccessReplenish = useCallback(async () => {
        await updateOrderInfo();
    }, [updateOrderInfo]);

    const onReplenishOrder = useCallback(async () => {
        showModal({
            children: <ReplenishOrderModal orderAddress={order?.id} onSuccess={onSuccessReplenish} />,
            messages: {
                header: 'Replenish deposit',
            },
        });
    }, [showModal, order, onSuccessReplenish]);

    const onGetResult = useCallback(async () => {
        showModal({
            children: <GetResultModal orderAddress={order?.id} status={status} />,
        });
    }, [showModal, order, status]);

    const onWithdrawDeposit = useCallback(async () => {
        setLoading(true);
        try {
            await new Order(order?.id).withdrawChange({ from: selectedAddress, web3: instance });
            showSuccessModal('Withdraw deposit successfully done');
        } catch (e) {
            showErrorModal(e);
        }
        setLoading(false);
    }, [instance, order, selectedAddress, showErrorModal, showSuccessModal]);

    return (
        <Box justifyContent="space-between" className={classes.wrap}>
            <div className={classes.title}>Order details</div>
            <Box>
                {isShowCancelBtn && (
                    <Button
                        variant="tertiary-fill"
                        loading={loading}
                        onClick={onCancelOrder}
                    >
                        Cancel order
                    </Button>
                )}
                {isShowReplenishBtn && (
                    <Button
                        variant="quaternary-fill"
                        className={classes.replenishbtn}
                        loading={loading}
                        onClick={onReplenishOrder}
                    >
                        Replenish Deposit
                    </Button>
                )}
                {isShowWithdrawBtn && (
                    <Button
                        variant="quaternary-fill"
                        className={classes.replenishbtn}
                        loading={loading}
                        onClick={onWithdrawDeposit}
                    >
                        Withdraw deposit
                    </Button>
                )}
                {isShowResultBtn && (
                    <Button
                        variant="primary"
                        className={classes.resultbtn}
                        loading={loading}
                        onClick={onGetResult}
                    >
                        Get Result
                    </Button>
                )}
            </Box>
        </Box>
    );
});
