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
} from '@super-protocol/sp-sdk-js';
import {
    Encoding,
    Encryption,
} from '@super-protocol/sp-dto-js';
import { getBase64FromHex, getExternalId } from '@/common/helpers';

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

export interface CreateOrderPropsValues {
    offer: string;
    args?: string;
    slots?: number;
    parentTeeOrder?: string;
    inputOffers?: string[];
    selectedOffers?: string[];
    calcOrderDeposit?: number;
}

export interface CreateOrderProps {
    values: CreateOrderPropsValues;
}

export const createOrder = async (props: CreateOrderProps): Promise<string> => {
    const { values, actionAccountAddress, web3 } = props;
    const {
        offer,
        status,
        args = '',
        keyAlgorithm,
        slots = 0,
        parentTeeOrder,
        inputOffers = [],
        selectedOffers = [],
        calcOrderDeposit = 0,
    } = values || {};
    if (!actionAccountAddress) throw new Error('Address is empty');
    const orderMinDeposit = await Superpro.getParam(ParamName.OrderMinimumDeposit) || 0;
    // Convert encryption key to default encoding
    const resultPublicKeyBase64 = getBase64FromHex(getConsumerPublicKeyByAlgorithm(keyAlgorithm));

    const offerInstance = new TeeOffer(offer);
    const offerType = await offerInstance.getOfferType();
    const offerInfo = offerType === OfferType.TeeOffer
        ? await new TeeOffer(offer).getInfo()
        : await new Offer(offer).getInfo();
    const offerHoldSum = offerType === OfferType.TeeOffer ? 0 : (offerInfo as OfferInfo)?.holdSum;

    const parsedArgsPublicKey: Encryption = JSON.parse(offerInfo?.argsPublicKey);

    const params = {
        offer,
        resultPublicKey: keyAlgorithm ? JSON.stringify({
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
                status === SuspendedStatus.Suspended,
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
