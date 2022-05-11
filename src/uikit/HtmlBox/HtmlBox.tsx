import { useMemo, FC } from 'react';

import { HtmlBoxProps } from './types';

export const HtmlBox: FC<HtmlBoxProps> = ({ text }) => {
    const markup = useMemo(() => ({ __html: text }), [text]);

    return (
        <div dangerouslySetInnerHTML={markup} /> // eslint-disable-line react/no-danger
    );
};
