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
} from '@super-protocol/sp-sdk-js';
import Web3 from 'web3';
import {
    Encoding,
    Encryption,
    CryptoAlgorithm,
} from '@super-protocol/sp-dto-js';
import { getExternalId } from '@/common/helpers';
import { generateKeys } from '@/utils/crypto';

export interface CancelOrderProps { orderAddress?: string; web3?: Web3; actionAccountAddress?: string; }
export interface ReplenishOrderProps {
    orderAddress?: string;
    amount?: number;
    instance?: Web3;
    accountAddress?: string;
}
export type GetOrderInfoResult = OrderInfo;
export interface CreateOrderPropsValues {
    offer: string;
    args?: string;
    slots?: number;
    parentTeeOrder?: string;
    inputOffers?: string[];
    selectedOffers?: string[];
    calcOrderDeposit?: number;
    suspended?: boolean;
    keyAlgorithm?: CryptoAlgorithm;
    resultPublicKeyBase64?: string;
}
export interface CreateOrderProps {
    values: CreateOrderPropsValues;
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
}
export interface WorkflowProps {
    values: WorkflowPropsValues;
    actionAccountAddress: string;
    web3: Web3;
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

export const createOrder = async (props: CreateOrderProps): Promise<string> => {
    const { values, actionAccountAddress, web3 } = props;
    const {
        offer,
        suspended = false,
        args = '',
        keyAlgorithm,
        slots = 0,
        parentTeeOrder,
        inputOffers = [],
        selectedOffers = [],
        calcOrderDeposit = 0,
        resultPublicKeyBase64,
    } = values || {};
    if (!actionAccountAddress) throw new Error('Address is empty');
    const orderMinDeposit = await Superpro.getParam(ParamName.OrderMinimumDeposit) || 0;

    const offerInstance = new TeeOffer(offer);
    const offerType = await offerInstance.getOfferType();
    const offerInfo = offerType === OfferType.TeeOffer
        ? await new TeeOffer(offer).getInfo()
        : await new Offer(offer).getInfo();
    const offerHoldSum = offerType === OfferType.TeeOffer ? 0 : (offerInfo as OfferInfo)?.holdSum;

    const parsedArgsPublicKey: Encryption = JSON.parse(offerInfo?.argsPublicKey);

    const params = {
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
        throw new Error('Order address is empty');
    }
    return orderAddress;
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
    } = values || {};
    if (!mnemonic) throw new Error('Seed phrase required');
    const canceledOrders: string[] = [];
    const { publicKey } = generateKeys(mnemonic);
    try {
        const teeOrderAddress = await createOrder({
            actionAccountAddress,
            values: {
                resultPublicKeyBase64: publicKey,
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
        if (solution?.length) {
            for (let i = 0; i < solution.length; i++) {
                const offer = solution[i];
                const solutionOrderAddress = await createOrder({
                    actionAccountAddress,
                    values: {
                        parentTeeOrder: teeOrderAddress,
                        keyAlgorithm: CryptoAlgorithm.ECIES,
                        offer,
                        inputOffers: [],
                        selectedOffers: (storage ? [storage] : [])
                            .concat(tee || []),
                    },
                    web3,
                });
                canceledOrders.push(solutionOrderAddress);
            }
        }
        if (data?.length) {
            for (let i = 0; i < data.length; i++) {
                const offer = data[i];
                const dataOrder = await createOrder({
                    actionAccountAddress,
                    values: {
                        offer,
                        parentTeeOrder: teeOrderAddress,
                        keyAlgorithm: CryptoAlgorithm.ECIES,
                        inputOffers: [],
                        selectedOffers: (storage ? [storage] : [])
                            .concat(tee || []),
                    },
                    web3,
                });
                canceledOrders.push(dataOrder);
            }
        }
        await startOrder({ orderAddress: teeOrderAddress, actionAccountAddress, web3 });
    } catch (e) {
        for (let i = 0; i < canceledOrders.length; i++) {
            const orderAddress = canceledOrders[i];
            await cancelOrder({ actionAccountAddress, orderAddress, web3 });
        }
        throw e;
    }
};
