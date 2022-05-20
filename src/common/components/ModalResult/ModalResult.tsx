import React, { memo, FC, useMemo } from 'react';
import cn from 'classnames';
import { Box } from '@/uikit';
import { getTransactionHashLink, isJSONString } from '@/common/helpers';
import { ModalResultProps } from './types';
import classes from './ModalResult.module.scss';

export const ModalResult: FC<ModalResultProps> = memo(({ children, classNameMessage, transactionHash }) => {
    const link = useMemo(() => getTransactionHashLink(transactionHash), [transactionHash]);
    const isJSON = useMemo(() => isJSONString(children as string), [children]);
    return (
        <Box className={classes.wrap} direction="column">
            {!!link && <a href={link} target="_blank" rel="noopener noreferrer">transaction link</a>}
            {isJSON ? <pre className={cn(classes.message, classNameMessage)}>{children}</pre> : <span>{children}</span>}
        </Box>
    );
});
