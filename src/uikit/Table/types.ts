import { ReactNode } from 'react';
import type { TableOptions, Row } from 'react-table';
import { SpinnerProps } from '@/uikit/Spinner/types';
import { OnPageChangeProps } from '@/uikit/Table/TablePagination/types';

export type { Column, Row } from 'react-table';

export interface ColumnProps {
    isEllipsis?: boolean;
}

export enum TableTheme {
    gray = 'gray',
    beige = 'beige',
}

export interface TableProps<T extends Record<string, unknown>> extends TableOptions<T> {
    expandRow?: ({ row }: { row: Row<T> }) => ReactNode;
    loading?: boolean;
    called?: boolean;
    noDataMessage?: string | ReactNode;

    title?: string | ReactNode;

    leftBtns?: ReactNode;
    btns?: ReactNode;

    className?: string;
    headerThClassName?: string;
    trClassName?: string;
    tdClassName?: string;
    expandedTdClassName?: string;
    noDataClassName?: string;

    classNames?: {
        wrap?: string;
        table?: string;
        th?: string;
        tr?: string;
        trExpandedFirst?: string;
        trExpandedSecond?: string;
        td?: string;
        tdExpanded?: string;
        noData?: string;
    };

    styles?: {
        expandedSpecialStyle?: boolean;
        theme?: TableTheme;
        small?: boolean;
    };

    spinnerProps?: SpinnerProps;

    hideTableSettings?: boolean;

    onRowEvents?: any;
    expandLeft?: boolean;
    expandOnAllCells?: boolean;

    itemsPageSizeOptions?: number[];
    onChangePageSize?: (size: number) => void;
    pageSize?: number | null;
    pageIndex?: number | null;
    error?: string;
    diff?: Map<number, Set<string>> | null;
    diffTimeout?: number;
    onPageChange?: (props: OnPageChangeProps) => void;
    autoResetPage?: boolean;
    initialPageIndex?: number;
    showLoader?: boolean;
    isUseCursor?: boolean;
}
