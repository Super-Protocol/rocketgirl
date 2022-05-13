import { ReactNode } from 'react';

export enum themes {
    light = 'light',
    dark = 'dark',
    gray = 'gray',
}

export interface PaperUiProps {
    classNameWrap?: string;
    children: ReactNode | string;
    theme?: themes;
}
