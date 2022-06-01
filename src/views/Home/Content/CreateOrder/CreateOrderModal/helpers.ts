import * as Yup from 'yup';
import {
    Superpro,
    ParamName,
    OfferType,
} from '@super-protocol/sp-sdk-js';
import sum from 'lodash.sum';
import { ConvertNode } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { WorkflowPropsValues } from '@/connectors/orders';
import { Offer, TeeOffer, TOfferType } from '@/gql/graphql';
import {
    FormValues,
    Offer as FormOffer,
    GetValidationSchemaProps,
    GetMinDepositWorkflow,
    Info,
    Fields,
    GetInitialFiltersResult,
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

const getOfferSchema = <Info = { value: string }>(field: string) => Yup.object().test(
    field,
    'required',
    (item) => item?.value,
) as Yup.AnySchema<FormOffer<Info>>;

export const getValidationSchema = <Info>(props?: GetValidationSchemaProps): Yup.SchemaOf<FormValues<Info>> => {
    const { minDeposit } = props || {};
    return Yup.object({
        [Fields.solution]: getOfferSchema<Info>('solution'),
        [Fields.data]: Yup.array().of(getOfferSchema<Info>('data')),
        [Fields.tee]: getOfferSchema<Info>('tee'),
        [Fields.storage]: getOfferSchema<Info>('storage'),
        [Fields.deposit]: minDeposit
            ? Yup.number()
                .required('required')
                .min(minDeposit, `must be greater than or equal ${minDeposit}`)
            : Yup.number().required('required'),
        [Fields.file]: Yup.string(), // todo
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

export const getWorkflowValues = (formValues: FormValues<Info>, mnemonic: string): WorkflowPropsValues => {
    const {
        solution,
        data,
        tee,
        storage,
        deposit,
    } = formValues;
    return {
        mnemonic: mnemonic || '',
        solution: [solution?.value as string],
        data: data?.map((d) => d?.value as string),
        tee: tee?.value as string,
        storage: storage?.value as string,
        deposit: deposit || 0,
    };
};

export const getInitialFilters = (): GetInitialFiltersResult => {
    return {
        [Fields.solution]: { offerType: TOfferType.Solution },
        [Fields.data]: { offerType: TOfferType.Data },
        [Fields.storage]: { offerType: TOfferType.Storage },
        [Fields.tee]: {},
    };
};
