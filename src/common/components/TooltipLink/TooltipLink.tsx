import React, {
    memo,
    FC,
    useMemo,
    useEffect,
    useState,
    useRef,
} from 'react';
import cn from 'classnames';
import { Tooltip, Ellipsis } from '@/uikit';
import { TooltipTheme } from '@/uikit/Tooltip/types';
import { TooltipLinkProps } from './types';
import { TooltipLinkPopover } from './TooltipLinkPopover';
import classes from './TooltipLink.module.scss';

export const TooltipLink: FC<TooltipLinkProps> = memo(({
    text,
    title,
    link,
    checkOverflow = false,
    isFullWidth = true,
    classNameTooltip,
}) => {
    const [isOverflow, setIsOverflow] = useState(false);
    const ref = useRef<any>(null);
    useEffect(() => {
        if (checkOverflow) {
            setIsOverflow(ref?.current?.scrollWidth > ref?.current?.clientWidth);
        }
    }, [ref, checkOverflow]);
    const textBlock = useMemo(() => <span className={cn(classes.text, { [classes.link]: !!link })}>{text}</span>, [text, link]);
    if ((text || title)) {
        return (
            <Tooltip
                tooltip={isOverflow || !checkOverflow ? <TooltipLinkPopover title={title} link={link} text={text} /> : null}
                placement="top"
                theme={TooltipTheme.white}
                classNamePopoverChildren={classes.popoverChildren}
                className={cn(classes.tooltip, { [classes.tooltipFull]: isFullWidth }, classNameTooltip)}
            >
                <Ellipsis ref={ref}>{textBlock}</Ellipsis>
            </Tooltip>
        );
    }
    return textBlock;
});
