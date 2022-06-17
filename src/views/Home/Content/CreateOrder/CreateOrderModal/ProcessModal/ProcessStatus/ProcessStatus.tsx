import React, { memo, FC, useMemo } from 'react';
import cn from 'classnames';
import { Box, Icon, Spinner } from '@/uikit';
import { ProcessStatusProps, Status } from './types';
import classes from './ProcessStatus.module.scss';

export const ProcessStatus: FC<ProcessStatusProps> = memo(({ status, className }) => {
    const renderStatus = useMemo(() => {
        switch (status) {
            case Status.IN_PROGRESS:
                return (
                    <>
                        <Spinner animation="border" className={classes.spinner} />
                        <span className={classes.progressText}>In progress</span>
                    </>
                );
            case Status.CREATED:
                return (
                    <>
                        <Icon
                            width={14}
                            name="done"
                            className={classes.createdIcon}
                        />
                        <span className={classes.createdText}>Order created</span>
                    </>
                );
            case Status.QUEUE:
                return (
                    <>
                        <Icon
                            width={14}
                            name="refresh"
                            className={classes.queueIcon}
                        />
                        <span className={classes.queueText}>In queue</span>
                    </>
                );
            default:
                return null;
        }
    }, [status]);
    return <Box alignItems="center" className={cn(classes.wrap, className)}>{renderStatus}</Box>;
});
