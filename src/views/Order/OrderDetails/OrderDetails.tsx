import { memo } from 'react';
import { Box } from '@/uikit';
import { Header } from './Header';
import { Content } from './Content';

const OrderDetails = () => {
    return (
        <Box direction="column">
            <Header />
            <Content />
        </Box>
    );
};

export default memo(OrderDetails);
