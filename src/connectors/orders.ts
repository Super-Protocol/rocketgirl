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
export enum Process {
    FILE = 'FILE',
    TEE = 'TEE',
    SUB_ORDERS = 'SUB_ORDERS',
    ORDER_START = 'ORDER_START'
}

export enum Status {
    QUEUE = 'QUEUE',
    PROGRESS = 'PROGRESS',
    DONE = 'DONE',
    ERROR = 'ERROR',
}

export interface State {
    [process: string]: {
        status: Status,
        error?: Error,
    };
}

export interface ChangeStateProps {
    process: Process;
    status: Status;
    error?: Error;
    result?: any;
}

export interface WorkflowProps {
    values: WorkflowPropsValues;
    actionAccountAddress: string;
    web3: Web3;
    changeState: (props: ChangeStateProps) => void;
    state: State;
}
export type GetOfferInfoResult = { offerType: OfferType; info: OfferInfo | TeeOfferInfo } | undefined;
export interface CreateSubOrderResult {
    error?: Error;
    result?: Map<string, string | null>;
}

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
                if (orderId && orderId !== -1) {
                    subscription?.();
                    res(`${orderId}`);
                }
            } catch (e) {
                subscription?.();
                rej(e);
            }
        });
        creator().catch((e) => {
            subscription?.();
            rej(e);
        });
    });
};

// export const createSubOrdersSubscription = async (
//     creator: () => Promise<any>,
//     consumer: string,
//     externalsIds: string[],
// ): Promise<{ error?: Error, result?: Map<string, string | null> }> => {
//     console.log('externalsIds', externalsIds);
//     let count = 0;
//     return new Promise((res, rej) => {
//         const cache = new Map<string, null | string>(externalsIds.map((id) => [id, null]));
//         const subscription = OrdersFactory.onSubOrderCreated(async () => {
//             count += 1;
//             try {
//                 console.log('cache', cache, [...cache], count);
//                 const list = await Promise.all(
//                     [...cache]
//                         .filter(([, orderId]) => typeof orderId !== 'string')
//                         .map(async ([externalId]) => {
//                             const data = await OrdersFactory.getOrder(consumer, externalId);
//                             console.log('data', data);
//                             return { orderId: data.orderId, externalId };
//                         }),
//                 );
//                 console.log('list', list);
//                 list.forEach(({ externalId, orderId }) => {
//                     if (orderId && orderId !== -1) {
//                         cache.set(externalId, `${orderId}`);
//                     }
//                 });
//                 console.log('cache2', cache);
//                 if ([...cache].every(([, orderId]) => orderId)) {
//                     subscription?.();
//                     console.log('resolve', cache);
//                     res({ result: cache });
//                 }
//             } catch (e) {
//                 subscription?.();
//                 res({ error: e as Error, result: cache });
//             }
//         });
//         creator().catch((e) => {
//             subscription?.();
//             rej(e);
//         });
//     });
// };

const getOrder = (consumer, externalId, cache, cb) => {
    setTimeout(async () => {
        try {
            const { orderId } = await OrdersFactory.getOrder(consumer, externalId);
            console.log('orderId', orderId);
            if (orderId && orderId !== -1) {
                cache.set(externalId, `${orderId}`);
                if ([...cache].every(([, orderId]) => orderId)) {
                    cb({ result: cache });
                }
            } else {
                getOrder(consumer, externalId, cache, cb);
            }
        } catch (e) {
            cb({ error: e, result: cache });
        }
    }, 1000);
};

export const createSubOrdersSubscription = async (
    creator: () => Promise<any>,
    consumer: string,
    externalsIds: string[],
): Promise<{ error?: Error, result?: Map<string, string | null> }> => {
    await creator();
    console.log('nice');
    return new Promise((res) => {
        const cache = new Map<string, null | string>(externalsIds.map((id) => [id, null]));
        Promise.all(externalsIds.map((externalId) => getOrder(consumer, externalId, cache, res)));
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
    return Promise.all(list.map(async (props) => {
        const { offer } = props || {};
        const offerHoldSum = await getOfferHoldSum(offer);
        const orderParams = await getOrderParams(props);
        return {
            ...orderParams,
            externalId: getExternalId(),
            holdSum: offerHoldSum,
            blocking: true,
        };
    }));
};

export const createSubOrders = async (props: CreateSubOrderProps): Promise<CreateSubOrderResult> => {
    const {
        values,
        actionAccountAddress,
        web3,
    } = props;
    const { list, order } = values || {};
    if (!actionAccountAddress) throw new Error('Account address is not defined');
    const subOrdersParams = await getSubOrdersParams(list);
    console.log('subOrdersParams', subOrdersParams, list);
    await new Order(order).createSubOrders(subOrdersParams, { from: actionAccountAddress, web3 });
    console.log('after');
    return {} as any;
    // return createSubOrdersSubscription(
    //     fetcher,
    //     actionAccountAddress,
    //     subOrdersParams.map(({ externalId }) => externalId),
    // );
};

export const startOrder = async (props: StartOrderProps): Promise<void> => {
    const { orderAddress, actionAccountAddress, web3 } = props || {};
    if (!orderAddress) throw new Error('Order address required');
    await new Order(orderAddress).start({ from: actionAccountAddress, web3 });
};

export const workflow = async (props: WorkflowProps): Promise<void> => {
    const {
        values,
        actionAccountAddress,
        web3,
        changeState,
        state,
    } = props;
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
    const { publicKeyBase64 } = generateECIESKeys(mnemonic);
    changeState({ process: Process.TEE, status: Status.PROGRESS });
    // const teeOrderAddress = await createOrder({
    //     actionAccountAddress,
    //     values: {
    //         args,
    //         resultPublicKeyBase64: publicKeyBase64,
    //         offer: tee,
    //         suspended: true,
    //         keyAlgorithm: CryptoAlgorithm.ECIES,
    //         calcOrderDeposit: deposit,
    //         inputOffers: (data || []).concat(solution || []),
    //         selectedOffers: storage ? [storage] : [],
    //     },
    //     web3,
    // }).catch((e) => {
    //     changeState({ process: Process.TEE, status: Status.ERROR, error: e as Error });
    //     throw e;
    // });
    // changeState({ process: Process.TEE, status: Status.DONE, result: teeOrderAddress });
    const teeOrderAddress = '522';
    const subOrdersInfo = (solution || []).concat(data || []).map((offer) => ({
        parentTeeOrder: teeOrderAddress,
        keyAlgorithm: CryptoAlgorithm.ECIES,
        offer,
        inputOffers: [],
        selectedOffers: (storage ? [storage] : [])
            .concat(tee || []),
    }));
    changeState({ process: Process.SUB_ORDERS, status: Status.PROGRESS });
    const { error: errorSubOrders, result } = await createSubOrders({
        values: { list: subOrdersInfo, order: teeOrderAddress },
        web3,
        actionAccountAddress,
    });
    changeState({
        process: Process.SUB_ORDERS,
        status: Status.ERROR,
        result,
        error: errorSubOrders,
    });
    console.log('errorSubOrders', errorSubOrders, result);
    if (errorSubOrders) throw errorSubOrders;
    changeState({ process: Process.ORDER_START, status: Status.PROGRESS });
    // await startOrder({ orderAddress: teeOrderAddress, actionAccountAddress, web3 }).catch((e) => {
    //     changeState({ process: Process.ORDER_START, status: Status.ERROR, error: e as Error });
    //     throw e;
    // });
    changeState({ process: Process.ORDER_START, status: Status.DONE });
};

// export const cancelOrders = (canceledOrders: string[]) => {
//     try {
//
//     } catch (e) {
//         for (let i = 0; i < canceledOrders.length; i++) {
//             const orderAddress = canceledOrders[i];
//             await cancelOrder({ actionAccountAddress, orderAddress, web3 });
//         }
//         throw e;
//     }
// };
