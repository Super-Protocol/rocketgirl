const { execSync } = require('child_process');
require('dotenv').config();

const { REACT_APP_API_ENDPOINT, REACT_APP_AUTH } = process.env;
if (REACT_APP_AUTH) {
    execSync(`npx get-graphql-schema ${REACT_APP_API_ENDPOINT} --header 'Authorization=${REACT_APP_AUTH}' > schema.graphql`);
} else {
    execSync(`npx get-graphql-schema ${REACT_APP_API_ENDPOINT} > schema.graphql`);
}
