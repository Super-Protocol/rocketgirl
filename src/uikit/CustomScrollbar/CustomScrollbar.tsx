import {
    useRef, useImperativeHandle, useEffect, forwardRef,
} from 'react';
import OverlayScrollbars from 'overlayscrollbars';
import cn from 'classnames';

import { OverlayScrollbarsComponentHandle, OverlayScrollbarsComponentProps } from './types';

export const overlayScrollbarOptions: OverlayScrollbars.Options = {
    className: 'os-theme-dark os-theme-orange',
    scrollbars: {
        autoHide: 'scroll',
    },
};

export const CustomScrollbar = forwardRef<OverlayScrollbarsComponentHandle, OverlayScrollbarsComponentProps>(({
    options = {},
    extensions,
    className,
    children,
    contentContainerClassName,
    isFlex,
    ...rest
}, ref) => {
    const osTargetRef = useRef<HTMLDivElement | null>(null);
    const osViewportRef = useRef<HTMLDivElement | null>(null);
    const osInstance = useRef<OverlayScrollbars | null>(null);

    useImperativeHandle(ref, () => ({
        osInstance: () => osInstance.current,
        osTarget: () => osTargetRef.current,
        osViewport: () => osViewportRef.current,
    }));

    useEffect(() => {
        osInstance.current = OverlayScrollbars(
            osTargetRef.current as any,
            { ...overlayScrollbarOptions, ...options },
            extensions,
        );

        return () => {
            if (osInstance?.current && OverlayScrollbars.valid(osInstance.current)) {
                osInstance.current.destroy();
                osInstance.current = null;
            }
        };
    }, [extensions, options]);

    useEffect(() => {
        if (osInstance?.current && OverlayScrollbars.valid(osInstance.current)) {
            osInstance.current.options({ ...overlayScrollbarOptions, ...options });
        }
    }, [options]);

    return (
        <div className={cn('os-host', { 'os-host-flexbox': isFlex }, className)} {...rest} ref={osTargetRef}>
            <div className="os-resize-observer-host" />
            <div className="os-padding">
                <div className="os-viewport" ref={osViewportRef}>
                    <div className={cn('os-content', contentContainerClassName)}>{children}</div>
                </div>
            </div>
            <div className="os-scrollbar os-scrollbar-horizontal ">
                <div className="os-scrollbar-track">
                    <div className="os-scrollbar-handle" />
                </div>
            </div>
            <div className="os-scrollbar os-scrollbar-vertical">
                <div className="os-scrollbar-track">
                    <div className="os-scrollbar-handle" />
                </div>
            </div>
            <div className="os-scrollbar-corner" />
        </div>
    );
});
