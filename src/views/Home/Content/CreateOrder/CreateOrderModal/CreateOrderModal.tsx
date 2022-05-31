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
import { CreateOrderModalProps, FormValues, Info } from './types';
import { OffersAdder } from './OffersAdder';
import { FileUploader } from './FileUploader';
import classes from './CreateOrderModal.module.scss';
import {
    valueOfferConvertNode,
    teeOfferConvertNode,
    solutionFilter,
    dataFilter,
    storageFilter,
    getValidationSchema,
} from './helpers';

export const CreateOrderModal: FC<CreateOrderModalProps<Info>> = memo(({ initialValues: initialValuesProps }) => {
    const { goBack } = useContext(ModalOkCancelContext);
    const [isValidating, setIsValidating] = useState(false);
    const validationSchema = useMemo(() => getValidationSchema(), []);
    const [initialValues] = useState<FormValues<Info>>(initialValuesProps || {});
    const onCancel = useCallback(() => {
        goBack();
    }, [goBack]);
    const onSubmit = useCallback((submitForm) => async () => {
        setIsValidating(true);
        submitForm();
    }, []);
    const onSubmitForm = useCallback(() => {
        setIsValidating(true);
    }, []);

    return (
        <Box direction="column">
            <Formik
                <FormValues<Info>>
                validateOnChange={isValidating}
                validateOnBlur={isValidating}
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={onSubmitForm}
            >
                {({ submitForm }) => {
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
                                    checkTouched={!isValidating}
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
                                    checkTouched={!isValidating}
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
                                    checkTouched={!isValidating}
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
                                    checkTouched={!isValidating}
                                />
                                <FileUploader />
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
                                    variant="secondary"
                                    className={classes.btnCancel}
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={onSubmit(submitForm)}>Create</Button>
                            </Box>
                        </Box>
                    );
                }}
            </Formik>
        </Box>
    );
});
