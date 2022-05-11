const { generate } = require('@graphql-codegen/cli');
require('dotenv').config();

const { REACT_APP_API_ENDPOINT, REACT_APP_AUTH } = process.env;

async function generateGraphQLCode() {
    await generate(
        {
            overwrite: true,
            schema: REACT_APP_API_ENDPOINT,
            headers: {
                Authorization: REACT_APP_AUTH,
            },
            documents: './src/gql/schemas/*.graphql',
            config: {
                apolloReactHooksImportFrom: '@/apollo/hooks',
            },
            generates: {
                './src/gql/graphql.ts': {
                    schema: './src/gql/mockSchemas/*.graphql',
                    plugins: [
                        'typescript',
                        'typescript-operations',
                        'typescript-react-apollo',
                    ],
                },
            },
        },
        true,
    );
}

generateGraphQLCode();
