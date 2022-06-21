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
    externalId: string;
}
export interface CreateOrderPropsValues extends GetOrderParamsProps {
    parentTeeOrder?: string;
    calcOrderDeposit?: number;
    suspended?: boolean;
    externalId: string;
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
export interface WorkflowPropsValuesOffer {
    value: string;
    externalId: string;
}
export interface WorkflowPropsValues {
    solution?: WorkflowPropsValuesOffer[];
    data?: WorkflowPropsValuesOffer[];
    tee: WorkflowPropsValuesOffer;
    storage?: WorkflowPropsValuesOffer;
    deposit: number;
    mnemonic: string;
    args?: string;
}
export interface GetSubOrdersKeyProps {
    consumer: string;
    offerId: string;
    externalId: string;
}
export enum Process {
    FILE = 'FILE',
    TEE = 'TEE',
    SOLUTION = 'SOLUTION',
    STORAGE = 'STORAGE',
    DATA = 'DATA',
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
        error?: Map<null | string, Error>;
        result?: Map<string | null, string>;
    };
}

export interface ChangeStateProps {
    process: Process;
    status: Status;
    error?: Map<null | string, Error>;
    result?: Map<string | null, string>;
}

export interface WorkflowProps {
    values: WorkflowPropsValues;
    actionAccountAddress: string;
    web3: Web3;
    changeState: (props: ChangeStateProps) => void;
    state?: State;
}
export interface CancelOrdersProps {
    canceledOrders: string[];
    actionAccountAddress: string;
    web3: Web3;
}
export interface CancelOrdersResultSuccess { value: string; }
export interface CancelOrdersResultError { value: string; error: any; }
export interface CancelOrdersResult {
    success: CancelOrdersResultSuccess[];
    error: CancelOrdersResultError[];
}
export type GetOfferInfoResult = { offerType: OfferType; info: OfferInfo | TeeOfferInfo } | undefined;
export interface CreateSubOrderResult {
    error?: Map<string | null, Error>;
    result?: Map<string | null, string>;
}
export interface ChangeStateSubOrderProps {
    consumer: string;
    changeState: (props: ChangeStateProps) => void;
    offers: WorkflowPropsValuesOffer[];
    errorSubOrders?: Map<string | null, Error>;
    successSubOrders?: Map<string | null, string>;
    previousResultSubOrders?: Map<string | null, string>;
    process: Process;
}
export interface ChangeStateSubOrdersProps {
    consumer: string;
    changeState: (props: ChangeStateProps) => void;
    data: WorkflowPropsValues['data'];
    solution: WorkflowPropsValues['solution'];
    storage: WorkflowPropsValues['storage'];
    errorSubOrders?: Map<string | null, Error>;
    successSubOrders?: Map<string | null, string>;
    previousResultSubOrders?: Map<Process, Map<string | null, string>>;
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
        const subscription = OrdersFactory.onOrderCreated((
            consumerCreated,
            externalIdCreated,
            offerIdCreated,
            orderIdCreated,
        ) => {
            if (orderIdCreated && externalIdCreated === externalId && consumerCreated === consumer) {
                subscription?.();
                res(`${orderIdCreated}`);
            }
        });
        creator().catch((e) => {
            subscription?.();
            rej(e);
        });
    });
};

export const getSubOrdersKey = ({
    consumer,
    offerId,
    externalId,
}: GetSubOrdersKeyProps): string => `${consumer}.${offerId}.${externalId}`;

export const createSubOrdersSubscription = async (
    creator: () => Promise<PromiseSettledResult<any>[]>,
    consumer: string,
    list: { offerId: string; externalId: string; }[],
): Promise<{ error?: Map<string | null, Error>, result?: Map<string | null, string> }> => {
    return new Promise((res) => {
        const listKeys = list.map(({ offerId, externalId }) => getSubOrdersKey({ consumer, offerId, externalId }));
        const cache = new Map<string | null, string>(
            listKeys.map((key) => [key, '']),
        );
        const externalsIds = list.map(({ externalId }) => externalId);
        const subscription = OrdersFactory.onOrderCreated((
            consumerCreated,
            externalIdCreated,
            offerIdCreated,
            orderIdCreated,
        ) => {
            if (
                orderIdCreated
                && externalsIds.includes(externalIdCreated)
                && consumerCreated === consumer
            ) {
                cache.set(
                    getSubOrdersKey({ consumer, offerId: offerIdCreated, externalId: externalIdCreated }),
                    `${orderIdCreated}`,
                );
            }
            if ([...cache].every(([, orderId]) => orderId)) {
                res({ result: cache });
            }
        });
        creator()
            .then((results) => {
                const error = results.reduce((acc, result, index) => {
                    if (result?.status === 'rejected') {
                        acc.set(listKeys[index], result?.reason);
                    }
                    return acc;
                }, new Map());
                if (error.size) {
                    res({ error, result: cache });
                }
            })
            .catch((e) => {
                subscription?.();
                const error = new Map().set(null, e);
                res({ error, result: cache });
            });
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
        externalId,
    } = values || {};
    if (!actionAccountAddress) throw new Error('Account address is not defined');
    const orderMinDeposit = await Superpro.getParam(ParamName.OrderMinimumDeposit) || 0;
    const offerHoldSum = await getOfferHoldSum(offer);
    const params = await getOrderParams(values);
    let orderAddress = '';
    const requiredDeposit = Math.max(offerHoldSum, orderMinDeposit);
    const deposit = Math.max(requiredDeposit, calcOrderDeposit);
    if (parentTeeOrder) {
        orderAddress = await createOrderSubscription(
            async () => new Order(parentTeeOrder).createSubOrder(
                params,
                true,
                externalId,
                deposit,
                { from: actionAccountAddress, web3 },
            ),
            actionAccountAddress,
            externalId,
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
                externalId,
                { from: actionAccountAddress, web3 },
            ),
            actionAccountAddress,
            externalId,
        );
    }
    if (!orderAddress) {
        throw new Error('Order address is not defined');
    }
    return orderAddress;
};

export const getSubOrdersParams = (list: GetOrderParamsProps[]): Promise<ExtendedOrderInfo[]> => {
    return Promise.all(list.map(async (props) => {
        const { offer, externalId } = props || {};
        const offerHoldSum = await getOfferHoldSum(offer);
        const orderParams = await getOrderParams(props);
        return {
            ...orderParams,
            externalId,
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
    const fetcher = async () => Promise.allSettled(
        subOrdersParams.map(({
            externalId,
            blocking,
            holdSum,
            ...subOrderParams
        }) => {
            return new Order(order).createSubOrder(
                subOrderParams,
                blocking,
                externalId,
                holdSum,
                { from: actionAccountAddress, web3 },
            );
        }),
    );
    return createSubOrdersSubscription(
        fetcher,
        actionAccountAddress,
        subOrdersParams.map(({ externalId, offer: offerId }) => ({ externalId, offerId })),
    );
};

export const startOrder = async (props: StartOrderProps): Promise<void> => {
    const { orderAddress, actionAccountAddress, web3 } = props || {};
    if (!orderAddress) throw new Error('Order address required');
    await new Order(orderAddress).start({ from: actionAccountAddress, web3 });
};

export const changeStateSubOrder = ({
    changeState,
    successSubOrders,
    errorSubOrders,
    offers,
    consumer,
    previousResultSubOrders,
    process,
}: ChangeStateSubOrderProps): void => {
    const keys = offers?.map(({ value, externalId }) => getSubOrdersKey({ consumer, offerId: value, externalId }), []) || [];
    const errorKeys = errorSubOrders ? keys.filter((key) => errorSubOrders.get(key)) : [];
    const successKeys = successSubOrders ? keys.filter((key) => successSubOrders.get(key)) : [];
    const previousSuccessKeys = previousResultSubOrders
        ? keys.filter((key) => previousResultSubOrders.get(key))
        : [];
    const allSuccessKeys = (successKeys || []).concat(previousSuccessKeys || []);
    const error = errorKeys?.length && errorSubOrders
        ? new Map([...errorSubOrders].filter(([key]) => errorKeys.includes(key as string)))
        : undefined;
    const result = allSuccessKeys?.length
        ? new Map(
            [...(successSubOrders || []), ...(previousResultSubOrders || [])]
                .filter(([key]) => allSuccessKeys.includes(key as string)),
        )
        : undefined;
    changeState({
        process,
        status: error?.size ? Status.ERROR : Status.DONE,
        result,
        error,
    });
};

export const changeStateSubOrders = ({
    changeState,
    successSubOrders,
    errorSubOrders,
    consumer,
    solution,
    storage,
    data,
    previousResultSubOrders,
}: ChangeStateSubOrdersProps): void => {
    changeStateSubOrder({
        successSubOrders,
        errorSubOrders,
        changeState,
        offers: solution || [],
        consumer,
        previousResultSubOrders: previousResultSubOrders?.get(Process.SOLUTION),
        process: Process.SOLUTION,
    });
    changeStateSubOrder({
        successSubOrders,
        errorSubOrders,
        changeState,
        offers: storage ? [storage] : [],
        consumer,
        previousResultSubOrders: previousResultSubOrders?.get(Process.STORAGE),
        process: Process.STORAGE,
    });
    changeStateSubOrder({
        successSubOrders,
        errorSubOrders,
        changeState,
        offers: data || [],
        consumer,
        previousResultSubOrders: previousResultSubOrders?.get(Process.DATA),
        process: Process.DATA,
    });
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
    const teeKey = getSubOrdersKey({
        consumer: actionAccountAddress,
        offerId: tee?.value,
        externalId: tee?.externalId,
    });
    let teeOrderAddress = state?.[Process.TEE]?.result
        ? state[Process.TEE].result?.get(teeKey)
        : undefined;
    if (state?.[Process.TEE]?.status !== Status.DONE || !teeOrderAddress) {
        changeState({ process: Process.TEE, status: Status.PROGRESS });
        teeOrderAddress = await createOrder({
            actionAccountAddress,
            values: {
                args,
                resultPublicKeyBase64: publicKeyBase64,
                offer: tee?.value,
                suspended: true,
                keyAlgorithm: CryptoAlgorithm.ECIES,
                calcOrderDeposit: deposit,
                inputOffers: (data || []).concat(solution || []).map(({ value }) => value),
                selectedOffers: storage ? [storage?.value] : [],
                externalId: tee?.externalId,
            },
            web3,
        }).catch((e) => {
            changeState({ process: Process.TEE, status: Status.ERROR, error: new Map().set(null, e as Error) });
            throw e;
        });
        changeState({ process: Process.TEE, status: Status.DONE, result: new Map().set(teeKey, teeOrderAddress) });
    }
    if (
        [
            state?.[Process.STORAGE]?.status,
            state?.[Process.SOLUTION]?.status,
            state?.[Process.DATA]?.status,
        ].some((status) => status !== Status.DONE)
    ) {
        if (state?.[Process.SOLUTION]?.status !== Status.DONE) {
            changeState({ process: Process.SOLUTION, status: Status.PROGRESS });
        }
        if (state?.[Process.DATA]?.status !== Status.DONE) {
            changeState({ process: Process.DATA, status: Status.PROGRESS });
        }
        if (state?.[Process.STORAGE]?.status !== Status.DONE) {
            changeState({ process: Process.STORAGE, status: Status.PROGRESS });
        }
        const previousResultSubOrders = new Map();
        if (state?.[Process.SOLUTION]?.result) previousResultSubOrders.set(Process.SOLUTION, state[Process.SOLUTION].result);
        if (state?.[Process.STORAGE]?.result) previousResultSubOrders.set(Process.STORAGE, state[Process.STORAGE].result);
        if (state?.[Process.DATA]?.result) previousResultSubOrders.set(Process.DATA, state[Process.DATA].result);
        const subOrdersInfo = (solution || [])
            .concat(data || [])
            .filter(({ value, externalId }) => {
                return ![...previousResultSubOrders]
                    .some(([, map]) => {
                        return map?.get?.(getSubOrdersKey({ consumer: actionAccountAddress, offerId: value, externalId }));
                    });
            })
            .map(({ value, externalId }) => ({
                parentTeeOrder: teeOrderAddress,
                keyAlgorithm: CryptoAlgorithm.ECIES,
                offer: value,
                inputOffers: [],
                selectedOffers: (storage?.value ? [storage.value] : [])
                    .concat(tee?.value ? tee.value : []),
                externalId,
            }));
        const { error: errorSubOrders, result: successSubOrders } = await createSubOrders({
            values: { list: subOrdersInfo, order: teeOrderAddress },
            web3,
            actionAccountAddress,
        });
        changeStateSubOrders({
            successSubOrders,
            errorSubOrders,
            changeState,
            solution,
            storage,
            data,
            consumer: actionAccountAddress,
            previousResultSubOrders,
        });
        if (errorSubOrders?.size) throw new Error('Some orders not created');
    }
    changeState({ process: Process.ORDER_START, status: Status.PROGRESS });
    await startOrder({ orderAddress: teeOrderAddress, actionAccountAddress, web3 }).catch((e) => {
        changeState({ process: Process.ORDER_START, status: Status.ERROR, error: new Map().set(null, e as Error) });
        throw e;
    });
    changeState({ process: Process.ORDER_START, status: Status.DONE });
};

export const cancelOrders = async (props: CancelOrdersProps): Promise<CancelOrdersResult> => {
    const {
        canceledOrders,
        web3,
        actionAccountAddress,
    } = props;
    return Promise
        .allSettled(
            canceledOrders.map((orderAddress) => {
                return cancelOrder({ actionAccountAddress, orderAddress, web3 });
            }),
        )
        .then((list) => {
            return list.reduce((acc, result, index) => {
                if (result?.status === 'fulfilled') {
                    acc.success.push({ value: canceledOrders[index] });
                } else {
                    acc.error.push({ value: canceledOrders[index], error: result?.reason });
                }
                return acc;
            }, { success: [] as CancelOrdersResultSuccess[], error: [] as CancelOrdersResultError[] });
        });
};
