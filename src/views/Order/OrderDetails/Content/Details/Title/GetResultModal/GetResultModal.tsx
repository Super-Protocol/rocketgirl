import {
    memo, ReactElement, useMemo, useState, useCallback, useContext,
} from 'react';
import { Formik } from 'formik';

import { useErrorModal } from '@/common/hooks/useErrorModal';
import { Box, Button, InputFormik } from '@/uikit';
import { LabelToolkit } from '@/common/components';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { GetResultModalProps, FormValues, Fields } from './types';
import {
    getValidationSchema,
    initialValues,
    placeholder,
    encodingAndDownloadFile,
} from './helpers';
import classes from './GetResultModal.module.scss';

export const GetResultModal = memo<GetResultModalProps>(({
    orderAddress,
    status,
}): ReactElement => {
    const { onClose } = useContext(ModalOkCancelContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const [loading, setLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const validationSchema = useMemo(() => getValidationSchema(), []);
    const onSubmit = useCallback(async (values: FormValues) => {
        setLoading(true);
        try {
            const { phrase = '' } = values || {};
            const { isFile, content } = await encodingAndDownloadFile(orderAddress, phrase, status);
            setLoading(false);
            onClose();
            showSuccessModal(isFile ? 'File downloaded successfully' : content);
        } catch (e) {
            setLoading(false);
            showErrorModal(e);
        }
    }, [showSuccessModal, showErrorModal, onClose, orderAddress, status]);

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
            {({ submitForm }) => (
                <Box direction="column">
                    <Box direction="column" className={classes.wrapComponent}>
                        <LabelToolkit
                            tooltipText="The encryption passphrase is used to encrypt and access the result data."
                            title="Encryption passphrase"
                        >
                            <InputFormik {...{
                                name: Fields.phrase,
                                classNameError: classes.inputError,
                                placeholder,
                                classNameInput: classes.input,
                                as: 'textarea',
                                disabled: loading,
                            }}
                            />
                        </LabelToolkit>
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
                            Send
                        </Button>
                    </Box>
                </Box>
            )}
        </Formik>
    );
});
