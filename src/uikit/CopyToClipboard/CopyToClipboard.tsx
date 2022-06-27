import {
    memo, FC, useCallback, useMemo,
} from 'react';
import copy from 'copy-to-clipboard';
import { Box, Icon, Ellipsis } from '@/uikit';
import { TooltipLink } from '@/common/components/TooltipLink';
import toastr from '@/services/Toastr/toastr';
import { LinkTo } from './LinkTo';
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
    blank = false,
    canShowTooltip,
}) => {
    const onCopy = useCallback((event) => {
        copy(children);
        if (notification) {
            toastr.success(`Copy: ${children}`);
        }
        onClick(event);
    }, [onClick, children, notification]);
    const element = useMemo(() => (
        <LinkTo {...{
            address: children, url, blank, canShowTooltip,
        }}
        />
    ), [children, url, blank, canShowTooltip]);
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
    const titleTooltip = useMemo(() => (
        canShowTooltip && title
            ? <TooltipLink text={title} title={canShowTooltip?.title} checkOverflow />
            : title
    ), [title, canShowTooltip]);
    const renderElement = useMemo(
        () => (isEllipsis ? <Ellipsis className={classNameText}>{titleTooltip || element}</Ellipsis> : element),
        [isEllipsis, titleTooltip, element, classNameText],
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
