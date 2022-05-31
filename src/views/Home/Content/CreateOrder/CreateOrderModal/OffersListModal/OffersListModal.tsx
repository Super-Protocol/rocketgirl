import React, {
    memo,
    FC,
    useContext,
    useCallback,
} from 'react';
import intersectionby from 'lodash.intersectionby';
import toastr from '@/services/Toastr/toastr';
import { TOfferType, useOffersRestrictionsLazyQuery } from '@/gql/graphql';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { ListAdderEditor } from '@/uikit';
import { OffersListModalProps } from './types';

type Info = any; // todo

export const OffersListModal: FC<OffersListModalProps<Info>> = memo(({
    isMulti,
    fetcher,
    onSave: onSaveProps,
    value,
    name,
    formValues,
    reset,
}) => {
    const { goBack } = useContext(ModalOkCancelContext);
    const onSave = useCallback((value) => {
        onSaveProps?.(value);
        const initialValues = { ...formValues, [name]: value };
        if (reset?.length) {
            reset.forEach((key) => delete initialValues[key]);
        }
        goBack({ props: { initialValues } });
    }, [onSaveProps, goBack, name, formValues, reset]);
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
