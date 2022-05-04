import {
    memo, FC, useMemo, useCallback, useContext,
} from 'react';
import { Box } from '@/uikit';
import { WalletContext } from '@/views/Home/context/walletContext';
import { ContentProps } from './types';
import { MainTable } from './MainTable';
import { Transactions } from './Transactions';
import classes from './Content.module.scss';
import { FilterContext } from './FilterPopover/FilterContext';
import { getTables, getFilters } from './helpers';
import { useTables } from '../hooks/useTables';

export const Content: FC<ContentProps> = memo(() => {
    const { selectedWalletType } = useContext(WalletContext);
    const tables = useMemo(
        () => getTables({}),
        [],
    );
    const {
        queryFetcher, table, onChangeTable,
    } = useTables(tables[0]?.[0]?.value, selectedWalletType);
    const onSubmit = useCallback(({ values }) => {
        onChangeTable(table, getFilters(values));
    }, [onChangeTable, table]);
    const handleTable = useCallback((newTable) => {
        if (table !== newTable) {
            onChangeTable(newTable, null);
        }
    }, [onChangeTable, table]);

    return (
        <Box direction="column">
            <FilterContext table={table} onSubmit={onSubmit}>
                <MainTable
                    classNameWrap={classes.mainTableWrap}
                    table={table}
                    onChangeTable={handleTable}
                    tables={tables}
                    fetcher={queryFetcher}
                />
            </FilterContext>
            <Transactions />
        </Box>
    );
});
