import {
    memo, ReactElement, useMemo, useState, useCallback, useContext,
} from 'react';
import { Formik } from 'formik';

import { useErrorModal } from '@/common/hooks/useErrorModal';
import { Box, Button } from '@/uikit';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import {
    MnemonicGeneratorComponent,
} from '@/views/Home/Content/CreateOrder/CreateOrderModal/MnemonicGenerator/MnemonicGeneratorComponent';
import { GetResultModalProps, FormValues, Fields } from './types';
import { getValidationSchema, getInitialValues } from './helpers';
import { encodingAndDowndoadFile } from './connection';
import classes from './GetResultModal.module.scss';

export const GetResultModal = memo<GetResultModalProps>(({
    orderAddress,
}): ReactElement => {
    const { onClose } = useContext(ModalOkCancelContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const [loading, setLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [agreement, setAgreement] = useLocalStorage<boolean | undefined>('agreement');
    const [canShowAgreement] = useState(!agreement);
    const validationSchema = useMemo(() => getValidationSchema(), []);
    const [initialValues] = useState(getInitialValues(agreement));
    const onSubmit = useCallback(async (values: FormValues) => {
        setLoading(true);
        try {
            const { phrase = '' } = values || {};
            await encodingAndDowndoadFile(orderAddress, phrase);
            setLoading(false);
            onClose();
            showSuccessModal('Download successfully complete');
        } catch (e) {
            setLoading(false);
            showErrorModal(e);
        }
    }, [showSuccessModal, showErrorModal, onClose, orderAddress]);

    const onDownload = useCallback((submitForm) => () => {
        setIsValidating(true);
        submitForm();
    }, []);

    const onCancel = useCallback(() => {
        onClose();
    }, [onClose]);

    return (
        <Formik
            validateOnChange={isValidating}
            validateOnBlur={isValidating}
            initialValues={initialValues}
            onSubmit={onSubmit}
            enableReinitialize
            validationSchema={validationSchema}
        >
            {({ submitForm }) => {
                return (
                    <Box direction="column">
                        <Box direction="column" className={classes.wrapComponent}>
                            <MnemonicGeneratorComponent {...{
                                canShowAgreement,
                                setAgreement,
                                notification: true,
                                nameMode: Fields.phraseTabMode,
                                name: Fields.phrase,
                                nameAgreement: Fields.agreement,
                            }}
                            />
                        </Box>
                        <Box justifyContent="flex-end">
                            <Button
                                loading={loading}
                                onClick={onCancel}
                                variant="secondary"
                                className={classes.btnCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onDownload(submitForm)}
                                variant="primary"
                                loading={loading}
                            >
                                Get Result
                            </Button>
                        </Box>
                    </Box>
                );
            }}
        </Formik>
    );
});
