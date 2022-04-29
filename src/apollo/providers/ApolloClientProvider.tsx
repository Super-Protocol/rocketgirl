import { useState, memo } from 'react';
import { ApolloProvider } from '@apollo/client';
import getClient from '../client';

export const ApolloClientProvider = memo(({ children }) => {
    const [client] = useState(getClient);

    // useEffect(() => {
    //     onLocalStorageEvent('accountChanged', () => {
    //         setClient(getClient());
    //     });
    // }, []);

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
});
