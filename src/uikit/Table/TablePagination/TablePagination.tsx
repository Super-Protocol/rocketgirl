import {
    memo, FC, useMemo, useCallback,
} from 'react';
import {
    DropdownButton,
    Dropdown,
    Pagination,
} from 'react-bootstrap';
import cn from 'classnames';
import { Box, Icon } from '@/uikit';
import { PageClick, TablePaginationProps } from './types';
import { TableTheme } from '../types';
import classes from './TablePagination.module.scss';
import { getActiveIndexes, getPagesGroups } from './helpers';

export const TablePagination: FC<TablePaginationProps> = memo(({
    canPreviousPage,
    gotoPage,
    pageIndex,
    canNextPage,
    pageCount,
    pageSize,
    setPageSize,
    itemsPageSizeOptions,
    // diff,
    onPageChange: onPageChangeProp = () => {},
    isUseCursor = false,
    theme,
}) => {
    const pageGroups = useMemo(() => getPagesGroups(pageIndex + 1, pageCount, isUseCursor), [pageIndex, pageCount, isUseCursor]);
    // const diffsIndexes = useMemo(() => (diff ? Array.from(diff.keys()) : []), [diff]);
    // const diffsPages = useMemo(() => diffsIndexes.map((index) => Math.floor(index / pageSize)), [diffsIndexes, pageSize]);
    const onPageChange = useCallback((page, pageClick) => {
        onPageChangeProp({
            oldPageIndex: pageIndex,
            pageIndex: page,
            pageSize,
            indexes: getActiveIndexes(pageSize, page),
            pageCount,
            pageClick,
        });
    }, [onPageChangeProp, pageSize, pageIndex, pageCount]);
    const goToPage = useCallback((index, pageClick) => {
        gotoPage(index);
        onPageChange(index, pageClick);
    }, [gotoPage, onPageChange]);
    const goPageGroup = useCallback((page) => {
        goToPage(page, page > pageIndex ? PageClick.NEXT : PageClick.BACK);
    }, [pageIndex, goToPage]);
    const goFirstPage = useCallback(() => {
        goToPage(0, PageClick.FIRST);
    }, [goToPage]);
    const goLastPage = useCallback(() => {
        const lastPage = pageCount - 1;
        goToPage(lastPage, PageClick.LAST);
    }, [pageCount, goToPage]);
    const goNextPage = useCallback(() => {
        const nextPage = pageIndex + 1;
        goToPage(nextPage, PageClick.NEXT);
    }, [goToPage, pageIndex]);
    const goPreviousPage = useCallback(() => {
        const prevPage = pageIndex - 1;
        goToPage(prevPage, PageClick.BACK);
    }, [goToPage, pageIndex]);

    if (!pageCount) return null;

    return (
        <Box className={cn(classes.wrap, { [classes.orange]: theme === TableTheme.orange })}>
            <div className={classes.left}>
                <Pagination>
                    <Pagination.First
                        onClick={goFirstPage}
                        disabled={!canPreviousPage}
                    >
                        <Icon name="chevronallleft" width={14} />
                    </Pagination.First>
                    <Pagination.Prev onClick={goPreviousPage} disabled={!canPreviousPage}>
                        <Icon name="chevronleft" width={14} />
                    </Pagination.Prev>
                    {pageGroups.map((pg, ni) => (pg !== null ? (
                        pg.map((page, i) => (
                            <Pagination.Item
                                key={`pgi-${ni}-${i}`}
                                onClick={() => (isUseCursor ? null : goPageGroup(page - 1))}
                                active={pageIndex === page - 1}
                                className={cn({
                                    // [classes.diff]: diffsPages.includes(page - 1),
                                    [classes.cursorPage]: isUseCursor,
                                })}
                            >
                                {isUseCursor ? `Page ${page} of ${pageCount}` : page}
                            </Pagination.Item>
                        ))
                    ) : (
                        <Pagination.Ellipsis key={`pge-${ni}`} />
                    )))}
                    <Pagination.Next onClick={goNextPage} disabled={!canNextPage}>
                        <Icon name="chevronright" width={14} />
                    </Pagination.Next>
                    <Pagination.Last onClick={goLastPage} disabled={!canNextPage}>
                        <Icon name="chevronallright" width={14} />
                    </Pagination.Last>
                </Pagination>
            </div>
            <div className={classes.right}>
                <DropdownButton
                    drop="up"
                    title={pageSize || ''}
                    variant="default"
                    id="items-per-page-select"
                    size="sm"
                    className={cn(classes.dropdown, { [classes.orange]: theme === TableTheme.orange })}
                >
                    {(itemsPageSizeOptions || []).map((option) => (
                        <Dropdown.Item
                            key={`option-${option}`}
                            onClick={() => setPageSize(option)}
                            className={classes.dropdownItem}
                        >
                            {option}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>
        </Box>
    );
});
