import React, { memo, FC } from 'react';
import { ReactComponent as StackIcon } from '@/assets/icons/stack.svg';
import { Button } from '@/uikit';
import { StackBtnProps } from './types';
import classes from './StaskBtn.module.scss';

export const StackBtn: FC<StackBtnProps> = memo(({ onClick = () => {} }) => {
    return (
        <Button variant="grey" onClick={onClick} className={classes.btn}>
            <StackIcon />
        </Button>
    );
});
