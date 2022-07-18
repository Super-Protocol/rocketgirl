import React, {
    memo,
    FC,
    useCallback,
    useState, useMemo,
} from 'react';
import { Formik } from 'formik';
import {
    Box,
    Button,
    Spinner,
    InputFormik, ErrorBox,
} from '@/uikit';
import { AccessTokenModalProps, FormValues, Fields } from './types';
import { getValidationSchema } from './helpers';

export const AccessTokenModal: FC<AccessTokenModalProps> = memo(({ onSuccess = () => {} }) => {
    const [isValidating, setIsValidating] = useState(false);
    const [loading, setLoading] = useState(false);
    const validationSchema = useMemo(() => getValidationSchema(), []);
    const [initialValues] = useState<FormValues>({ token: '' });
    const onSubmit = useCallback((submitForm) => async () => {
        setIsValidating(true);
        submitForm();
    }, []);

    const onSubmitForm = useCallback(async (formValues: FormValues) => {
        setLoading(true);
        const { token } = formValues || {};
        // todo check token
        onSuccess(token);
        //
        setIsValidating(true);
        setLoading(false);
    }, [onSuccess]);
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
                {({ submitForm }) => {
                    return (
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onSubmit(submitForm)();
                                }
                            }}
                        >
                            <Box direction="column">
                                {loading && (
                                    <Spinner fullscreen />
                                )}
                                <Box direction="column">
                                    <InputFormik name={Fields.token} renderError={(error) => <ErrorBox error={error} />} />
                                </Box>
                                <Box justifyContent="flex-end">
                                    <Button variant="primary" onClick={onSubmit(submitForm)}>Log in</Button>
                                </Box>
                            </Box>
                        </form>
                    );
                }}
            </Formik>
        </Box>
    );
});
