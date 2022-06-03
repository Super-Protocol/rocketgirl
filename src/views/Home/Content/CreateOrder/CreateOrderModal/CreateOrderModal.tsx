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
    Spinner,
} from '@/uikit';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { workflow } from '@/connectors/orders';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { WalletContext } from '@/common/context/WalletProvider';
import { generateMnemonic } from '@/utils/crypto';
import toastr from '@/services/Toastr/toastr';
import {
    CreateOrderModalProps,
    Fields,
    FormValues,
    UpdateFiltersRestrictionsProps,
    FormOffer,
} from './types';
import { OffersAdder } from './OffersAdder';
import { FileUploader } from './FileUploader';
import { MnemonicGenerator } from './MnemonicGenerator';
import classes from './CreateOrderModal.module.scss';
import {
    valueOfferConvertNode,
    teeOfferConvertNode,
    getValidationSchema,
    getMinDepositWorkflow,
    getWorkflowValues,
    getInitialFilters,
} from './helpers';
import { SuccessModal } from './SuccessModal';
import { InputDeposit } from './InputDeposit';
import { useFileUploader } from './hooks/useFileUploader';

export const CreateOrderModal: FC<CreateOrderModalProps> = memo(({ initialValues: initialValuesProps }) => {
    const { selectedAddress, instance } = useContext(WalletContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const { goBack } = useContext(ModalOkCancelContext);
    const { uploading, uploadFile } = useFileUploader();
    const [isValidating, setIsValidating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(getInitialFilters);
    const [initialValues, setInitialValues] = useState<FormValues>(initialValuesProps || {});
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
    const updateFiltersRestrictions = useCallback(async (values: UpdateFiltersRestrictionsProps) => {
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
    const onSubmitForm = useCallback(async (formValues: FormValues) => {
        setLoading(true);
        setIsValidating(true);
        if (!selectedAddress || !instance) {
            return showErrorModal('Metamask account not found');
        }
        try {
            const { file, data } = formValues || {};
            if (!data?.length) {
                await uploadFile(file);
                // todo tii generator
            }
            const mnemonic = generateMnemonic();
            const values = getWorkflowValues(formValues, mnemonic);
            await workflow({ values, actionAccountAddress: selectedAddress, web3: instance });
            showSuccessModal(undefined, <SuccessModal mnemonic={mnemonic} />);
        } catch (e) {
            toastr.error(e);
        }
        setLoading(false);
    }, [showSuccessModal, showErrorModal, instance, selectedAddress, uploadFile]);
    const updateMinDeposit = useCallback(async (values: FormValues) => {
        try {
            setLoading(true);
            setMinDeposit(
                await getMinDepositWorkflow({
                    ...values,
                    [Fields.solution]: values[Fields.solution]?.value
                        ? [values[Fields.solution] as FormOffer].concat(values[Fields.solutionBase] || [])
                        : [],
                }),
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
                <FormValues>
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
                                    name={Fields.solution}
                                    offerType={TOfferType.Solution}
                                    btnLabel="Add solution"
                                    filter={filters[Fields.solution]}
                                    className={classes.adder}
                                    showError
                                    convertNode={valueOfferConvertNode}
                                    checkTouched={!isValidating}
                                    onDelete={onDelete}
                                    reset={[Fields.data, Fields.tee]}
                                    isRequestBaseOffer
                                />
                                <OffersAdder
                                    <Offer>
                                    disabled={!values[Fields.solution]}
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
                                    disabled={!values[Fields.solution]}
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
                                    name={Fields.tee}
                                    btnLabel="Add TEE"
                                    className={classes.adder}
                                    showError
                                    convertNode={teeOfferConvertNode}
                                    checkTouched={!isValidating}
                                    onDelete={onDelete}
                                />
                                <FileUploader {...{ uploading, disabled: !!values?.[Fields.data]?.length }} />
                                <MnemonicGenerator />
                                <InputDeposit min={minDeposit} classNameWrap={classes.inputWrap} />
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
