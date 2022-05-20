import {
    memo, FC, useCallback, useMemo,
} from 'react';
import copy from 'copy-to-clipboard';

import { Box, Icon, Ellipsis } from '@/uikit';
import { LinkTo } from './LinkTo';
import toastr from '@/services/Toastr/toastr';
import { CopyToClipboardProps } from './types';
import classes from './CopyToClipboard.module.scss';

export const CopyToClipboard: FC<CopyToClipboardProps> = memo(({
    children,
    onClick = () => {},
    notification = true,
    isEllipsis = true,
    isReverse = false,
    classNameWrap,
    classNameText,
    title,
    url,
}) => {
    const onCopy = useCallback((event) => {
        copy(children);
        if (notification) {
            toastr.success(`Copy: ${children}`);
        }
        onClick(event);
    }, [onClick, children, notification]);
    const element = useMemo(() => <LinkTo address={children} url={url} />, [children, url]);
    const renderIcon = useMemo(() => (
        <Box>
            <Icon
                width={14}
                name="copy"
                className={classes.icon}
                onClick={onCopy}
            />
        </Box>
    ), [onCopy]);
    const renderElement = useMemo(
        () => (isEllipsis ? <Ellipsis className={classNameText}>{title || element}</Ellipsis> : element),
        [isEllipsis, title, element, classNameText],
    );
    if (!children && !title) return null;
    return (
        <Box alignItems="center" className={classNameWrap}>
            {isReverse ? (
                <>
                    {renderElement}
                    {renderIcon}
                </>
            ) : (
                <>
                    {renderIcon}
                    {renderElement}
                </>
            )}
        </Box>
    );
});
