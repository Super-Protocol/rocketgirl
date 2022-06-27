import { FC, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { TooltipLink } from '@/common/components/TooltipLink';
import { LinkToProps } from './types';
import classes from './LinkTo.module.scss';

export const LinkTo: FC<LinkToProps> = ({
    url, address, blank, canShowTooltip,
}) => {
    const onClickBlank = useCallback(() => {
        window.open(url, '_blank');
    }, [url]);

    const element = useMemo(() => (
        canShowTooltip
            ? <TooltipLink text={address} title={canShowTooltip?.title} checkOverflow />
            : address
    ), [address, canShowTooltip]);

    return (
        <>
            {url
                ? blank
                    ? <span className={classes.link} onClick={onClickBlank}>{element}</span>
                    : <Link to={url} className={classes.linkto}>{element}</Link>
                : <span>{element}</span>}
        </>
    );
};
