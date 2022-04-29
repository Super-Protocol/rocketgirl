import { ReactNode, ReactElement } from 'react';

export type themes = 'light' | 'dark';

export interface SidebarWidgetProps {
    theme?: themes;
    children?: ReactNode | string;
    defaultOpen?: boolean;
    icon?: ReactElement;
    title?: ReactNode | string;
    classNameWrap?: string;
    classNameAccordionCollapse?: string;
    dataTestId?: string;
    fullWidth?: boolean;
    onSelect?: (isOpen: boolean) => void;
}

export interface SideBarWidgetToggleProps {
    eventKey: string;
    icon?: ReactElement;
    title?: ReactNode | string;
    onSelect: (isOpen: boolean) => void;
    isOpen: boolean;
    theme: themes;
    dataTestId?: string;
}
