import { ReactNode } from 'react';

export interface CardUiProps {
    children: ReactNode | string;
    classNameWrap?: string;
    classNameHeader?: string;
}
