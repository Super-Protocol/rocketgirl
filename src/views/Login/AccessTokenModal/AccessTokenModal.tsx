import React, {
    memo,
    FC,
    useCallback,
    useState, useMemo,
} from 'react';
import { Formik, FormikHelpers } from 'formik';
import {
    Box,
    Button,
    Spinner,
    InputFormik,
    ErrorBox,
} from '@/uikit';
import { useCheckAuthTokenLazyQuery } from '@/gql/graphql';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import { AUTH_TOKEN } from '@/common/constants';
import { AccessTokenModalProps, FormValues, Fields } from './types';
import { DEFAULT_TOKEN_ERROR, getValidationSchema } from './helpers';
import classes from './AccessTokenModal.module.scss';

export const AccessTokenModal: FC<AccessTokenModalProps> = memo(({ onSuccess = () => {} }) => {
    const [checkAuth] = useCheckAuthTokenLazyQuery();
    const [isValidating, setIsValidating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [, setToken] = useLocalStorage<string>(AUTH_TOKEN, undefined);
    const validationSchema = useMemo(() => getValidationSchema(), []);
    const [initialValues] = useState<FormValues>({ token: '' });
    const onSubmit = useCallback((submitForm) => async () => {
        setIsValidating(true);
        submitForm();
    }, []);

    const onSubmitForm = useCallback(async (
        formValues: FormValues,
        { setFieldError }: FormikHelpers<FormValues>,
    ) => {
        setLoading(true);
        setIsValidating(true);
        try {
            const { token } = formValues || {};
            setToken(token); // for header Authorization
            const response = await checkAuth();
            if (!response?.error) {
                onSuccess();
            } else {
                setToken('');
                setFieldError(Fields.token, response.error?.message || DEFAULT_TOKEN_ERROR);
            }
        } catch (e) {
            setToken('');
            setFieldError(Fields.token, (e as Error)?.message || DEFAULT_TOKEN_ERROR);
        }
        setLoading(false);
    }, [checkAuth, setToken, onSuccess]);
    return (
        <Box direction="column">
            <Formik
                <FormValues>
                validateOnChange={isValidating}
                validateOnBlur={false}
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
                                    <InputFormik
                                        placeholder="Enter the token to get access..."
                                        name={Fields.token}
                                        classNameErrorEmpty={classes.errorBox}
                                        renderError={(error) => <ErrorBox className={classes.errorBox} error={error} />}
                                    />
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
