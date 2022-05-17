import React, { memo, useContext, useMemo } from 'react';
import cn from 'classnames';
import { Box, CardUi } from '@/uikit';
import { useOrderQuery } from '@/gql/graphql';
import { NoAccountBlock } from '@/common/components/NoAccountBlock';
import { WalletContext } from '@/common/context/WalletProvider';
import { DetailsProps } from './types';
import { Title } from './Title';
import { getOrderInfo, getOrderTee } from './helpers';
import classes from './Details.module.scss';

export const Details = memo<DetailsProps>(({ id }) => {
    const { isConnected } = useContext(WalletContext);
    const order = useOrderQuery({ variables: { id } });
    const orderInfo = useMemo(() => getOrderInfo(id), [id]);
    const orderTee = useMemo(() => getOrderTee(id), [id]);
    if (!isConnected) return <NoAccountBlock message="Connect your wallet to see if you made an order" />;

    return (
        <Box direction="column">
            <Title />
            <Box>
                <CardUi classNameWrap={classes.card}>
                    <Box direction="column">
                        {orderInfo.map((item, idx) => {
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
                <CardUi>
                    <Box direction="column">
                        <div className={classes.cardTitle}>TEE</div>
                        {orderTee.map((item, idx) => {
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
            </Box>
        </Box>
    );
});
