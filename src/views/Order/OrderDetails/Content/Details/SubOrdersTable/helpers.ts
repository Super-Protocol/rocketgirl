import { TableTheme } from '@/uikit/Table/types';
import { OrderResult } from './types';

export const spinnerProps = { fullscreen: true };

export const styles = { theme: TableTheme.orange };

export const getSubOrdersList = (orders: OrderResult): string[] => (
    orders?.list
        ? orders.list.map(({ address }) => address)
        : []
);
