import { ReactElement } from 'react';

import { Box, Button } from '@/uikit';
import classes from './Title.module.scss';

export const Title = (): ReactElement => {
    return (
        <Box justifyContent="space-between" className={classes.wrap}>
            <div className={classes.title}>Order details</div>
            <Box>
                <Button variant="tertiary">Cancel order</Button>
                <Button variant="quaternary" className={classes.replenishbtn}>Replenish Deposit</Button>
                <Button variant="primary" className={classes.resultbtn}>Get Result</Button>
            </Box>
        </Box>
    );
};
