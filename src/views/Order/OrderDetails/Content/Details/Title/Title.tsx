import { Box, Button } from '@/uikit';

import classes from './Title.module.scss';

export const Title = () => {
    return (
        <Box justifyContent="space-between" className={classes.wrap}>
            <div className={classes.title}>Order details</div>
            <Box>
                <Button>Cancel order</Button>
                <Button>Replenish Deposit</Button>
                <Button>Get Result</Button>
            </Box>
        </Box>
    );
};
