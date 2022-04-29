import {
    FC,
    memo, useMemo,
} from 'react';
import cn from 'classnames';
import { useLocation } from 'react-router-dom';
import qs from 'query-string';

import { Button } from '@/uikit';

import { useNavigateBack } from '@/common/hooks/useNavigateBack';
import classes from './TrippleContainer.module.scss';
import { TrippleContainerProps } from './types';

export const TrippleContainer: FC<TrippleContainerProps> = memo(({
    children,
    rightSidebar,
    leftSidebar,
    headerRightBlock,
    goBackButtonText,
    classNameLeftWrap,
    classNameCenterWrap,
    classNameRightWrap,
    isHideBack,
    isHideHeader,
}) => {
    const buttonText = goBackButtonText ?? 'Back';
    const navigateBack = useNavigateBack();
    const location = useLocation();
    const query = useMemo(() => qs.parse(location.search), [location]);
    const isHideBackFromQuery = useMemo(() => !!query?.hide_back, [query]);

    return (
        <div className={classes.wrap}>
            {!isHideHeader && (
                <div className={classes.header}>
                    <div>
                        {(!isHideBackFromQuery && !isHideBack) && (
                            <Button variant="grey-light" data-testid="tripple-back" onClick={navigateBack}>
                                {buttonText}
                            </Button>
                        )}
                    </div>
                    <div>{headerRightBlock}</div>
                </div>
            )}
            <div className={cn(classes.body, { [classes.body_full]: isHideHeader })}>
                {!!leftSidebar && (
                    <div className={cn(classes.leftWrap, classNameLeftWrap)}>
                        {leftSidebar}
                    </div>
                )}
                <div className={cn(classes.centerWrap, classNameCenterWrap)}>
                    {children}
                </div>
                {!!rightSidebar && (
                    <div className={cn(classes.rightWrap, classNameRightWrap)}>
                        {rightSidebar}
                    </div>
                )}
            </div>
        </div>

    );
});
