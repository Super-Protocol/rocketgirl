import { ReactNode } from 'react';

export interface DetailWidgetProps {
    children?: ReactNode | string;
    defaultOpen?: boolean;
    titleOpen?: ReactNode | string;
    titleClose?: ReactNode | string;
    classNameWrap?: string;
    fullWidth?: boolean;
}
