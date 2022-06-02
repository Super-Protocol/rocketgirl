import React, {
    memo,
    useCallback,
    useContext,
    ReactElement,
    JSXElementConstructor,
} from 'react';
import cloneDeep from 'lodash.clonedeep';
import { useField, useFormikContext } from 'formik';
import { TooltipLink } from '@/common/components/TooltipLink';
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
        checkTouched,
        onDelete: onDeleteProps,
        reset,
        disabled,
        isRequestBaseOffer,
        offerType,
    }) => {
        const { values } = useFormikContext<FormValues>();
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
                        isRequestBaseOffer={isRequestBaseOffer}
                        convertNode={convertNode}
                        offerType={offerType}
                    />
                ),
                messages: {
                    header: `Add ${label}`,
                },
                classNameWrap: classes.modalAdder,
            });
        }, [goNext, fetcher, value, name, values, label, reset, isRequestBaseOffer, convertNode, offerType]);
        const onDeleteOffer = useCallback(({ isMulti, value: newValue }) => {
            let updatedValue;
            const initialValues = cloneDeep(values);
            if (isMulti) {
                const newValues = (value || [])?.filter((oldValue) => oldValue?.value !== newValue?.value);
                updatedValue = newValues?.length ? newValues : undefined;
            }
            if (reset?.length) {
                reset.forEach((key) => delete initialValues?.[key]);
            }
            onDeleteProps?.({ ...initialValues, [name]: updatedValue });
        }, [value, onDeleteProps, name, values, reset]);
        const renderItem = useCallback((item) => (
            <TooltipLink
                title="Description"
                message={item?.info?.description}
                text={item?.info?.name}
            />
        ), []);

        return (
            <ListAdderViewFormik
                disabled={disabled}
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
