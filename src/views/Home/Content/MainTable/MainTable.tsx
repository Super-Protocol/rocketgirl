import React, {
    memo, FC, useMemo, useCallback,
} from 'react';
import isEqual from 'lodash.isequal';
import cn from 'classnames';
import { Table, Box } from '@/uikit';
import { useErrorModal } from '@/common/hooks/useErrorModal';
// import {
//     FilterForm,
//     FilterPanel,
//     FilterBtn,
// } from '@/views/Home/Content/FilterPopover';
import { useGoBackUrl } from '@/common/hooks/useGoBackUrl';
import useMemoCompare from '@/common/hooks/useMemoCompare';
import { NoAccountBlock } from '@/common/components/NoAccountBlock';
import { FetcherByTable } from '@/views/Home/hooks/useTablesQueryFetcher';
import { CreateOrder } from '@/views/Home/Content/CreateOrder/CreateOrder';
import { GetDiffIndexesResult } from '@/views/Home/Content/types';
import { getDiffIndexes } from '@/views/Home/Content/helpers';
import { MainTableProps } from './types';
import { TableHeaderList } from '../TableHeaderList';
import classes from './MainTable.module.scss';
import {
    getColumns,
    Columns,
    styles,
} from './helpers';

export const MainTable: FC<MainTableProps> = memo(({
    classNameWrap,
    table,
    onChangeTable,
    tables,
    fetcher,
    diff,
}) => {
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const urlBack = useGoBackUrl();
    const active: FetcherByTable = useMemo(() => fetcher[table], [fetcher, table]);
    const columns = useMemo(
        () => getColumns({
            table,
            showErrorModal,
            showSuccessModal,
            urlBack,
        }),
        [table, showErrorModal, showSuccessModal, urlBack],
    );
    const onPageChange = useCallback(({ pageIndex, pageClick }) => {
        active?.onChangePage({
            pageClick,
            pageIndex,
        });
    }, [active]);
    const onChangePageSize = useCallback((size) => {
        active?.onChangePageSize(size);
    }, [active]);
    const activeDiffIndexes = useMemo(() => getDiffIndexes(active), [active]);
    const activeDiffIndexesMemoCompare = useMemoCompare<GetDiffIndexesResult>(activeDiffIndexes, isEqual);
    const spinnerProps = useMemo(() => ({ fullscreen: true }), []);
    const skip = useMemo(() => active?.skip, [active]);
    const data = useMemo(() => (!skip && active?.list ? active?.list : []), [active, skip]);
    const pageCount = useMemo(() => (!skip ? active?.pageCount : 0), [active, skip]);

    return (
        <Box direction="column" className={cn(classes.wrap, classNameWrap)}>
            <Box direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box direction="column">
                    <Box alignItems="center" className={classes.listWrap}>
                        <TableHeaderList
                            list={tables}
                            active={table}
                            diff={diff}
                            onChange={onChangeTable}
                        />
                        {/*{!skip && <FilterBtn />}*/}
                    </Box>
                    {/*<FilterPanel className={classes.filterPanel}>*/}
                    {/*    <FilterForm />*/}
                    {/*</FilterPanel>*/}
                </Box>
                <Box>
                    <CreateOrder />
                </Box>
            </Box>
            {!skip ? (
                <Table
                    <Columns>
                    pageIndex={active?.pageIndex}
                    diff={activeDiffIndexesMemoCompare}
                    columns={columns}
                    data={data}
                    pageCount={pageCount}
                    pageSize={active?.pageSize}
                    diffTimeout={3000}
                    onPageChange={onPageChange}
                    onChangePageSize={onChangePageSize}
                    spinnerProps={spinnerProps}
                    loading={active?.loading}
                    error={active?.error ? 'Error' : ''}
                    noDataMessage={active?.noDataMessage}
                    called
                    styles={styles}
                    showLoader
                    isUseCursor
                />
            ) : <NoAccountBlock message={skip?.message} />}
        </Box>
    );
});
