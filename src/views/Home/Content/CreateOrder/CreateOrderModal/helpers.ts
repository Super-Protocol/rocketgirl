import * as Yup from 'yup';
import { ConvertNode } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { Offer, TeeOffer, TOfferType } from '@/gql/graphql';
import { FormValues } from './types';

export const valueOfferConvertNode: ConvertNode<Offer> = ({ node }) => ({
    value: node?.address,
    label: node?.offerInfo?.name || '',
    data: { description: node?.offerInfo?.description || '' },
});

export const teeOfferConvertNode: ConvertNode<TeeOffer> = ({ node }) => ({
    value: node?.address,
    label: node?.teeOfferInfo?.name || '',
    data: { description: node?.teeOfferInfo?.description || '' },
});

export const solutionFilter = { offerType: TOfferType.Solution };
export const dataFilter = { offerType: TOfferType.Data };
export const storageFilter = { offerType: TOfferType.Storage };

export const getValidationSchema = (): Yup.SchemaOf<FormValues> => Yup.object({
    solution: Yup.string().required(),
    data: Yup.array().of(Yup.string().required()),
    tee: Yup.string().required(),
    storage: Yup.string().required(),
    deposit: Yup.number().required(),
    file: Yup.string(), // todo
});

// export interface FormValues {
//     solution?: string;
//     data?: [];
//     tee?: string;
//     storage?: string;
//     file?: any; // todo
//     deposit?: number;
// }
