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
import { useOrderLazyQuery } from '@/gql/graphql';
import { NoAccountBlock } from '@/common/components/NoAccountBlock';
import { WalletContext } from '@/common/context/WalletProvider';
import { getOrderSdk, GetOrderSdk } from '@/connectors/orders';
import { DetailsProps } from './types';
import { Title } from './Title';
import { getInfo, getTee } from './helpers';
import classes from './Details.module.scss';
import { SubOrdersTable } from './SubOrdersTable';

export const Details = memo<DetailsProps>(({ id }) => {
    const {
        isConnected,
        // selectedAddress,
    } = useContext(WalletContext);
    const [orderSdk, setOrderSdk] = useState<GetOrderSdk>();
    const [loadingOrderSdk, setLoadingOrderSdk] = useState(false);
    const [subOrdersList, setSubOrdersList] = useState([]);
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
    const loading = useMemo(() => orderResult?.loading || loadingOrderSdk, [orderResult, loadingOrderSdk]);
    const order = useMemo(() => orderResult.data?.order, [orderResult]);
    const orderAddress = useMemo(() => order?.address, [order]);
    const info = useMemo(() => getInfo(order, orderSdk), [order, orderSdk]);
    const tee = useMemo(() => getTee(order, orderSdk), [order, orderSdk]);
    useEffect(() => {
        updateOrderInfo();
    }, [updateOrderInfo]);
    if (loading) return <Spinner fullscreen />;
    // if (!isMyOrder) return null; // todo hide before production
    if (!isConnected) return <NoAccountBlock message="Connect your wallet to see if you made an order" />;

    return (
        <Box direction="column">
            {!!order && (
                <Title {...{
                    order, orderSdk, updateOrderInfo, subOrdersList,
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
            {!!orderAddress && (
                <SubOrdersTable
                    address={orderAddress}
                    classNameWrap={classes.table}
                    setSubOrdersList={setSubOrdersList}
                />
            )}
        </Box>
    );
});
