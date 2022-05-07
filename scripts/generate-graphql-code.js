const { generate } = require('@graphql-codegen/cli');

async function generateGraphQLCode() {
    await generate(
        {
            overwrite: true,
            schema: 'schema.graphql',
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
