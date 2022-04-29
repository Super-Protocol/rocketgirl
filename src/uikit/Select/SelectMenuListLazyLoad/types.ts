import { FetchData, UseLazyLoadCursorProps } from '@/uikit/Select/hooks/useLazyLoadCursor';

export interface SelectMenuListLazyLoadProps {
    selectProps: {
        innerProps: InnerProps;
    };
    fetchData: FetchData
}

export type InnerProps = Omit<UseLazyLoadCursorProps, 'triggerRef'>
