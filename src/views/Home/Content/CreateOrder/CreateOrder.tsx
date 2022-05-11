import React, {
    memo,
    FC,
    useCallback,
    useContext,
} from 'react';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { Button, Box } from '@/uikit';
import { CreateOrderProps } from './types';
import { CreateOrderModal } from './CreateOrderModal';

export const CreateOrder: FC<CreateOrderProps> = memo(() => {
    const { showModal } = useContext(ModalOkCancelContext);
    const createOrder = useCallback(() => {
        showModal({
            children: <CreateOrderModal />,
            messages: {
                header: 'New Order',
            },
        });
    }, [showModal]);

    return (
        <Box>
            <Button variant="orange" onClick={createOrder}>New order</Button>
        </Box>
    );
});
