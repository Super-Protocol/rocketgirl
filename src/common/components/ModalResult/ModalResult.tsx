import React, { memo, FC, useMemo } from 'react';
import cn from 'classnames';
import { Box } from '@/uikit';
import { getTransactionHashLink } from '@/common/helpers';
import { ModalResultProps } from './types';
import classes from './ModalResult.module.scss';

export const ModalResult: FC<ModalResultProps> = memo(({ children, classNameMessage, transactionHash }) => {
    const link = useMemo(() => getTransactionHashLink(transactionHash), [transactionHash]);
    return (
        <Box className={classes.wrap} direction="column">
            {!!link && <a href={link} target="_blank" rel="noopener noreferrer">transaction link</a>}
            <pre className={cn(classes.message, classNameMessage)}>{children}</pre>
        </Box>
    );
});
