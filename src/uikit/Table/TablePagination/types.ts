import { UsePaginationInstanceProps } from 'react-table';

export enum PageClick {
    FIRST = 'FIRST',
    LAST = 'LAST',
    NEXT = 'NEXT',
    BACK = 'BACK'
}

export interface OnPageChangeProps {
    oldPageIndex: number;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    indexes: number[];
    pageClick: PageClick;
}

export type OnPageChange = (props: OnPageChangeProps) => void;

export interface TablePaginationProps extends UsePaginationInstanceProps<any> {
    pageSize: number;
    pageIndex: number;
    itemsPageSizeOptions?: number[];
    diff?: Map<number, Set<string>> | null;
    onPageChange?: OnPageChange;
    isUseCursor?: boolean;
}
