import React, { memo, FC, useMemo } from 'react';
import cn from 'classnames';
import { Box, Icon } from '@/uikit';
import { getTransactionHashLink, isJSONString } from '@/common/helpers';
import { ModalResultProps } from './types';
import classes from './ModalResult.module.scss';

export const ModalResult: FC<ModalResultProps> = memo(({
    children,
    classNameMessage,
    transactionHash,
    type,
}) => {
    const link = useMemo(() => getTransactionHashLink(transactionHash), [transactionHash]);
    const isJSON = useMemo(() => isJSONString(children as string), [children]);
    const renderType = useMemo(() => {
        switch (type) {
            case 'success':
                return (
                    <Box className={classes.typeWrap}>
                        <Box className={cn(classes.round, classes.green)}>
                            <Icon
                                width={14}
                                name="done"
                                className={classes.icon}
                            />
                        </Box>
                        <div className={classes.text}>Success</div>
                    </Box>
                );
            case 'error':
                return (
                    <Box className={classes.typeWrap}>
                        <Box className={cn(classes.round, classes.red)}>
                            <Icon
                                width={14}
                                name="close-small"
                                className={classes.icon}
                            />
                        </Box>
                        <div className={classes.text}>Error</div>
                    </Box>
                );
            default:
                return null;
        }
    }, [type]);
    return (
        <Box className={classes.wrap} direction="column" alignItems="center" justifyContent="center">
            {renderType}
            {!!link && <a href={link} target="_blank" rel="noopener noreferrer">transaction link</a>}
            {
                isJSON
                    ? <pre className={cn(classes.message, classNameMessage)}>{children}</pre>
                    : <span className={classes.txt}>{children}</span>
            }
        </Box>
    );
});
