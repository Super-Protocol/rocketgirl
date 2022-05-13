import React, {
    memo,
    FC,
    useContext,
    useCallback,
} from 'react';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { ListAdderEditor } from '@/uikit';
import { OffersListModalProps } from './types';

export const OffersListModal: FC<OffersListModalProps> = memo(({
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
    return (
        <ListAdderEditor
            fetcher={fetcher}
            isMulti={isMulti}
            values={value}
            onSave={onSave}
            onCancel={onCancel}
        />
    );
});
