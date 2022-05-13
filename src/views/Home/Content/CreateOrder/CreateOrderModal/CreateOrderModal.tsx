import React, {
    memo,
    FC,
    useState,
    useCallback, useContext, useMemo,
} from 'react';
import { Formik } from 'formik';
import {
    OffersSelectDocument,
    TeeOffersSelectDocument,
    Offer,
    TeeOffer,
} from '@/gql/graphql';
import { Box, Button, InputFormik } from '@/uikit';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { CreateOrderModalProps, FormValues } from './types';
import { OffersAdder } from './OffersAdder';
import classes from './CreateOrderModal.module.scss';
import {
    valueOfferConvertNode,
    teeOfferConvertNode,
    solutionFilter,
    dataFilter,
    storageFilter,
    getValidationSchema,
} from './helpers';

export const CreateOrderModal: FC<CreateOrderModalProps> = memo(({ initialValues: initialValuesProps }) => {
    const { goBack } = useContext(ModalOkCancelContext);
    const validationSchema = useMemo(() => getValidationSchema(), []);
    const [initialValues] = useState<FormValues>(initialValuesProps || {});
    const onCancel = useCallback(() => {
        goBack();
    }, [goBack]);
    const onSubmit = useCallback(({ values }) => {
        // eslint-disable-next-line no-console
        console.log('values', values);
    }, []);
    return (
        <Box direction="column">
            <Formik
                <FormValues>
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, values, submitForm }) => {
                    return (
                        <Box direction="column">
                            <Box direction="column">
                                <OffersAdder
                                    <Offer>
                                    query={OffersSelectDocument}
                                    label="Solution"
                                    name="solution"
                                    btnLabel="Add solution"
                                    filter={solutionFilter}
                                    className={classes.adder}
                                    showError
                                    convertNode={valueOfferConvertNode}
                                />
                                <OffersAdder
                                    <Offer>
                                    query={OffersSelectDocument}
                                    label="Data"
                                    name="data"
                                    btnLabel="Add data"
                                    isMulti
                                    filter={dataFilter}
                                    className={classes.adder}
                                    showError
                                    convertNode={valueOfferConvertNode}
                                />
                                <OffersAdder
                                    <Offer>
                                    query={OffersSelectDocument}
                                    label="Storage"
                                    name="storage"
                                    btnLabel="Add storage"
                                    filter={storageFilter}
                                    className={classes.adder}
                                    showError
                                    convertNode={valueOfferConvertNode}
                                />
                                <OffersAdder
                                    <TeeOffer>
                                    query={TeeOffersSelectDocument}
                                    label="TEE"
                                    name="tee"
                                    btnLabel="Add TEE"
                                    className={classes.adder}
                                    showError
                                    convertNode={teeOfferConvertNode}
                                />
                                <InputFormik
                                    name="deposit"
                                    label="Deposit"
                                    classNameWrap={classes.inputWrap}
                                    showError
                                    checkTouched={false}
                                />
                            </Box>
                            <Box justifyContent="flex-end">
                                <Button
                                    variant="grey-light"
                                    className={classes.btnCancel}
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                                <Button variant="orange" onClick={submitForm}>Create</Button>
                            </Box>
                        </Box>
                    );
                }}
            </Formik>
        </Box>
    );
});
