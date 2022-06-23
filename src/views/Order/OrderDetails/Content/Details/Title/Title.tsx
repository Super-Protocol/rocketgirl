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
import { getUnspentDeposit } from '../helpers';
import { ReplenishOrderModal } from './ReplenishOrderModal';
import { GetResultModal } from './GetResultModal';

export const Title = memo<TitleProps>(({ order, orderSdk, updateOrderInfo }) => {
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
            depositSpent: depositSpentSdk,
            orderHoldDeposit: orderHoldDepositSdk,
        } = orderSdk || {};
        const unspentDeposit = getUnspentDeposit(orderHoldDepositSdk, depositSpentSdk);
        const { status } = orderInfoSdk || {};
        return !!status && [
            OrderStatus.Canceled,
            OrderStatus.Done,
            OrderStatus.Canceling,
            OrderStatus.Error,
        ].includes(status) && unspentDeposit;
    }, [orderSdk]);
    const result = useMemo(() => {
        const { orderResult } = order || {};
        const { encryptedResult, encryptedError } = orderResult || {};
        return encryptedResult || encryptedError;
    }, [order]);
    const isShowResultBtn = useMemo(
        () => !!status && [OrderStatus.Done, OrderStatus.Error].includes(status) && !!result,
        [status, result],
    );

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
        showModal({
            children: <GetResultModal orderAddress={order?.address} />,
            messages: {
                header: 'Get result',
            },
        });
    }, [showModal, order]);

    const onWithdrawDeposit = useCallback(async () => {

    }, []);

    return (
        <Box justifyContent="space-between" className={classes.wrap}>
            <div className={classes.title}>Order details</div>
            <Box>
                {isShowCancelBtn && (
                    <Button
                        variant="tertiary"
                        loading={loading}
                        onClick={onCancelOrder}
                    >
                        Cancel order
                    </Button>
                )}
                {isShowReplenishBtn && (
                    <Button
                        variant="quaternary"
                        className={classes.replenishbtn}
                        loading={loading}
                        onClick={onReplenishOrder}
                    >
                        Replenish Deposit
                    </Button>
                )}
                {isShowWithdrawBtn && (
                    <Button
                        variant="quaternary"
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
