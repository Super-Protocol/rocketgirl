import React, {
    memo,
    FC,
    useContext,
    useCallback,
} from 'react';
import { FormOffer } from '@/views/Home/Content/CreateOrder/CreateOrderModal/types';
import { TOfferType, useOffersSelectLazyQuery } from '@/gql/graphql';
import toastr from '@/services/Toastr/toastr';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { ListAdderEditor } from '@/uikit';
import { OffersListModalProps } from './types';

export const OffersListModal: FC<OffersListModalProps> = memo(({
    isMulti,
    fetcher,
    value,
    name,
    formValues,
    reset,
    isRequestBaseOffer,
    convertNode,
    offerType,
}) => {
    const [getOffersSelectLazyQuery] = useOffersSelectLazyQuery();
    const fetchBaseOffers = useCallback(async (list: string[], offerType: TOfferType) => {
        const offersBase = list?.length
            ? await getOffersSelectLazyQuery({
                variables: {
                    pagination: { first: Infinity },
                    filter: {
                        ids: list,
                        offerType,
                    },
                },
            })
            : undefined;
        if (!offersBase) return undefined;
        return convertNode ? offersBase?.data?.result?.page?.edges?.map(convertNode as any) : undefined;
    }, [getOffersSelectLazyQuery, convertNode]);
    const { goBack } = useContext(ModalOkCancelContext);
    const getBaseOffers = useCallback(async (item) => {
        let baseOffers;
        if (isRequestBaseOffer && offerType) {
            try {
                baseOffers = await fetchBaseOffers(
                    isMulti
                        ? (item as FormOffer[])?.map((el) => el?.data?.restrictions as string[]).flat()
                        : (item as FormOffer)?.data?.restrictions as string[], offerType,
                );
            } catch (e) {
                toastr.error('Error fetching base offer');
                return undefined;
            }
        }
        // get first base offer
        return baseOffers?.length ? [baseOffers[0]] : undefined;
    }, [isMulti, isRequestBaseOffer, offerType, fetchBaseOffers]);
    const onSave = useCallback(async (item) => {
        const baseOffers = isRequestBaseOffer ? await getBaseOffers(item) : undefined;
        const initialValues = {
            ...formValues,
            [name]: isMulti
                ? item.map((el) => ({ ...el, data: { ...el?.data, sub: baseOffers } }))
                : { ...item, data: { ...item?.data, sub: baseOffers } },
        };
        if (reset?.length) {
            reset.forEach((key) => delete initialValues[key]);
        }
        goBack({ props: { initialValues } });
    }, [goBack, name, formValues, reset, isRequestBaseOffer, getBaseOffers, isMulti]);
    const onCancel = useCallback(() => {
        goBack();
    }, [goBack]);
    const onError = useCallback((e) => {
        toastr.error(e);
    }, []);
    return (
        <ListAdderEditor
            fetcher={fetcher}
            isMulti={isMulti}
            values={value}
            onSave={onSave}
            onCancel={onCancel}
            onError={onError}
        />
    );
});
