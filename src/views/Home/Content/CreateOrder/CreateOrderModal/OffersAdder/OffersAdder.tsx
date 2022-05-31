import React, {
    memo,
    useCallback,
    useContext, ReactElement, JSXElementConstructor,
} from 'react';
import { useField, useFormikContext } from 'formik';
import { TooltipLink } from '@/common/components/TooltipLink';
import { ListAdderViewFormik } from '@/uikit';
import { useSelectQueryCursorSPFetcher } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { OffersAdderProps } from './types';
import { OffersListModal } from '../OffersListModal';
import { FormValues, Info } from '../types';
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
        checkTouched,
        onDelete: onDeleteProps,
        reset,
    }) => {
        const { values } = useFormikContext<FormValues<Info>>();
        const [, { value }] = useField(name);
        const { goNext } = useContext(ModalOkCancelContext);
        const { fetcher } = useSelectQueryCursorSPFetcher<any, any>({ // todo
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
                        reset={reset}
                    />
                ),
                messages: {
                    header: `Add ${label}`,
                },
                classNameWrap: classes.modalAdder,
            });
        }, [goNext, fetcher, value, name, values, label, reset]);
        const onDeleteOffer = useCallback(({ isMulti, value: newValue }) => {
            let updatedValue;
            if (isMulti) {
                const newValues = (value || [])?.filter((oldValue) => oldValue?.value !== newValue?.value);
                updatedValue = newValues?.length ? newValues : undefined;
            }
            onDeleteProps?.({ ...values, [name]: updatedValue });
        }, [value, onDeleteProps, name, values]);
        const renderItem = useCallback((item) => (
            <TooltipLink
                title="Description"
                message={item?.info?.description}
                text={item?.info?.name}
            />
        ), []);

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
                renderItem={renderItem}
                checkTouched={checkTouched}
            />
        );
    });
