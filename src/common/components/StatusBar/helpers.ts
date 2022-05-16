import { OrderStatus } from '@super-protocol/sp-sdk-js';
import { Color } from '@/uikit/StatusBar/types';

export const getStatusBarColor = (status?: OrderStatus): Color | undefined => {
    if (!status) return undefined;
    switch (status) {
        case OrderStatus.New:
            return 'yellow';
        case OrderStatus.Processing:
            return 'blue';
        case OrderStatus.Done:
            return 'green';
        case OrderStatus.Canceling:
            return 'orange';
        case OrderStatus.Error:
            return 'red';
        case OrderStatus.Blocked:
            return 'violet';
        case OrderStatus.Suspended:
            return 'violet-light';
        case OrderStatus.Canceled:
            return 'grey';
        default:
            return undefined;
    }
};
