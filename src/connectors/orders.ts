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
} from '@super-protocol/sdk-js';
import Web3 from 'web3';
import {
    Encoding,
    Encryption,
    CryptoAlgorithm,
} from '@super-protocol/dto-js';
import { generateECIESKeys } from '@/utils/crypto';

export interface CancelOrderProps {
    orderId?: string;
    subOrdersList?: string[],
    web3?: Web3;
    actionAccountAddress?: string;
}
export interface ReplenishOrderProps {
    orderId?: string;
    amount?: number;
    instance?: Web3;
    accountAddress?: string;
}
export interface GetOrderSdk {
    orderInfo: OrderInfo;
    depositSpent: string;
    orderHoldDeposit: string;
}
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
    isNeedApprove?: boolean;
    onApproveSuccess?: () => void
    onApproveError?: (e: Error) => void
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
    orderId: string;
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
    TEE_APPROVE = 'TEE_APPROVE',
    TEE = 'TEE',
    SOLUTION = 'SOLUTION',
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
export interface CancelOrdersResultError { value: string; error?: Error; }
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

export const cancelOrder = async ({
    orderId,
    subOrdersList,
    web3,
    actionAccountAddress,
}: CancelOrderProps): Promise<void> => {
    if (!orderId) throw new Error('Order id required');
    if (!actionAccountAddress) throw new Error('Account address required');
    if (!web3) throw new Error('Web3 instance required');
    if (subOrdersList) {
        await Promise.all(
            subOrdersList.map(async (id) => {
                await new Order(id).cancelOrder({ from: actionAccountAddress, web3 });
            }),
        );
    }
    await new Order(orderId).cancelOrder({ from: actionAccountAddress, web3 });
};

export const replenishOrder = async ({
    orderId,
    amount,
    instance,
    accountAddress,
}: ReplenishOrderProps): Promise<void> => {
    if (!orderId) throw new Error('Order id required');
    if (!accountAddress) throw new Error('Account address required');
    if (!instance) throw new Error('Web3 instance required');
    if (!amount) throw new Error('Amount required');

    const amountInWei = Web3.utils.toWei(amount.toString());

    await SuperproToken.approve(
        OrdersFactory.address,
        amountInWei,
        { from: accountAddress, web3: instance },
    );
    await OrdersFactory.refillOrderDeposit(orderId, amountInWei, { from: accountAddress, web3: instance });
};

export const getOrderSdk = async (id?: string): Promise<GetOrderSdk> => {
    if (!id) throw new Error('Order id required');
    const order = new Order(id);
    const orderInfo = await order.getOrderInfo();
    const depositSpent = await order.getDepositSpent();
    const orderHoldDeposit = await OrdersFactory.getOrderHoldDeposit(id);
    return {
        orderInfo,
        depositSpent,
        orderHoldDeposit,
    };
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

// uniq key for order
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
        // caching fetched order ids
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
            // if all order ids in the cache
            if ([...cache].every(([, orderId]) => orderId)) {
                subscription?.();
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
                    subscription?.();
                    res({ error, result: cache });
                }
            })
            .catch((e) => {
                subscription?.();
                res({ error: new Map().set(null, e), result: cache });
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

export const getOfferHoldSum = async (offer?: string): Promise<string> => {
    const { info, offerType } = await getOfferInfo(offer) || {};
    return offerType === OfferType.TeeOffer ? '0' : (info as OfferInfo)?.holdSum;
};

export const createOrder = async (props: CreateOrderProps): Promise<string> => {
    const {
        values,
        actionAccountAddress,
        web3,
        isNeedApprove = true,
        onApproveSuccess,
        onApproveError,
    } = props;
    const {
        offer,
        suspended = false,
        parentTeeOrder,
        calcOrderDeposit = 0,
        externalId,
    } = values || {};
    if (!actionAccountAddress) throw new Error('Account address is not defined');
    const orderMinDeposit = Number(Web3.utils.fromWei(await Superpro.getParam(ParamName.OrderMinimumDeposit) || '0'));
    const offerHoldSum = Number(Web3.utils.fromWei(await getOfferHoldSum(offer)));
    const params = await getOrderParams(values);
    let orderId = '';
    const requiredDeposit = Math.max(offerHoldSum, orderMinDeposit);
    const deposit = Web3.utils.toWei(Math.max(requiredDeposit, calcOrderDeposit).toString());
    if (parentTeeOrder) {
        orderId = await createOrderSubscription(
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
        if (isNeedApprove) {
            try {
                await SuperproToken.approve(
                    OrdersFactory.address,
                    deposit,
                    { from: actionAccountAddress, web3 },
                );
                onApproveSuccess?.();
            } catch (e) {
                onApproveError?.(e as Error);
                throw e;
            }
        }
        orderId = await createOrderSubscription(
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
    if (!orderId) {
        throw new Error('Order id is not defined');
    }
    return orderId;
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
    // allSettled - wait all transactions
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
    const { orderId, actionAccountAddress, web3 } = props || {};
    if (!orderId) throw new Error('Order id required');
    await new Order(orderId).start({ from: actionAccountAddress, web3 });
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
    // all uniq keys
    const keys = offers?.map(({ value, externalId }) => getSubOrdersKey({ consumer, offerId: value, externalId }), []) || [];
    // only error keys
    const errorKeys = errorSubOrders ? keys.filter((key) => errorSubOrders.get(key)) : [];
    // new success keys
    const successKeys = successSubOrders ? keys.filter((key) => successSubOrders.get(key)) : [];
    // already submitted keys
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
        offers: data || [],
        consumer,
        previousResultSubOrders: previousResultSubOrders?.get(Process.DATA),
        process: Process.DATA,
    });
};

export const workflow = async (props: WorkflowProps): Promise<string | undefined> => {
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
    let teeOrderId = state?.[Process.TEE]?.result
        ? state[Process.TEE].result?.get(teeKey)
        : undefined;
    if (state?.[Process.TEE]?.status !== Status.DONE || !teeOrderId) {
        changeState({ process: Process.TEE, status: Status.PROGRESS });
        teeOrderId = await createOrder({
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
                slots: 1,
            },
            web3,
            isNeedApprove: state?.[Process.TEE_APPROVE]?.status !== Status.DONE,
            onApproveSuccess: () => changeState({ process: Process.TEE_APPROVE, status: Status.DONE }),
            onApproveError: (e) => changeState({
                process: Process.TEE_APPROVE,
                status: Status.ERROR,
                error: new Map().set(null, e),
            }),
        }).catch((e) => {
            changeState({ process: Process.TEE, status: Status.ERROR, error: new Map().set(null, e as Error) });
            throw e;
        });
        changeState({ process: Process.TEE, status: Status.DONE, result: new Map().set(teeKey, teeOrderId) });
    }
    if (
        [
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
        const previousResultSubOrders = new Map();
        if (state?.[Process.SOLUTION]?.result) previousResultSubOrders.set(Process.SOLUTION, state[Process.SOLUTION].result);
        if (state?.[Process.DATA]?.result) previousResultSubOrders.set(Process.DATA, state[Process.DATA].result);
        const subOrdersInfo = (solution || [])
            .concat(data || [])
            .filter(({ value, externalId }) => {
                return ![...previousResultSubOrders]
                    .some(([, map]) => {
                        // filter already submitted
                        return map?.get?.(getSubOrdersKey({ consumer: actionAccountAddress, offerId: value, externalId }));
                    });
            })
            .map(({ value, externalId }) => ({
                parentTeeOrder: teeOrderId,
                keyAlgorithm: CryptoAlgorithm.ECIES,
                offer: value,
                inputOffers: [],
                selectedOffers: (storage?.value ? [storage.value] : [])
                    .concat(tee?.value ? tee.value : []),
                externalId,
            }));
        const { error: errorSubOrders, result: successSubOrders } = await createSubOrders({
            values: { list: subOrdersInfo, order: teeOrderId },
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
        if (errorSubOrders?.size) throw new Error('Workflow sub orders error');
    }
    changeState({ process: Process.ORDER_START, status: Status.PROGRESS });
    await startOrder({ orderId: teeOrderId, actionAccountAddress, web3 }).catch((e) => {
        changeState({ process: Process.ORDER_START, status: Status.ERROR, error: new Map().set(null, e as Error) });
        throw e;
    });
    changeState({ process: Process.ORDER_START, status: Status.DONE });
    return teeOrderId;
};

export const cancelOrders = async (props: CancelOrdersProps): Promise<CancelOrdersResult> => {
    const {
        canceledOrders,
        web3,
        actionAccountAddress,
    } = props;
    return Promise
        .allSettled(
            canceledOrders.map((orderId) => {
                return cancelOrder({ actionAccountAddress, orderId, web3 });
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

export const onOrdersStatusUpdatedSubscription = (cb: (status: OrderStatus) => void, orderId: string): () => void => {
    return OrdersFactory.onOrdersStatusUpdated(
        (_, status: OrderStatus) => {
            cb(status);
        },
        orderId,
    );
};
