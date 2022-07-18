import { AUTH_TOKEN } from '@/common/constants';
import { ApolloLink } from '@apollo/client';

const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    }));

    return forward(operation);
});

export default authLink;
