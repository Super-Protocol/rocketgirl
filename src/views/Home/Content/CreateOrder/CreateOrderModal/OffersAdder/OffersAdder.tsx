import React, {
    memo,
    useCallback,
    useContext, ReactElement, JSXElementConstructor,
} from 'react';
import { useField, useFormikContext } from 'formik';
import { ListAdderViewFormik } from '@/uikit';
import { useSelectQueryCursorSPFetcher } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { OffersAdderProps } from './types';
import { OffersListModal } from '../OffersListModal';
import { FormValues } from '../types';
import classes from './OffersAdder.module.scss';

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
        showError,
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
                classNameWrap: classes.modalAdder,
            });
        }, [goNext, fetcher, value, name, values, label]);
        const onDeleteOffer = useCallback(({ isMulti, value: newValue }) => {
            if (isMulti) {
                const newValues = value?.filter((oldValue) => oldValue !== newValue);
                setValue(newValues?.length ? newValues : undefined);
            } else {
                setValue(undefined);
            }
        }, [setValue, value]);

        return (
            <ListAdderViewFormik
                name={name}
                label={label}
                isMulti={isMulti}
                onAdd={onAddOffer}
                onDelete={onDeleteOffer}
                btnLabel={btnLabel}
                className={className}
                showError={showError}
            />
        );
    });
