import React, {
    memo,
    FC,
    useMemo,
    useEffect,
    useState,
    useRef,
} from 'react';
import cn from 'classnames';
import { Tooltip, HtmlBox } from '@/uikit';
import { TooltipTheme } from '@/uikit/Tooltip/types';
import { TooltipLinkProps } from './types';
import { TooltipLinkPopover } from './TooltipLinkPopover';
import classes from './TooltipLink.module.scss';

export const TooltipLink: FC<TooltipLinkProps> = memo(({
    text,
    title,
    link,
    checkOverflow = true,
    isFullWidth = true,
    classNameTooltip,
}) => {
    const [isOverflow, setIsOverflow] = useState(false);
    const ref = useRef<any>(null);
    const refBlock = useRef<any>(null);
    useEffect(() => {
        if (checkOverflow) {
            setIsOverflow(refBlock?.current?.scrollWidth > ref?.current?.clientWidth);
        }
    }, [ref, refBlock, checkOverflow, text]);
    const textBlock = useMemo(() => (
        <span className={cn(classes.text, { [classes.link]: !!link })}>
            <HtmlBox text={text} ref={refBlock} />
        </span>
    ), [text, link]);
    if ((text || title)) {
        return (
            <Tooltip
                tooltip={isOverflow || !checkOverflow ? <TooltipLinkPopover title={title} link={link} text={text} /> : null}
                placement="top"
                theme={TooltipTheme.white}
                classNamePopoverChildren={classes.popoverChildren}
                className={cn(classes.tooltip, { [classes.tooltipFull]: isFullWidth }, classNameTooltip)}
            >
                <div ref={ref} className={classes.text}>{textBlock}</div>
            </Tooltip>
        );
    }
    return textBlock;
});
