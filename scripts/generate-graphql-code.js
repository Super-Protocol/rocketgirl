const { generate } = require('@graphql-codegen/cli');
const dotenv = require('dotenv');

dotenv.config();
const { REACT_APP_API_ENDPOINT } = process.env;

async function generateGraphQLCode() {
    await generate(
        {
            overwrite: true,
            schema: REACT_APP_API_ENDPOINT,
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
