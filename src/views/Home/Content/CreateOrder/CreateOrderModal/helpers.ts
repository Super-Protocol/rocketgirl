import * as Yup from 'yup';
import {
    Superpro,
    ParamName,
    OfferType,
} from '@super-protocol/sp-sdk-js';
import sum from 'lodash.sum';
import { ConvertNode } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { Offer, TeeOffer, TOfferType } from '@/gql/graphql';
import {
    FormValues, Offer as FormOffer,
    GetValidationSchemaProps,
    GetMinDepositWorkflow,
    Info,
} from './types';

export const valueOfferConvertNode: ConvertNode<Offer> = ({ node }) => ({
    value: node?.address,
    label: node?.offerInfo?.name || '',
    data: {
        description: node?.offerInfo?.description || '',
        name: node?.offerInfo?.name || '',
        holdSum: node?.offerInfo?.holdSum,
    },
});

export const teeOfferConvertNode: ConvertNode<TeeOffer> = ({ node }) => ({
    value: node?.address,
    label: node?.teeOfferInfo?.name || '',
    data: { description: node?.teeOfferInfo?.description || '', name: node?.teeOfferInfo?.name || '', holdSum: 0 },
});

export const solutionFilter = { offerType: TOfferType.Solution };
export const dataFilter = { offerType: TOfferType.Data };
export const storageFilter = { offerType: TOfferType.Storage };

const getOfferSchema = <Info = { value: string }>(field: string) => Yup.object().test(
    field,
    'required',
    (item) => item?.value,
) as Yup.AnySchema<FormOffer<Info>>;

export const getValidationSchema = <Info>(props?: GetValidationSchemaProps): Yup.SchemaOf<FormValues<Info>> => {
    const { minDeposit } = props || {};
    return Yup.object({
        solution: getOfferSchema<Info>('solution'),
        data: Yup.array().of(getOfferSchema<Info>('data')),
        tee: getOfferSchema<Info>('tee'),
        storage: getOfferSchema<Info>('storage'),
        deposit: minDeposit
            ? Yup.number()
                .required('required')
                .min(minDeposit, `must be greater than or equal ${minDeposit}`)
            : Yup.number().required('required'),
        file: Yup.string(), // todo
    });
};

export const getCalcOrderDeposit = async (
    offer: FormOffer<Info> | undefined,
    orderMinDeposit: number,
    type: OfferType,
): Promise<number> => {
    if (!offer) return 0;
    switch (type) {
        case OfferType.Storage:
        case OfferType.Solution:
        case OfferType.Data:
            return Math.max(orderMinDeposit, offer?.info?.holdSum || 0);
        case OfferType.TeeOffer:
            return Math.max(orderMinDeposit, 0);
        default:
            return 0;
    }
};

export const getCalcOrderDepositSum = async (
    offers: FormOffer<Info>[],
    orderMinDeposit: number,
    type: OfferType,
): Promise<number> => {
    if (!offers || !Array.isArray(offers) || !offers.length) return 0;
    return sum(await Promise.all(offers.map(async (offer) => getCalcOrderDeposit(offer, orderMinDeposit, type))));
};

export const getMinDepositWorkflow = async (formValues: GetMinDepositWorkflow): Promise<number> => {
    const orderMinDeposit = await Superpro.getParam(ParamName.OrderMinimumDeposit);
    const {
        data = [],
        solution,
        tee,
        storage,
    } = formValues || {};
    return sum([
        await getCalcOrderDepositSum(data, orderMinDeposit, OfferType.Data),
        await getCalcOrderDeposit(solution, orderMinDeposit, OfferType.Solution),
        await getCalcOrderDeposit(tee, orderMinDeposit, OfferType.TeeOffer),
        await getCalcOrderDeposit(storage, orderMinDeposit, OfferType.Storage),
    ]);
};
