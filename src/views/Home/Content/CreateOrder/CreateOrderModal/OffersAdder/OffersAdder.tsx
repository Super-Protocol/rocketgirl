import React, {
    memo,
    FC,
    useCallback,
    useContext, useMemo,
} from 'react';
import { useFormikContext } from 'formik';
import { ListAdderViewFormik } from '@/uikit';
import { useSelectQueryCursorSPFetcher } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { OffersAdderProps } from './types';
import { OffersListModal } from '../OffersListModal';
import { FormValues } from '../types';

export const OffersAdder: FC<OffersAdderProps> = memo(({
    query,
    label,
    name,
    isMulti = false,
    filter,
}) => {
    const { values } = useFormikContext<FormValues>();
    const value = useMemo(() => values?.[name], [values, name]);
    const { goNext } = useContext(ModalOkCancelContext);
    const { fetcher } = useSelectQueryCursorSPFetcher<any>({ // todo
        query,
        convertNode: ({ node }) => ({
            value: node?.address,
            label: node?.offerInfo?.name || '',
            description: node?.offerInfo?.description || '',
        }),
        variablesFilter: filter,
    });
    const onAddOffer = useCallback(({ isMulti }) => {
        goNext({
            children: (
                <OffersListModal
                    fetcher={fetcher}
                    isMulti={isMulti}
                    value={value}
                    name={name}
                    formValues={values}
                />
            ),
            messages: {
                header: `Add ${label}`,
            },
        });
    }, [goNext, fetcher, value, name, values, label]);

    return <ListAdderViewFormik label={label} name={name} isMulti={isMulti} onAdd={onAddOffer} />;
});
