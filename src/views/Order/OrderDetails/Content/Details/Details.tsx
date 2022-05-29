import React, {
    memo,
    useCallback,
    useContext, useEffect,
    useMemo,
    useState,
} from 'react';
import cn from 'classnames';
import { Box, CardUi, Spinner } from '@/uikit';
import { useOrderLazyQuery } from '@/gql/graphql';
import { NoAccountBlock } from '@/common/components/NoAccountBlock';
import { WalletContext } from '@/common/context/WalletProvider';
import { getOrderInfo, GetOrderInfoResult } from '@/connectors/orders';
import { DetailsProps } from './types';
import { Title } from './Title';
import { getInfo, getTee } from './helpers';
import classes from './Details.module.scss';
import { SubOrdersTable } from './SubOrdersTable';

export const Details = memo<DetailsProps>(({ id }) => {
    const { isConnected } = useContext(WalletContext);
    const [orderInfo, setOrderInfo] = useState<GetOrderInfoResult>();
    const [loadingOrderInfo, setLoadingOrderInfo] = useState(false);
    const [getOrder, orderResult] = useOrderLazyQuery({ variables: { id } });
    const updateOrderInfo = useCallback(async () => {
        setLoadingOrderInfo(true);
        const result = await getOrderInfo(id).catch(() => undefined);
        setOrderInfo(result);
        setLoadingOrderInfo(false);
    }, [id]);
    const loading = useMemo(() => orderResult?.loading || loadingOrderInfo, [orderResult, loadingOrderInfo]);
    const order = useMemo(() => orderResult.data?.order, [orderResult]);
    const orderAddress = useMemo(() => order?.address, [order]);
    const info = useMemo(() => getInfo(order, orderInfo), [order, orderInfo]);
    const tee = useMemo(() => getTee(order), [order]);

    useEffect(() => {
        getOrder();
        updateOrderInfo();
    }, [getOrder, updateOrderInfo]);

    if (loading) return <Spinner fullscreen />;
    if (!isConnected) return <NoAccountBlock message="Connect your wallet to see if you made an order" />;

    return (
        <Box direction="column">
            {!!order && <Title order={order} orderInfo={orderInfo} updateOrderInfo={updateOrderInfo} />}
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
            {!!orderAddress && <SubOrdersTable address={orderAddress} classNameWrap={classes.table} />}
        </Box>
    );
});
