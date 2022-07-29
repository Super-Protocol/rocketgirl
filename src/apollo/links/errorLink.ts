import { onError } from '@apollo/client/link/error';
import { ServerError } from '@apollo/client/link/utils/throwServerError';
import { AUTH_TOKEN } from '@/common/constants';

const errorLink = onError(({
    networkError,
    operation,
    response,
    graphQLErrors,
}) => {
    if (
        ((networkError as ServerError)?.statusCode === 401 && operation?.operationName !== 'CheckAuthToken')
        || graphQLErrors?.some(({ extensions }) => (extensions as any)?.response?.statusCode === 401)
    ) {
        localStorage.setItem(AUTH_TOKEN, '');
        window.location.href = '/login';
    }
});

export default errorLink;
