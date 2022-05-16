import {
    PropsWithChildren, useMemo, Fragment, ReactElement, memo, useCallback, JSXElementConstructor,
} from 'react';
import {
    useTable, useExpanded, usePagination, useSortBy, ColumnWithCustomProps,
} from 'react-table';
import cn from 'classnames';
import { ArrowUp, ArrowDown } from 'react-feather';
import { Box, Ellipsis, Spinner } from '@/uikit';
import classes from './Table.module.scss';
import { TablePagination } from './TablePagination';
import { TableProps, TableTheme } from './types';

const iconProps = { color: '#bcbbba', size: 17 };

export const Table: <T extends Record<string, unknown>>(p: PropsWithChildren<TableProps<T>>) =>
    ReactElement<T, string | JSXElementConstructor<T>> | null = memo(({
        columns,
        pageCount: pageCountProp,
        data: dataProp,
        pageSize: pageSizeProp,
        onChangePageSize: onChangePageSizeProp = () => {},
        expandRow,
        loading = false,
        called,
        noDataMessage,
        hideTableSettings = false,
        classNames = {},
        styles = {},
        spinnerProps,
        btns,
        leftBtns,
        title,
        expandOnAllCells,
        itemsPageSizeOptions = [5, 10, 25, 50],
        error,
        defaultCanSort = false,
        diff,
        diffTimeout = 2000,
        onPageChange,
        autoResetPage = true,
        pageIndex: pageIndexProp,
        showLoader = true,
        manualPagination = true,
        isUseCursor = false,
    }) => {
        const data = useMemo(() => dataProp || [], [dataProp]);
        const hooks = useMemo(() => [
            expandRow ? useExpanded : null,
            useSortBy,
            usePagination,
        ].filter((d) => d !== null) as any, [expandRow]);
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            page,
            canPreviousPage,
            pageCount,
            gotoPage,
            canNextPage,
            nextPage,
            previousPage,
            setPageSize,
            pageOptions,
            prepareRow,
            visibleColumns,
            state: { pageIndex, pageSize },
        } = useTable({
            columns,
            data,
            autoResetPage,
            initialState: { pageSize: pageSizeProp || itemsPageSizeOptions[0], pageIndex: pageIndexProp || 0 },
            useControlledState: (state) => (
                useMemo(
                    () => ({
                        ...state,
                        pageIndex: pageIndexProp || 0,
                    }),
                    [state, pageIndexProp], // eslint-disable-line react-hooks/exhaustive-deps
                )
            ),
            defaultCanSort,
            manualPagination,
            pageCount: pageCountProp,
        }, ...hooks);
        const {
            expandedSpecialStyle = false,
            small = false,
            theme = undefined,
        } = styles;

        const haveSomeData = !!data.length;
        const dontHaveData = !data?.length;
        const worthShowTableSettings = !hideTableSettings && (!!title || !!leftBtns || !!btns);
        const getCellWrap = useCallback(
            (isEllipsis) => (isEllipsis ? Ellipsis : memo(({ children }) => <div>{children}</div>)),
            [],
        );
        const onChangePageSize = useCallback((size) => {
            setPageSize(size);
            onChangePageSizeProp(size);
        }, [onChangePageSizeProp, setPageSize]);
        return (
            <Box
                direction="column"
                className={cn(classes.wrap, { [classes.relative]: spinnerProps?.fullscreen }, classNames.wrap)}
            >
                {worthShowTableSettings && (
                    <div className={classes.tableSettings}>
                        <div className={classes.left}>
                            {title}
                            {leftBtns}
                        </div>
                        {!!btns && (
                            <div>
                                {btns}
                            </div>
                        )}
                    </div>
                )}
                {loading && showLoader && (
                    <Spinner className={classes.spinner} {...spinnerProps} />
                )}
                {called && !loading && (!!error || dontHaveData) && (
                    <div className={cn(classes.tableNoData, classNames.noData)}>{error || (noDataMessage ?? 'No Data')}</div>
                )}
                {haveSomeData && (
                    <table
                        className={cn(classes.table, classNames.table, {
                            [classes.small]: small,
                            [classes.gray]: theme === TableTheme.gray,
                            [classes.orange]: theme === TableTheme.orange,
                        })}
                        {...getTableProps()}
                    >
                        <thead className={cn(classes.thead)}>
                            {headerGroups.map((headerGroup) => (
                                <tr
                                    {...headerGroup.getHeaderGroupProps()}
                                >
                                    {headerGroup.headers.map((column) => {
                                        const CellWrap = getCellWrap((column as ColumnWithCustomProps).isEllipsis);
                                        return (
                                            <th
                                                className={cn(classes.th, classNames.th)}
                                                {...column.getHeaderProps({
                                                    ...column.getSortByToggleProps(),
                                                    style: { width: column?.width },
                                                })}
                                            >
                                                <Box alignItems="center">
                                                    <CellWrap className={classes.headerTitle}>
                                                        {column.render('Header')}
                                                    </CellWrap>
                                                    {
                                                        column.isSorted
                                                            ? (
                                                                <span className={classes.iconSort}>
                                                                    {
                                                                        column.isSortedDesc
                                                                            ? <ArrowDown {...iconProps} />
                                                                            : <ArrowUp {...iconProps} />
                                                                    }
                                                                </span>
                                                            )
                                                            : null
                                                    }
                                                </Box>
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row);
                                const rowProps = row.getRowProps();
                                const isDiff = diff && !!diff.get(row.index);
                                return (
                                    <Fragment key={rowProps.key}>
                                        <tr
                                            role="row"
                                            {...rowProps}
                                            {...(expandOnAllCells ? row?.getToggleRowExpandedProps?.() : {})}
                                            className={cn(classes.row, classNames.tr, {
                                                [classes.expanded]: row.isExpanded,
                                                [classNames.trExpandedFirst || '']: row.isExpanded,
                                                [classes.expandedSpecialStyle]: row.isExpanded && expandedSpecialStyle,
                                                [classes.diff]: isDiff,
                                            })}
                                            style={isDiff ? { animationDuration: `${diffTimeout}ms` } : {}}
                                        >
                                            {row.cells.map((cell, index) => {
                                                const CellWrap = getCellWrap((cell?.column as ColumnWithCustomProps).isEllipsis);
                                                return (
                                                    <td
                                                        className={cn(
                                                            classes.td,
                                                            classNames.td,
                                                        )}
                                                        {...cell.getCellProps()}
                                                    >
                                                        {row.isExpanded && index === 0 && expandedSpecialStyle && (
                                                            <div className={classes.expandedLeftBorderHeader} />
                                                        )}
                                                        <CellWrap>
                                                            {cell.render('Cell')}
                                                        </CellWrap>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                        {row.isExpanded ? (
                                            <tr className={cn(classes.expandedRow, classNames.trExpandedSecond)} role="row">
                                                <td
                                                    className={cn(
                                                        classes.td,
                                                        classNames.tdExpanded,
                                                    )}
                                                    colSpan={visibleColumns.length}
                                                >
                                                    {expandedSpecialStyle && <div className={classes.expandedLeftBorderBody} />}
                                                    {expandRow && expandRow({ row })}
                                                </td>
                                            </tr>
                                        ) : null}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                {!loading && (
                    <TablePagination
                        {...{
                            canPreviousPage,
                            pageCount,
                            gotoPage,
                            nextPage,
                            previousPage,
                            setPageSize: onChangePageSize,
                            pageOptions,
                            pageIndex,
                            pageSize,
                            page,
                            canNextPage,
                            itemsPageSizeOptions,
                            diff,
                            onPageChange,
                            isUseCursor,
                            theme,
                        }}
                    />
                )}
            </Box>
        );
    });
