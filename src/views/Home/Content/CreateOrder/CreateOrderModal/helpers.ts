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
import { Modes } from '@/uikit/MnemonicGenerator/types';
import { getExternalId } from '@/common/helpers';
import Web3 from 'web3';
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
        externalId: getExternalId(),
    },
});

export const teeOfferConvertNode: ConvertNode<TeeOffer> = ({ node }): Item<Value, Info> => ({
    value: node?.address,
    label: node?.teeOfferInfo?.name || '',
    data: {
        description: node?.teeOfferInfo?.description || '',
        name: node?.teeOfferInfo?.name || '',
        holdSum: 0,
        externalId: getExternalId(),
    },
});

const getOfferSchema = (field: string) => Yup.object().test(
    field,
    'required',
    (item) => item?.value,
) as Yup.AnySchema<FormOffer>;

export const getPhraseGeneratedSchema = (): Yup.BaseSchema => Yup.string().test(
    Fields.phraseGenerated,
    'Invalid phrase',
    // eslint-disable-next-line func-names
    function (value) {
        return this.parent[Fields.phraseTabMode] === Modes.generate ? validateMnemonic(value as string) : true;
    },
) as Yup.BaseSchema;

export const getPhraseInputSchema = (): Yup.BaseSchema => Yup.string().test(
    Fields.phraseInput,
    'Invalid phrase entered',
    // eslint-disable-next-line func-names
    function (value) {
        return this.parent[Fields.phraseTabMode] === Modes.own ? validateMnemonic(value as string) : true;
    },
) as Yup.BaseSchema;

export const getDepositSchema = (minDeposit?: number): Yup.BaseSchema => (minDeposit
    ? Yup.number()
        .required('required')
        .min(minDeposit, `must be greater than or equal ${minDeposit}`)
    : Yup.number().required('required'));

export const getValidationSchema = (props?: GetValidationSchemaProps): Yup.SchemaOf<FormValues> => {
    const { minDeposit } = props || {};
    return Yup.object({
        [Fields.solution]: getOfferSchema(Fields.solution),
        [Fields.data]: Yup.array().of(getOfferSchema(Fields.data)),
        [Fields.tee]: getOfferSchema(Fields.tee),
        [Fields.storage]: getOfferSchema(Fields.storage),
        [Fields.deposit]: getDepositSchema(minDeposit),
        [Fields.file]: Yup.mixed(),
        [Fields.phraseGenerated]: getPhraseGeneratedSchema(),
        [Fields.phraseInput]: getPhraseInputSchema(),
        [Fields.agreement]: Yup.boolean().oneOf([true], 'required'),
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
            return Number(Web3.utils.fromWei(offer?.data?.holdSum.toString() || '0'));
        case OfferType.TeeOffer:
            return orderMinDeposit;
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
    const orderMinDeposit = Math.round(Number(Web3.utils.fromWei(await Superpro.getParam(ParamName.OrderMinimumDeposit))) || 0);
    const {
        data = [],
        solution = [],
        tee,
        storage,
    } = formValues || {};
    return Math.max(
        sum([
            await getCalcOrderDepositSum(data, orderMinDeposit, OfferType.Data),
            await getCalcOrderDepositSum(solution, orderMinDeposit, OfferType.Solution),
            await getCalcOrderDeposit(tee, orderMinDeposit, OfferType.TeeOffer),
            await getCalcOrderDeposit(storage, orderMinDeposit, OfferType.Storage),
        ]),
        orderMinDeposit,
    );
};

export const getInitialFilters = (): GetInitialFiltersResult => {
    return {
        [Fields.solution]: { offerType: TOfferType.Solution, includeOfferRestrictionType: [TOfferType.Solution] },
        [Fields.data]: { offerType: TOfferType.Data },
        [Fields.storage]: { offerType: TOfferType.Storage },
        [Fields.tee]: {},
    };
};

export const scrollToPosition = (resolve: {[x: string]: string}): void => {
    const orderElements = {
        solution: 1,
        storage: 2,
        tee: 3,
        agreement: 4,
    };
    const keys = Object.keys(resolve);
    if (keys?.length) {
        const sorted = keys.sort((a, b) => orderElements[a] - orderElements[b]);

        document.getElementById(sorted[0])?.scrollIntoView({
            behavior: 'smooth',
        });
    }
};
