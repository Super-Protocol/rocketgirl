import { OrderStatus } from '@super-protocol/sp-sdk-js';

export const getTooltipText = (status: OrderStatus): string => {
    if (!status) return '';
    switch (status) {
        case OrderStatus.New:
            return 'Waiting for TEE provider to start executing the order.';
        case OrderStatus.Processing:
            return 'TEE provider is executing the order.';
        case OrderStatus.Done:
            return 'TEE provider has completed the order. The results are ready.';
        case OrderStatus.Canceling:
            return 'Transaction needs to be confirmed by the user to cancel.';
        case OrderStatus.Error:
            return 'You can check the error message by clicking on the “Get result” button.';
        case OrderStatus.Blocked:
            return 'Sub-orders are being executed.';
        case OrderStatus.Suspended:
            return 'Sub-orders are being created.';
        case OrderStatus.Canceled:
            return 'Order is cancelled. Some results might be available through the “Get results” button.';
        default:
            return '';
    }
};
