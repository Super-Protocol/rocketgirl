import React, {
    memo,
    FC,
    useState,
    useCallback,
    useContext, useMemo, useEffect,
} from 'react';
import { Formik } from 'formik';
import {
    OffersSelectDocument,
    TeeOffersSelectDocument,
    Offer,
    TeeOffer,
} from '@/gql/graphql';
import {
    Box,
    Button,
    InputFormik,
    Spinner,
} from '@/uikit';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { CreateOrderModalProps, FormValues, Info } from './types';
import { OffersAdder } from './OffersAdder';
import classes from './CreateOrderModal.module.scss';
import {
    valueOfferConvertNode,
    teeOfferConvertNode,
    solutionFilter,
    dataFilter,
    storageFilter,
    getValidationSchema,
    getMinDepositWorkflow,
} from './helpers';

export const CreateOrderModal: FC<CreateOrderModalProps<Info>> = memo(({ initialValues: initialValuesProps }) => {
    const { goBack } = useContext(ModalOkCancelContext);
    const [isValidating, setIsValidating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialValues] = useState<FormValues<Info>>(initialValuesProps || {});
    const [minDeposit, setMinDeposit] = useState<number | undefined>();
    const validationSchema = useMemo(() => getValidationSchema({
        minDeposit,
    }), [minDeposit]);
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
    const updateMinDeposit = useCallback(async () => {
        try {
            setLoading(true);
            setMinDeposit(
                await getMinDepositWorkflow(initialValues),
            );
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [initialValues]);
    const onDelete = useCallback(() => {
        updateMinDeposit();
    }, [updateMinDeposit]);
    useEffect(() => {
        updateMinDeposit();
    }, [updateMinDeposit]);

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
                {({ submitForm, values }) => {
                    return (
                        <Box direction="column">
                            {loading && (
                                <Spinner fullscreen />
                            )}
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
                                    onDelete={onDelete}
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
                                    onDelete={onDelete}
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
                                    onDelete={onDelete}
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
                                    onDelete={onDelete}
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
