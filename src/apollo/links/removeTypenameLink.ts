import { ApolloLink } from '@apollo/client';

import { removeTypenames } from '@/utils';

const removeTypenameLink = new ApolloLink((operation, forward) => {
    if (operation.variables) {
        removeTypenames(operation.variables, false);
    }

    return forward(operation);
});

export default removeTypenameLink;
