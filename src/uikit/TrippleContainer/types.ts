import { ReactNode } from 'react';

export interface TrippleContainerProps {
    goBackButtonText?: string;
    children: ReactNode;
    rightSidebar?: ReactNode;
    leftSidebar?: ReactNode;
    headerRightBlock?: ReactNode;
    classNameLeftWrap?: string;
    classNameCenterWrap?: string;
    classNameRightWrap?: string
    isHideBack?: boolean;
    isHideHeader?: boolean;
}
