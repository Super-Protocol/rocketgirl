import { useMemo, forwardRef, memo } from 'react';

import { HtmlBoxProps } from './types';
import classes from './HtmlBox.module.scss';

export const HtmlBox = memo(forwardRef<HTMLDivElement, HtmlBoxProps>(({ text }, ref) => {
    const markup = useMemo(() => ({ __html: text }), [text]);

    return (
        <div dangerouslySetInnerHTML={markup} className={classes.wrap} ref={ref} /> // eslint-disable-line react/no-danger
    );
}));
