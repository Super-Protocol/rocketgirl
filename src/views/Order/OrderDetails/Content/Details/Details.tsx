import React, {
    memo,
    useCallback,
    useContext, useEffect,
    useMemo,
    useState,
} from 'react';
import cn from 'classnames';
import toastr from '@/services/Toastr/toastr';
import { Box, CardUi, Spinner } from '@/uikit';
import { useTableQueryFetcher } from '@/common/hooks';
import { Order, SubOrdersDocument, useOrderLazyQuery } from '@/gql/graphql';
import { NoAccountBlock } from '@/common/components/NoAccountBlock';
import { WalletContext } from '@/common/context/WalletProvider';
import { useTablesSubscriptions } from '@/views/Home/hooks';
import { Tables } from '@/views/Home/types';
import { getOrderSdk, GetOrderSdk, onOrdersStatusUpdatedSubscription } from '@/connectors/orders';
import { DetailsProps, SubOrderInfo } from './types';
import { Title } from './Title';
import {
    getInfo,
    getTee,
    getOrdersCancelList,
    getSubOrdersList,
    getTotalDeposit,
    getUnspentDeposit,
    getActualCost,
    getEstimatedCost,
} from './helpers';
import classes from './Details.module.scss';
import { SubOrdersTable } from './SubOrdersTable';

export const Details = memo<DetailsProps>(({ id = '' }) => {
    const {
        isConnected,
        selectedAddress,
    } = useContext(WalletContext);
    const orders = useTableQueryFetcher<Order>({
        gql: SubOrdersDocument,
        queryOptions: { variables: { pagination: { sortBy: 'origins.modifiedDate' }, filter: { parentOrder: id } } },
        subscriptionKey: 'id',
        options: { pageSize: 10 },
        skip: !id ? { type: null } : undefined,
    });
    const [orderSdk, setOrderSdk] = useState<GetOrderSdk>();
    const [loadingOrderSdk, setLoadingOrderSdk] = useState(false);
    const [getOrder, orderResult] = useOrderLazyQuery({ variables: { id } });
    const updateOrderInfo = useCallback(async () => {
        setLoadingOrderSdk(true);
        try {
            await getOrder();
            setOrderSdk(await getOrderSdk(id));
        } catch (e) {
            toastr.error(e);
        }
        setLoadingOrderSdk(false);
    }, [id, getOrder]);
    const subOrdersInfo = useMemo<SubOrderInfo>(() => getSubOrdersList(orders.list), [orders.list]);
    const order = useMemo(() => orderResult.data?.order, [orderResult]);
    const orderId = useMemo(() => order?.id, [order]);
    const unspentDeposit = useMemo(() => getUnspentDeposit({
        subOrdersInfo,
        orderHoldDeposit: `${orderSdk?.orderHoldDeposit || 0}`,
        depositSpent: `${orderSdk?.depositSpent || 0}`,
    }), [subOrdersInfo, orderSdk]);
    const totalDeposit = useMemo(() => getTotalDeposit({
        subOrdersInfo,
        orderHoldDeposit: `${orderSdk?.orderHoldDeposit || 0}`,
    }), [subOrdersInfo, orderSdk]);
    const actualCost = useMemo(() => getActualCost({
        depositSpent: `${orderSdk?.depositSpent || 0}`,
        subOrdersInfo,
    }), [subOrdersInfo, orderSdk]);
    const info = useMemo(() => getInfo({
        order,
        orderSdk,
        unspentDeposit,
        totalDeposit,
    }), [order, orderSdk, unspentDeposit, totalDeposit]);
    const estimatedCost = useMemo(() => getEstimatedCost({
        subOrdersInfo,
    }), [subOrdersInfo]);
    const tee = useMemo(() => getTee({
        order,
        actualCost,
        estimatedCost,
    }), [order, actualCost, estimatedCost]);
    const subOrdersList = useMemo(() => getOrdersCancelList(subOrdersInfo), [subOrdersInfo]);
    useTablesSubscriptions({ [Tables.Orders]: orders } as any, selectedAddress);
    const loading = useMemo(
        () => orderResult?.loading || loadingOrderSdk || orders.loading,
        [orderResult, loadingOrderSdk, orders.loading],
    );
    useEffect(() => {
        updateOrderInfo();
    }, [updateOrderInfo]);
    useEffect(() => {
        let subscription: () => void;
        if (orderId) {
            subscription = onOrdersStatusUpdatedSubscription(
                (status) => {
                    setOrderSdk((prev: any) => {
                        return {
                            ...prev,
                            orderInfo: { ...(prev?.orderInfo ? prev.orderInfo : {}), status },
                        };
                    });
                },
                orderId,
            );
        }
        return () => {
            if (subscription) {
                subscription();
            }
        };
    }, [orderId]);
    if (loading) return <Spinner fullscreen />;
    // if (!isMyOrder) return null; // todo hide before production
    if (!isConnected) return <NoAccountBlock message="Connect your wallet to see if you made an order" />;

    return (
        <Box direction="column">
            {!!order && (
                <Title {...{
                    order, orderSdk, updateOrderInfo, subOrdersList, unspentDeposit,
                }}
                />
            )}
            <Box>
                {!!info && (
                    <CardUi classNameWrap={cn(classes.card, { [classes.mr]: !!tee })}>
                        <Box direction="column">
                            {info.list.map((item, idx) => {
                                const { key, value } = item;
                                return (
                                    <Box key={idx} className={cn({ [classes.line]: idx !== 0 })}>
                                        <span className={classes.left}>{key}</span>
                                        <span className={classes.right}>{value}</span>
                                    </Box>
                                );
                            })}
                        </Box>
                    </CardUi>
                )}
                {!!tee && (
                    <CardUi>
                        <Box direction="column">
                            <div className={classes.cardTitle}>{tee.title}</div>
                            {tee.list.map((item, idx) => {
                                const { key, value } = item;
                                return (
                                    <Box key={idx} className={classes.line}>
                                        <span className={classes.left}>{key}</span>
                                        <span>{value}</span>
                                    </Box>
                                );
                            })}
                        </Box>
                    </CardUi>
                )}
            </Box>
            <SubOrdersTable
                classNameWrap={classes.table}
                orders={orders}
            />
        </Box>
    );
});
