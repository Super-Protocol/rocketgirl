import React, {
    memo,
    FC,
    useCallback,
    useContext, ReactElement, JSXElementConstructor,
} from 'react';
import { useField, useFormikContext } from 'formik';
import { ListAdderView } from '@/uikit';
import { useSelectQueryCursorSPFetcher } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { OffersAdderProps } from './types';
import { OffersListModal } from '../OffersListModal';
import { FormValues } from '../types';

export const OffersAdder: <TNode>(p: OffersAdderProps<TNode>) =>
    ReactElement<any, string | JSXElementConstructor<any>> | null = memo(({
        query,
        label,
        name,
        isMulti = false,
        filter,
        btnLabel,
        className,
        convertNode,
    }) => {
        const { values } = useFormikContext<FormValues>();
        const [, { value }, { setValue }] = useField(name);
        const { goNext } = useContext(ModalOkCancelContext);
        const { fetcher } = useSelectQueryCursorSPFetcher<any, { description?: string}>({ // todo
            query,
            convertNode,
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
        const onDeleteOffer = useCallback(({ isMulti, value: newValue }) => {
            if (isMulti) {
                setValue(value?.filter((oldValue) => oldValue !== newValue));
            } else {
                setValue(undefined);
            }
        }, [setValue, value]);

        return (
            <ListAdderView
                values={value}
                label={label}
                isMulti={isMulti}
                onAdd={onAddOffer}
                onDelete={onDeleteOffer}
                btnLabel={btnLabel}
                className={className}
            />
        );
    });
