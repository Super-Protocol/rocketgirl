import React, {
    memo,
    FC,
    useCallback,
    useContext,
} from 'react';
import { ModalOkCancelContext, WalletContext } from '@/common/context';
import { Button, Box } from '@/uikit';
import { CreateOrderProps } from './types';
import { CreateOrderModal } from './CreateOrderModal';

export const CreateOrder: FC<CreateOrderProps> = memo(() => {
    const { isConnected } = useContext(WalletContext);
    const { showModal } = useContext(ModalOkCancelContext);
    const createOrder = useCallback(() => {
        showModal({
            children: <CreateOrderModal />,
            messages: {
                header: 'New Order',
            },
        });
    }, [showModal]);

    if (!isConnected) return null;

    return (
        <Box>
            <Button variant="primary" onClick={createOrder}>New order</Button>
        </Box>
    );
});
