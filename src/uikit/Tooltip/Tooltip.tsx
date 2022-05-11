import {
    useState,
    useRef,
    useMemo,
    memo,
    FC,
    useEffect,
    useCallback,
} from 'react';
import cn from 'classnames';
import { v1 as uuidv1 } from 'uuid';
import { useDebouncedCallback } from 'use-debounce';
import { ButtonToolbar, Overlay } from 'react-bootstrap';

import { Icon } from '@/uikit';
import { TooltipPopover } from './TooltipPopover';
import { TooltipProps, TooltipTheme } from './types';
import classes from './Tooltip.module.scss';

export const Tooltip: FC<TooltipProps> = memo(({
    children,
    placement = 'top',
    tooltip,
    delay = 0,
    className,
    classNamePopover,
    classNamePopoverText,
    popoverProps = {},
    buttonToolbarProps = {},
    initialShow,
    onClick = () => {},
    dataTestId,
    classNamePopoverChildren,
    onMouseLeave: onMouseLeaveProp,
    onMouseEnter: onMouseEnterProp,
    hideArrow,
    block = false,
    noMargin = false,
    theme = TooltipTheme.beige,
    containerRef = null,
}) => {
    const [show, setShow] = useState(initialShow);
    const [id] = useState(uuidv1());
    const target = useRef(null);
    const onMouseEnter = useDebouncedCallback(() => {
        if (onMouseEnterProp) {
            onMouseEnterProp();
        } else if (!block) {
            setShow(true);
        }
    }, delay);
    const onMouseLeave = useDebouncedCallback(() => {
        if (onMouseLeaveProp) {
            onMouseLeaveProp();
        } else {
            setShow(false);
        }
    }, delay);
    const childrenProps = useMemo(() => ({
        ref: target,
        onMouseEnter,
        onMouseLeave,
    }), [onMouseEnter, onMouseLeave, target]);
    const onClickButton = useCallback(() => {
        setShow(false);
    }, []);
    useEffect(() => {
        setShow(initialShow);
    }, [initialShow]);

    const themeClassName = useMemo(() => {
        return {
            [classes.gray]: theme === TooltipTheme.gray,
            [classes.beige]: theme === TooltipTheme.beige,
            [classes.white]: theme === TooltipTheme.white,
        };
    }, [theme]);

    return (
        <ButtonToolbar
            className={cn(classes.control, className)}
            onClick={onClickButton}
            {...buttonToolbarProps}
        >
            <Overlay
                placement={placement}
                target={target.current}
                show={show}
                container={containerRef}
                transition={false}
            >
                {(props) => {
                    return (
                        <TooltipPopover {...{
                            popoverProps,
                            overlayProps: props,
                            hideArrow,
                            classNamePopover: cn(classNamePopover, themeClassName),
                            onMouseEnter,
                            onMouseLeave,
                            id,
                            dataTestId,
                            classNamePopoverText: cn(classNamePopoverText, themeClassName),
                            tooltip,
                        }}
                        />
                    );
                }}
            </Overlay>
            <div className={cn(classes.icon, { [classes.noMargin]: noMargin }, classNamePopoverChildren)} {...childrenProps}>
                {children || (
                    <Icon
                        width={17}
                        name="info_fill"
                        className={cn(classes.inner, classNamePopover)}
                        onClick={onClick}
                    />
                )}
            </div>
        </ButtonToolbar>
    );
});
