import {
    Superpro,
    ParamName,
    TeeOffer,
    OfferType,
    Offer,
    OfferInfo,
    OrderStatus,
    Crypto,
    OrdersFactory,
    Order,
    SuperproToken,
    OrderInfo,
    TeeOfferInfo,
    ExtendedOrderInfo,
} from '@super-protocol/sp-sdk-js';
import Web3 from 'web3';
import {
    Encoding,
    Encryption,
    CryptoAlgorithm,
} from '@super-protocol/sp-dto-js';
import { getExternalId } from '@/common/helpers';
import { generateECIESKeys } from '@/utils/crypto';

export interface CancelOrderProps { orderAddress?: string; web3?: Web3; actionAccountAddress?: string; }
export interface ReplenishOrderProps {
    orderAddress?: string;
    amount?: number;
    instance?: Web3;
    accountAddress?: string;
}
export type GetOrderInfoResult = OrderInfo;
export interface GetOrderParamsProps {
    offer: string;
    args?: string;
    slots?: number;
    inputOffers?: string[];
    selectedOffers?: string[];
    keyAlgorithm?: CryptoAlgorithm;
    resultPublicKeyBase64?: string;
}
export interface CreateOrderPropsValues extends GetOrderParamsProps {
    parentTeeOrder?: string;
    calcOrderDeposit?: number;
    suspended?: boolean;
}
export interface CreateOrderProps {
    values: CreateOrderPropsValues;
    actionAccountAddress: string;
    web3: Web3;
}
export interface CreateSubOrderProps {
    values: {
        list: GetOrderParamsProps[];
        order: string;
    };
    actionAccountAddress: string;
    web3: Web3;
    fetchOrderId?: boolean;
}
export interface GetCalcOrderDepositWorkflow {
    solution?: string[];
    data?: string[];
    tee?: string;
    storage?: string;
}
export interface StartOrderProps {
    orderAddress: string;
    actionAccountAddress: string;
    web3: Web3;
}
export interface WorkflowPropsValues {
    solution?: string[];
    data?: string[];
    tee: string;
    storage?: string;
    deposit: number;
    mnemonic: string;
    args?: string;
}
export interface WorkflowProps {
    values: WorkflowPropsValues;
    actionAccountAddress: string;
    web3: Web3;
}
export type GetOfferInfoResult = { offerType: OfferType; info: OfferInfo | TeeOfferInfo } | undefined;

export const cancelOrder = async ({ orderAddress, web3, actionAccountAddress }: CancelOrderProps): Promise<void> => {
    if (!orderAddress) throw new Error('Order address required');
    if (!actionAccountAddress) throw new Error('Account address required');
    if (!web3) throw new Error('Web3 instance required');
    await new Order(orderAddress).cancelOrder({ from: actionAccountAddress, web3 });
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

export const createOrderSubscription = async (
    creator: () => Promise<any>,
    consumer: string,
    externalId: string,
): Promise<string> => {
    return new Promise((res, rej) => {
        const subscription = OrdersFactory.onOrderCreated(async () => {
            try {
                const { orderId } = await OrdersFactory.getOrder(consumer, externalId);
                if (orderId) res(`${orderId}`);
                rej(new Error('Order id not found'));
            } catch (e) {
                rej(e);
            } finally {
                subscription();
            }
        });
        creator();
    });
};

export const createOrdersSubscription = async (
    creator: () => Promise<any>,
    consumer: string,
    externalsIds: string[],
): Promise<Map<string, string>> => {
    return new Promise((res, rej) => {
        const cache = new Map<string, null | string>(externalsIds.map((id) => [id, null]));
        const subscription = OrdersFactory.onOrderCreated(async () => {
            try {
                const list = await Promise.all(
                    [...cache]
                        .filter(([, orderId]) => typeof orderId === 'number')
                        .map(([externalId]) => OrdersFactory.getOrder(consumer, externalId)),
                );
                list.forEach(({ externalId, orderId }) => {
                    if (typeof (orderId as number | null) === 'number') {
                        cache.set(externalId, `${orderId}`);
                    }
                });
                if ([...cache].every(([, orderId]) => typeof orderId === 'string')) {
                    res(cache as Map<string, string>);
                }
            } catch (e) {
                rej(e);
            } finally {
                subscription();
            }
        });
        creator();
    });
};

export const getOrderParams = async (props: GetOrderParamsProps): Promise<OrderInfo> => {
    const {
        offer,
        args = '',
        keyAlgorithm,
        slots = 0,
        inputOffers = [],
        selectedOffers = [],
        resultPublicKeyBase64,
    } = props || {};
    const offerInstance = new TeeOffer(offer);
    const offerType = await offerInstance.getOfferType();
    const offerInfo = offerType === OfferType.TeeOffer
        ? await new TeeOffer(offer).getInfo()
        : await new Offer(offer).getInfo();
    const parsedArgsPublicKey: Encryption = JSON.parse(offerInfo?.argsPublicKey);

    return {
        offer,
        resultPublicKey: keyAlgorithm && resultPublicKeyBase64 ? JSON.stringify({
            algo: keyAlgorithm,
            encoding: Encoding.base64,
            key: resultPublicKeyBase64,
        }) : '',
        encryptedRequirements: '',
        encryptedArgs: args
            ? JSON.stringify(await Crypto.encrypt(args, parsedArgsPublicKey))
            : '',
        status: OrderStatus.New,
        args: {
            slots,
            inputOffers,
            selectedOffers,
        },
    };
};

export const getOfferInfo = async (offer?: string): Promise<GetOfferInfoResult> => {
    if (!offer) return undefined;
    const offerInstance = new TeeOffer(offer);
    const offerType = await offerInstance.getOfferType();
    return {
        offerType,
        info: offerType === OfferType.TeeOffer
            ? await new TeeOffer(offer).getInfo()
            : await new Offer(offer).getInfo(),
    };
};

export const getOfferHoldSum = async (offer?: string): Promise<number> => {
    const { info, offerType } = await getOfferInfo(offer) || {};
    return offerType === OfferType.TeeOffer ? 0 : (info as OfferInfo)?.holdSum;
};

export const createOrder = async (props: CreateOrderProps): Promise<string> => {
    const { values, actionAccountAddress, web3 } = props;
    const {
        offer,
        suspended = false,
        parentTeeOrder,
        calcOrderDeposit = 0,
    } = values || {};
    if (!actionAccountAddress) throw new Error('Account address is not defined');
    const orderMinDeposit = await Superpro.getParam(ParamName.OrderMinimumDeposit) || 0;
    const offerHoldSum = await getOfferHoldSum(offer);
    const params = await getOrderParams(values);
    const orderGuid = getExternalId();
    let orderAddress = '';
    const requiredDeposit = Math.max(offerHoldSum, orderMinDeposit);
    const deposit = Math.max(requiredDeposit, calcOrderDeposit);
    if (parentTeeOrder) {
        orderAddress = await createOrderSubscription(
            async () => new Order(parentTeeOrder).createSubOrder(
                params,
                true,
                orderGuid,
                deposit,
                { from: actionAccountAddress, web3 },
            ),
            actionAccountAddress,
            orderGuid,
        );
    } else {
        await SuperproToken.approve(
            OrdersFactory.address,
            deposit,
            { from: actionAccountAddress, web3 },
        );
        orderAddress = await createOrderSubscription(
            async () => OrdersFactory.createOrder(
                params,
                deposit,
                suspended,
                orderGuid,
                { from: actionAccountAddress, web3 },
            ),
            actionAccountAddress,
            orderGuid,
        );
    }
    if (!orderAddress) {
        throw new Error('Order address is not defined');
    }
    return orderAddress;
};

export const getSubOrdersParams = (list: GetOrderParamsProps[]): Promise<ExtendedOrderInfo[]> => {
    const externalId = getExternalId();
    return Promise.all(list.map(async (props) => {
        const { offer } = props || {};
        const offerHoldSum = await getOfferHoldSum(offer);
        const orderParams = await getOrderParams(props);
        return {
            ...orderParams,
            externalId,
            holdSum: offerHoldSum,
            blocking: false,
        };
    }));
};

export const createSubOrders = async (props: CreateSubOrderProps): Promise<Map<string, string> | void> => {
    const {
        values,
        actionAccountAddress,
        web3,
        fetchOrderId,
    } = props;
    const { list, order } = values || {};
    if (!actionAccountAddress) throw new Error('Account address is not defined');
    const subOrdersParams = await getSubOrdersParams(list);
    const fetcher = async () => new Order(order).createSubOrders(subOrdersParams, { from: actionAccountAddress, web3 });
    if (fetchOrderId) {
        return createOrdersSubscription(
            fetcher,
            actionAccountAddress,
            subOrdersParams.map(({ externalId }) => externalId),
        );
    }
    await fetcher();
};

export const startOrder = async (props: StartOrderProps): Promise<void> => {
    const { orderAddress, actionAccountAddress, web3 } = props || {};
    if (!orderAddress) throw new Error('Order address required');
    await new Order(orderAddress).start({ from: actionAccountAddress, web3 });
};

export const workflow = async (props: WorkflowProps): Promise<void> => {
    const { values, actionAccountAddress, web3 } = props;
    const {
        tee,
        storage,
        data,
        solution,
        deposit,
        mnemonic,
        args,
    } = values || {};
    if (!mnemonic) throw new Error('Passphrase required');
    const canceledOrders: string[] = [];
    const { publicKeyBase64 } = generateECIESKeys(mnemonic);
    try {
        const teeOrderAddress = await createOrder({
            actionAccountAddress,
            values: {
                args,
                resultPublicKeyBase64: publicKeyBase64,
                offer: tee,
                suspended: true,
                keyAlgorithm: CryptoAlgorithm.ECIES,
                calcOrderDeposit: deposit,
                inputOffers: (data || []).concat(solution || []),
                selectedOffers: storage ? [storage] : [],
            },
            web3,
        });
        canceledOrders.push(teeOrderAddress);
        const subOrdersInfo = (solution || []).concat(data || []).map((offer) => ({
            parentTeeOrder: teeOrderAddress,
            keyAlgorithm: CryptoAlgorithm.ECIES,
            offer,
            inputOffers: [],
            selectedOffers: (storage ? [storage] : [])
                .concat(tee || []),
        }));
        await createSubOrders({ values: { list: subOrdersInfo, order: teeOrderAddress }, web3, actionAccountAddress });
        await startOrder({ orderAddress: teeOrderAddress, actionAccountAddress, web3 });
    } catch (e) {
        for (let i = 0; i < canceledOrders.length; i++) {
            const orderAddress = canceledOrders[i];
            await cancelOrder({ actionAccountAddress, orderAddress, web3 });
        }
        throw e;
    }
};
