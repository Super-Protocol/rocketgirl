import { onError } from '@apollo/client/link/error';
import { ServerError } from '@apollo/client/link/utils/throwServerError';
import { AUTH_TOKEN } from '@/common/constants';

const errorLink = onError(({ networkError, operation }) => {
    if ((networkError as ServerError)?.statusCode === 401 && operation?.operationName !== 'CheckAuthToken') {
        localStorage.setItem(AUTH_TOKEN, '');
        window.location.href = '/login';
    }
});

export default errorLink;
