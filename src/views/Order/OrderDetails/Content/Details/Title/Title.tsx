import { Box, Button } from '@/uikit';

import classes from './Title.module.scss';

export const Title = () => {
    return (
        <Box justifyContent="space-between" className={classes.wrap}>
            <div className={classes.title}>Order details</div>
            <Box>
                <Button variant="transparent-orange">Cancel order</Button>
                <Button variant="transparent-black-hover" className={classes.replenishbtn}>Replenish Deposit</Button>
                <Button variant="orange" className={classes.resultbtn}>Get Result</Button>
            </Box>
        </Box>
    );
};
