import * as Yup from 'yup';
import { ConvertNode } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { Offer, TeeOffer, TOfferType } from '@/gql/graphql';
import { FormValues, Offer as FormOffer } from './types';

export const valueOfferConvertNode: ConvertNode<Offer> = ({ node }) => ({
    value: node?.address,
    label: node?.offerInfo?.name || '',
    data: { description: node?.offerInfo?.description || '', name: node?.offerInfo?.name || '' },
});

export const teeOfferConvertNode: ConvertNode<TeeOffer> = ({ node }) => ({
    value: node?.address,
    label: node?.teeOfferInfo?.name || '',
    data: { description: node?.teeOfferInfo?.description || '', name: node?.teeOfferInfo?.name || '' },
});

export const solutionFilter = { offerType: TOfferType.Solution };
export const dataFilter = { offerType: TOfferType.Data };
export const storageFilter = { offerType: TOfferType.Storage };

const getOfferSchema = <Info = { value: string }>(field: string) => Yup.object().test(
    field,
    'required',
    (item) => item?.value,
) as Yup.AnySchema<FormOffer<Info>>;

export const getValidationSchema = <Info>(): Yup.SchemaOf<FormValues<Info>> => Yup.object({
    solution: getOfferSchema<Info>('solution'),
    data: Yup.array().of(getOfferSchema<Info>('data')),
    tee: getOfferSchema<Info>('tee'),
    storage: getOfferSchema<Info>('storage'),
    deposit: Yup.number().required('required'),
    file: Yup.string(), // todo
});
