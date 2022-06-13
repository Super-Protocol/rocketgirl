import OverlayScrollbars from 'overlayscrollbars';

export interface OverlayScrollbarsComponentProps
    extends React.HTMLAttributes<HTMLDivElement> {
    children?: any;
    options?: OverlayScrollbars.Options;
    extensions?: OverlayScrollbars.Extensions;
    contentContainerClassName?: string;
    isFlex?: boolean;
}

export interface OverlayScrollbarsComponentHandle {
    osInstance(): OverlayScrollbars | null;
    osTarget(): HTMLDivElement | null;
    osViewport(): HTMLDivElement | null;
}
