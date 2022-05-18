import React, {
    memo,
    FC,
    useContext,
    useCallback,
} from 'react';
import toastr from '@/services/Toastr/toastr';
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
}) => {
    const { goBack } = useContext(ModalOkCancelContext);
    const onSave = useCallback((value) => {
        onSaveProps?.(value);
        goBack({ props: { initialValues: { ...formValues, [name]: value } } });
    }, [onSaveProps, goBack, name, formValues]);
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
