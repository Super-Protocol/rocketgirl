import {
    memo, FC, useMemo, useCallback, useContext,
} from 'react';
import isEqual from 'lodash.isequal';
import cn from 'classnames';
import { Table, Box } from '@/uikit';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import {
    FilterForm,
    FilterPanel,
    FilterBtn,
} from '@/views/Home/Content/FilterPopover';
import useMemoCompare from '@/common/hooks/useMemoCompare';
import { FetcherByTable } from '@/views/Home/hooks/useTablesQueryFetcher';
import { TableTheme } from '@/uikit/Table/types';
import { GetDiffIndexesResult, MainTableProps } from './types';
import { MainTableList } from './MainTableList';
import classes from './MainTable.module.scss';
import {
    getColumns,
    Columns,
    getDiff,
    getDiffIndexes,
} from './helpers';

export const MainTable: FC<MainTableProps> = memo(({
    classNameWrap,
    table,
    onChangeTable,
    tables,
    fetcher,
}) => {
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const active: FetcherByTable = useMemo(() => fetcher[table], [fetcher, table]);
    const columns = useMemo(
        () => getColumns({
            table,
            showErrorModal,
            showSuccessModal,
        }),
        [table, showErrorModal, showSuccessModal],
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
    const diff = useMemo(() => getDiff(fetcher), [fetcher]);
    const activeDiffIndexes = useMemo(() => getDiffIndexes(active), [active]);
    const activeDiffIndexesMemoCompare = useMemoCompare<GetDiffIndexesResult>(activeDiffIndexes, isEqual);
    const spinnerProps = useMemo(() => ({ fullscreen: true }), []);
    const data = useMemo(() => active?.list || [], [active]);

    return (
        <Box direction="column" className={cn(classes.wrap, classNameWrap)}>
            <Box direction="column">
                <Box alignItems="center" className={classes.listWrap}>
                    <MainTableList
                        list={tables}
                        active={table}
                        diff={diff}
                        onChange={onChangeTable}
                    />
                    <FilterBtn />
                </Box>
                <FilterPanel className={classes.filterPanel}>
                    <FilterForm />
                </FilterPanel>
            </Box>
            <Table
                <Columns>
                pageIndex={active?.pageIndex}
                diff={activeDiffIndexesMemoCompare}
                columns={columns}
                data={data}
                pageCount={active?.pageCount}
                pageSize={active?.pageSize}
                diffTimeout={3000}
                onPageChange={onPageChange}
                onChangePageSize={onChangePageSize}
                spinnerProps={spinnerProps}
                loading={active?.loading}
                error={active?.error ? 'Error' : ''}
                noDataMessage={active?.noDataMessage}
                called
                styles={{ theme: TableTheme.beige }}
                showLoader
                classNames={{
                    th: classes.th,
                }}
                isUseCursor
            />
        </Box>
    );
});
