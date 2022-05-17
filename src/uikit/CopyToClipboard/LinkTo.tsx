import { FC } from 'react';
import { Link } from 'react-router-dom';

import { LinkToProps } from './types';
import classes from './LinkTo.module.scss';

export const LinkTo: FC<LinkToProps> = ({ url, address }) => {
    return (
        <>
            {url
                ? <Link to={url} className={classes.linkto}>{address}</Link>
                : <span>{address}</span>}
        </>
    );
};
