import React, {
    memo,
    FC,
    useState,
    useCallback,
    useContext,
    useMemo,
    useEffect,
} from 'react';
import { Formik } from 'formik';
import intersectionby from 'lodash.intersectionby';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
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
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { WalletContext } from '@/common/context/WalletProvider';
import toastr from '@/services/Toastr/toastr';
import { Modes } from '@/uikit/MnemonicGenerator/types';
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
    getInitialFilters,
} from './helpers';
import { InputDeposit } from './InputDeposit';
import { useWorkflow } from './hooks/useWorkflow';

export const CreateOrderModal: FC<CreateOrderModalProps> = memo(({ initialValues: initialValuesProps }) => {
    const { selectedAddress, instance } = useContext(WalletContext);
    const [agreement, setAgreement] = useLocalStorage<boolean | undefined>('agreement');
    const [canShowAgreement] = useState(!agreement);
    const { showSuccessModal } = useErrorModal();
    const { goBack } = useContext(ModalOkCancelContext);
    const [isValidating, setIsValidating] = useState(false);
    const [loading, setLoading] = useState(false);
    const { uploading, runWorkflow } = useWorkflow();
    const [filters, setFilters] = useState(getInitialFilters);
    const [initialValues, setInitialValues] = useState<FormValues>({
        [Fields.phraseTabMode]: Modes.generate,
        [Fields.agreement]: agreement,
        ...initialValuesProps,
    });
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
        try {
            await runWorkflow({ formValues, actionAccountAddress: selectedAddress, web3: instance });
            showSuccessModal();
        } catch (e) {
            console.error('workflow error: ', e);
            toastr.error(e);
        }
        setLoading(false);
    }, [showSuccessModal, instance, selectedAddress, runWorkflow]);
    const updateMinDeposit = useCallback(async (values: FormValues) => {
        try {
            setLoading(true);
            setMinDeposit(
                await getMinDepositWorkflow({
                    ...values,
                    [Fields.solution]: values[Fields.solution]?.value
                        ? [values[Fields.solution] as FormOffer].concat(values[Fields.solution]?.data?.sub || [])
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
                                <MnemonicGenerator {...{
                                    canShowAgreement,
                                    setAgreement,
                                    notification: true,
                                    nameMode: Fields.phraseTabMode,
                                    name: Fields.phrase,
                                    classNameWrap: classes.mnemonicWrap,
                                }}
                                />
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
