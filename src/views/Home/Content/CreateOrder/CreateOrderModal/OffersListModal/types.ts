import { TOfferType } from '@/gql/graphql';
import { LazyLoadFetcher } from '@/uikit/types';
import { ConvertNode } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { FormOffer } from '@/views/Home/Content/CreateOrder/CreateOrderModal/types';

export interface OffersListModalPropsFetcherData { description?: string }

export interface OffersListModalProps {
    isMulti?: boolean;
    fetcher?: LazyLoadFetcher<OffersListModalPropsFetcherData> | null;
    value: FormOffer[] | FormOffer;
    name: string;
    formValues: any; // todo
    reset?: string[];
    isRequestBaseOffer?: boolean;
    convertNode?: ConvertNode<any>; // todo
    offerType?: TOfferType;
}
