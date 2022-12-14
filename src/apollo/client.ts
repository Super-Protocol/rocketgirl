import {
    ApolloClient, InMemoryCache, ApolloLink, split,
} from '@apollo/client';
import compact from 'lodash.compact';
import { getMainDefinition } from '@apollo/client/utilities';
import wsLink from './links/wsLink';
import uploadLink from './links/uploadLink';
import authLink from './links/authLink';
import errorLink from './links/errorLink';
// import removeTypenameLink from './links/removeTypenameLink';

const getClient = (): ApolloClient<any> => {
    const connectionsLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (definition.kind === 'OperationDefinition' && definition.operation === 'subscription');
        },
        wsLink(),
        uploadLink(),
    );

    return new ApolloClient({
        link: ApolloLink.from(compact([
            // removeTypenameLink,
            errorLink,
            authLink,
            connectionsLink,
        ])),
        cache: new InMemoryCache({}),
    });
};

export default getClient;
