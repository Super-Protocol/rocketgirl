import * as Yup from 'yup';
import {
    Superpro,
    ParamName,
    OfferType,
} from '@super-protocol/sp-sdk-js';
import sum from 'lodash.sum';
import { ConvertNode } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { Offer, TeeOffer, TOfferType } from '@/gql/graphql';
import { validateMnemonic } from '@/utils/crypto';
import { Item, Value } from '@/uikit/types';
import {
    FormValues,
    FormOffer,
    GetValidationSchemaProps,
    GetMinDepositWorkflow,
    Info,
    Fields,
    GetInitialFiltersResult,
} from './types';

export const valueOfferConvertNode: ConvertNode<Offer> = ({ node }): Item<Value, Info> => ({
    value: node?.address,
    label: node?.offerInfo?.name || '',
    data: {
        description: node?.offerInfo?.description || '',
        name: node?.offerInfo?.name || '',
        holdSum: node?.offerInfo?.holdSum || 0,
        restrictions: node?.offerInfo?.restrictions?.offers,
    },
});

export const teeOfferConvertNode: ConvertNode<TeeOffer> = ({ node }): Item<Value, Info> => ({
    value: node?.address,
    label: node?.teeOfferInfo?.name || '',
    data: {
        description: node?.teeOfferInfo?.description || '',
        name: node?.teeOfferInfo?.name || '',
        holdSum: 0,
    },
});

const getOfferSchema = (field: string) => Yup.object().test(
    field,
    'required',
    (item) => item?.value,
) as Yup.AnySchema<FormOffer>;

const getPhraseSchema = (field: string) => Yup.string().test(
    field,
    'Invalid phrase entered',
    (str = '') => validateMnemonic(str),
) as Yup.BaseSchema;

export const getValidationSchema = (props?: GetValidationSchemaProps): Yup.SchemaOf<FormValues> => {
    const { minDeposit } = props || {};
    return Yup.object({
        [Fields.solution]: getOfferSchema(Fields.solution),
        [Fields.data]: Yup.array().of(getOfferSchema(Fields.data)),
        [Fields.tee]: getOfferSchema(Fields.tee),
        [Fields.storage]: getOfferSchema(Fields.storage),
        [Fields.deposit]: minDeposit
            ? Yup.number()
                .required('required')
                .min(minDeposit, `must be greater than or equal ${minDeposit}`)
            : Yup.number().required('required'),
        [Fields.file]: Yup.mixed(),
        [Fields.phrase]: getPhraseSchema(Fields.phrase),
        [Fields.agreement]: Yup.boolean().required('required'),
        [Fields.phraseTabMode]: Yup.string(),
    });
};

export const getCalcOrderDeposit = async (
    offer: FormOffer | undefined,
    orderMinDeposit: number,
    type: OfferType,
): Promise<number> => {
    if (!offer) return 0;
    switch (type) {
        case OfferType.Storage:
        case OfferType.Solution:
        case OfferType.Data:
            return Math.max(orderMinDeposit, offer?.data?.holdSum || 0);
        case OfferType.TeeOffer:
            return Math.max(orderMinDeposit, 0);
        default:
            return 0;
    }
};

export const getCalcOrderDepositSum = async (
    offers: FormOffer[],
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
        solution = [],
        tee,
        storage,
    } = formValues || {};
    return sum([
        await getCalcOrderDepositSum(data, orderMinDeposit, OfferType.Data),
        await getCalcOrderDepositSum(solution, orderMinDeposit, OfferType.Solution),
        await getCalcOrderDeposit(tee, orderMinDeposit, OfferType.TeeOffer),
        await getCalcOrderDeposit(storage, orderMinDeposit, OfferType.Storage),
    ]);
};

export const getInitialFilters = (): GetInitialFiltersResult => {
    return {
        [Fields.solution]: { offerType: TOfferType.Solution, includeOfferRestrictionType: [TOfferType.Solution] },
        [Fields.data]: { offerType: TOfferType.Data },
        [Fields.storage]: { offerType: TOfferType.Storage },
        [Fields.tee]: {},
    };
};
