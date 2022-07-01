import React, {
    memo, FC, useMemo, useCallback, useContext,
} from 'react';
import { Content as ContentUIKit } from '@/uikit';
import { WalletContext } from '@/common/context/WalletProvider';
import { ContentProps } from './types';
import { MainTable } from './MainTable';
import classes from './Content.module.scss';
// import { FilterContext } from './FilterPopover/FilterContext';
import {
    getDiff,
    getTables,
    // getFilters,
} from './helpers';
import { useTables } from '../hooks/useTables';
import { Transactions } from './Transactions';

export const Content: FC<ContentProps> = memo(() => {
    const { selectedAddress } = useContext(WalletContext);
    const tables = useMemo(
        () => getTables({}),
        [],
    );
    const {
        queryFetcher, table, onChangeTable,
    } = useTables(tables[0]?.[0]?.value, selectedAddress);
    const diff = useMemo(() => getDiff(queryFetcher), [queryFetcher]);
    // const onSubmit = useCallback(({ values }) => {
    //     onChangeTable(table, getFilters(values));
    // }, [onChangeTable, table]);
    const handleTable = useCallback((newTable) => {
        if (table !== newTable) {
            onChangeTable(newTable, null);
        }
    }, [onChangeTable, table]);

    return (
        <ContentUIKit>
            {/*<FilterContext table={table} onSubmit={onSubmit}>*/}
            <MainTable
                classNameWrap={classes.mainTableWrap}
                table={table}
                onChangeTable={handleTable}
                tables={tables}
                fetcher={queryFetcher}
                diff={diff}
            />
            <Transactions fetcher={queryFetcher} diff={diff} />
        </ContentUIKit>
    );
});
