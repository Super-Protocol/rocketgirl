import { FC, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LinkToProps } from './types';
import classes from './LinkTo.module.scss';

export const LinkTo: FC<LinkToProps> = ({ url, address, blank }) => {
    const onClickBlank = useCallback(() => {
        window.open(url, '_blank');
    }, [url]);
    return (
        <>
            {url
                ? blank
                    ? <span className={classes.link} onClick={onClickBlank}>{address}</span>
                    : <Link to={url} className={classes.linkto}>{address}</Link>
                : <span>{address}</span>}
        </>
    );
};
