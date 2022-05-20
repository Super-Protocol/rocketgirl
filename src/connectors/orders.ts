import {
    Order,
    SuperproToken,
    OrdersFactory,
    OrderInfo,
} from '@super-protocol/sp-sdk-js';
import Web3 from 'web3';

export interface CancelOrderProps { orderAddress?: string; instance?: Web3; accountAddress?: string; }
export interface ReplenishOrderProps {
    orderAddress?: string;
    amount?: number;
    instance?: Web3;
    accountAddress?: string;
}
export type GetOrderInfoResult = OrderInfo;

export const cancelOrder = async ({ orderAddress, instance, accountAddress }: CancelOrderProps): Promise<void> => {
    if (!orderAddress) throw new Error('Order address required');
    if (!accountAddress) throw new Error('Account address required');
    if (!instance) throw new Error('Web3 instance required');
    await new Order(orderAddress).cancelOrder({ from: accountAddress, web3: instance });
};

export const replenishOrder = async ({
    orderAddress,
    amount,
    instance,
    accountAddress,
}: ReplenishOrderProps): Promise<void> => {
    if (!orderAddress) throw new Error('Order address required');
    if (!accountAddress) throw new Error('Account address required');
    if (!instance) throw new Error('Web3 instance required');
    if (!amount) throw new Error('Amount required');
    await SuperproToken.approve(
        OrdersFactory.address,
        amount,
        { from: accountAddress, web3: instance },
    );
    await OrdersFactory.refillOrderDeposit(orderAddress, amount, { from: accountAddress });
};

export const getOrderInfo = async (address?: string): Promise<GetOrderInfoResult> => {
    if (!address) throw new Error('Order address required');
    const order = new Order(address);
    return order.getOrderInfo();
};
