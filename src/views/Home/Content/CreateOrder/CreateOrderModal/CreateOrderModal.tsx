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
import { workflow } from '@/connectors/orders';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { WalletContext } from '@/common/context/WalletProvider';
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
    getWorkflowValues,
} from './helpers';

export const CreateOrderModal: FC<CreateOrderModalProps<Info>> = memo(({ initialValues: initialValuesProps }) => {
    const { selectedAddress, instance } = useContext(WalletContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const { goBack } = useContext(ModalOkCancelContext);
    const [isValidating, setIsValidating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState<FormValues<Info>>(initialValuesProps || {});
    const [minDeposit, setMinDeposit] = useState<number>(0);
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
    const onSubmitForm = useCallback(async (formValues: FormValues<Info>) => {
        setLoading(true);
        setIsValidating(true);
        if (!selectedAddress || !instance) {
            return showErrorModal('Metamask account not found');
        }
        try {
            const { phrase } = formValues || {};
            const values = getWorkflowValues(formValues);
            await workflow({ values, actionAccountAddress: selectedAddress, web3: instance });
            showSuccessModal(`Please remember your seed phrase: ${phrase}`);
        } catch (e) {
            showErrorModal(e);
        }
        setLoading(false);
    }, [showSuccessModal, showErrorModal, instance, selectedAddress]);
    const updateMinDeposit = useCallback(async () => {
        try {
            setLoading(true);
            setMinDeposit(
                await getMinDepositWorkflow({
                    data: initialValues.data,
                    solution: initialValues.solution,
                    tee: initialValues.tee,
                    storage: initialValues.storage,
                }),
            );
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [initialValues.storage, initialValues.solution, initialValues.tee, initialValues.data]);
    const onDelete = useCallback(() => {
        updateMinDeposit();
    }, [updateMinDeposit]);
    useEffect(() => {
        updateMinDeposit();
    }, [updateMinDeposit]);
    useEffect(() => {
        setInitialValues((old) => {
            if (minDeposit) {
                return ({ ...old, deposit: minDeposit });
            }
            return old;
        });
    }, [minDeposit]);

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
                                    name="phrase"
                                    label="Seed phrase"
                                    classNameWrap={classes.inputWrap}
                                    showError
                                    checkTouched={false}
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
