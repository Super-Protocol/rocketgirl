import { useCallback, memo } from 'react';

import { HtmlBoxProps } from './types';

export const HtmlBox = memo<HtmlBoxProps>(({ text }) => {
    const createMarkup = useCallback(() => {
        return { __html: text };
    }, []);

    return (
        <div dangerouslySetInnerHTML={createMarkup()} /> // eslint-disable-line react/no-danger
    );
});
