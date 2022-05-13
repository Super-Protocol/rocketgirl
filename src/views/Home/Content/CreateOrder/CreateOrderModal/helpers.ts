import { ConvertNode } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { Offer, TeeOffer, TOfferType } from '@/gql/graphql';

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
