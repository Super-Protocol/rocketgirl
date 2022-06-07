import { Tables } from '@/views/Home/types';
import { TableTheme } from '@/uikit/Table/types';
import { getColumns as getColumnsProvider, ProviderColumns } from './columns/provider';
import { getColumns as getColumnsTEEOffers, TeeOffersColumns } from './columns/teeOffers';
import { getColumns as getColumnsOffers, OffersColumns } from './columns/offers';
import { getColumns as getColumnsOrders, OrdersColumns } from './columns/orders';
import { Columns as TransactionsColumns } from '../Transactions/types';

export type Columns = ProviderColumns
    | TeeOffersColumns
    | OffersColumns
    | OrdersColumns
    | TransactionsColumns;

export interface GetColumnsProps {
    table: Tables;
    showErrorModal: Function;
    showSuccessModal: Function;
    urlBack: string;
}

// todo type
export const getColumns = ({
    table,
    showErrorModal,
    showSuccessModal,
    urlBack,
}: GetColumnsProps): any => {
    switch (table) {
        case Tables.Providers:
            return getColumnsProvider();
        case Tables.TEEOffers:
            return getColumnsTEEOffers();
        case Tables.Offers:
            return getColumnsOffers();
        case Tables.Orders:
            return getColumnsOrders({ urlBack });
        default:
            return [];
    }
};

export const styles = { theme: TableTheme.orange };
