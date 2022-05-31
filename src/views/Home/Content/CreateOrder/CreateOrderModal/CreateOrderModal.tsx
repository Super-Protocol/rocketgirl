import React, {
    memo,
    FC,
    useState,
    useCallback,
    useContext, useMemo, useEffect,
} from 'react';
import { Formik } from 'formik';
import intersectionby from 'lodash.intersectionby';
import {
    OffersSelectDocument,
    TeeOffersSelectDocument,
    Offer,
    TeeOffer,
    useOffersRestrictionsLazyQuery,
    TOfferType,
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
import {
    CreateOrderModalProps, Fields,
    FormValues,
    Info,
    UpdateFiltersRestrictionsProps,
} from './types';
import { OffersAdder } from './OffersAdder';
import classes from './CreateOrderModal.module.scss';
import {
    valueOfferConvertNode,
    teeOfferConvertNode,
    getValidationSchema,
    getMinDepositWorkflow,
    getWorkflowValues,
    getInitialFilters,
} from './helpers';

export const CreateOrderModal: FC<CreateOrderModalProps<Info>> = memo(({ initialValues: initialValuesProps }) => {
    const { selectedAddress, instance } = useContext(WalletContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const { goBack } = useContext(ModalOkCancelContext);
    const [isValidating, setIsValidating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(getInitialFilters);
    const [initialValues, setInitialValues] = useState<FormValues<Info>>(initialValuesProps || {});
    const [minDeposit, setMinDeposit] = useState<number>(0);
    const [getOffersRestrictionsLazyQuery] = useOffersRestrictionsLazyQuery();
    const getOffersRestrictions = useCallback(async (list?: string[], offerType?: TOfferType) => {
        const offersRestrictions = list?.length
            ? await getOffersRestrictionsLazyQuery({
                variables: {
                    pagination: { first: Infinity },
                    filter: {
                        addresses: list,
                        ...(offerType ? { offerType } : {}),
                    },
                },
            })
            : undefined;
        if (!offersRestrictions) return undefined;
        const offers = intersectionby((offersRestrictions?.data?.result?.page?.edges || [])
            .map(({ node }) => node?.offerInfo?.restrictions?.offers))
            .flat();
        if (!offers?.length) return undefined;
        return offers;
    }, [getOffersRestrictionsLazyQuery]);
    const updateFiltersRestrictions = useCallback(async (values: UpdateFiltersRestrictionsProps<Info>) => {
        const solutionOffers = values.solution?.value ? [values.solution?.value] : [];
        const dataOffers = values.data?.map((d) => d?.value as string) || [];
        const restrictionsByTeeFromSolution = await getOffersRestrictions(solutionOffers, TOfferType.TeeOffer);
        const restrictionsByTeeFromDataAndSolution = await getOffersRestrictions(
            dataOffers.concat(solutionOffers),
            TOfferType.Data,
        );
        setFilters((f) => ({
            ...f,
            [Fields.tee]: { ...f[Fields.tee], addresses: restrictionsByTeeFromSolution },
            [Fields.data]: { ...f[Fields.data], addresses: restrictionsByTeeFromDataAndSolution },
        }));
    }, [getOffersRestrictions]);
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
            const phrase = 'test phrase'; // todo generate
            const values = getWorkflowValues(formValues, phrase);
            await workflow({ values, actionAccountAddress: selectedAddress, web3: instance });
            showSuccessModal(`Please remember your seed phrase: ${phrase}`);
        } catch (e) {
            showErrorModal(e);
        }
        setLoading(false);
    }, [showSuccessModal, showErrorModal, instance, selectedAddress]);
    const updateMinDeposit = useCallback(async (values: FormValues<Info>) => {
        try {
            setLoading(true);
            setMinDeposit(
                await getMinDepositWorkflow(values),
            );
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);
    const onDelete = useCallback((values) => {
        setInitialValues(values);
    }, []);
    useEffect(() => {
        updateMinDeposit({
            [Fields.data]: initialValues.data,
            [Fields.solution]: initialValues.solution,
            [Fields.tee]: initialValues.tee,
            [Fields.storage]: initialValues.storage,
        });
    }, [initialValues.data, initialValues.solution, initialValues.tee, initialValues.storage, updateMinDeposit]);
    useEffect(() => {
        setInitialValues((old) => {
            if (minDeposit) {
                return ({ ...old, [Fields.deposit]: minDeposit });
            }
            return old;
        });
    }, [minDeposit]);
    useEffect(() => {
        updateFiltersRestrictions({
            [Fields.data]: initialValues.data,
            [Fields.solution]: initialValues.solution,
        });
    }, [updateFiltersRestrictions, initialValues.data, initialValues.solution]);

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
                                    name={Fields.solution}
                                    btnLabel="Add solution"
                                    filter={filters[Fields.solution]}
                                    className={classes.adder}
                                    showError
                                    convertNode={valueOfferConvertNode}
                                    checkTouched={!isValidating}
                                    onDelete={onDelete}
                                    reset={[Fields.data, Fields.tee]}
                                />
                                <OffersAdder
                                    <Offer>
                                    query={OffersSelectDocument}
                                    label="Data"
                                    name={Fields.data}
                                    btnLabel="Add data"
                                    isMulti
                                    filter={filters[Fields.data]}
                                    className={classes.adder}
                                    showError
                                    convertNode={valueOfferConvertNode}
                                    checkTouched={!isValidating}
                                    onDelete={onDelete}
                                    reset={[Fields.tee]}
                                />
                                <OffersAdder
                                    <Offer>
                                    query={OffersSelectDocument}
                                    label="Storage"
                                    name={Fields.storage}
                                    btnLabel="Add storage"
                                    filter={filters[Fields.storage]}
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
                                    filter={filters.tee}
                                    name="tee"
                                    btnLabel="Add TEE"
                                    className={classes.adder}
                                    showError
                                    convertNode={teeOfferConvertNode}
                                    checkTouched={!isValidating}
                                    onDelete={onDelete}
                                />
                                <InputFormik
                                    name={Fields.deposit}
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
