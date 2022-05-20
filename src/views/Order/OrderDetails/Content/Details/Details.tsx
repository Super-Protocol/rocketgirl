import React, { memo, useContext, useMemo } from 'react';
import cn from 'classnames';
import { Box, CardUi, Spinner } from '@/uikit';
import { useOrderQuery } from '@/gql/graphql';
import { NoAccountBlock } from '@/common/components/NoAccountBlock';
import { WalletContext } from '@/common/context/WalletProvider';
import { DetailsProps } from './types';
import { Title } from './Title';
import { getOrderInfo, getOrderOffer } from './helpers';
import classes from './Details.module.scss';
import { SubOrdersTable } from './SubOrdersTable';

export const Details = memo<DetailsProps>(({ id }) => {
    const { isConnected } = useContext(WalletContext);
    const orderQuery = useOrderQuery({ variables: { id } });
    const loading = useMemo(() => orderQuery?.loading, [orderQuery]);
    const order = useMemo(() => orderQuery.data?.order, [orderQuery]);
    const orderAddress = useMemo(() => order?.address, [order]);
    const orderInfo = useMemo(() => getOrderInfo(order), [order]);
    const offerInfo = useMemo(() => getOrderOffer(order), [order]);
    if (loading) return <Spinner fullscreen />;
    if (!isConnected) return <NoAccountBlock message="Connect your wallet to see if you made an order" />;

    return (
        <Box direction="column">
            <Title />
            <Box>
                {!!orderInfo && (
                    <CardUi classNameWrap={cn(classes.card, { [classes.mr]: !!offerInfo })}>
                        <Box direction="column">
                            {orderInfo.list.map((item, idx) => {
                                const { key, value } = item;
                                return (
                                    <Box key={idx} className={cn({ [classes.line]: idx !== 0 })}>
                                        <span className={classes.left}>{key}</span>
                                        <span>{value}</span>
                                    </Box>
                                );
                            })}
                        </Box>
                    </CardUi>
                )}
                {!!offerInfo && (
                    <CardUi>
                        <Box direction="column">
                            <div className={classes.cardTitle}>{offerInfo.title}</div>
                            {offerInfo.list.map((item, idx) => {
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
