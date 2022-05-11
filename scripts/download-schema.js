const { execSync } = require('child_process');
require('dotenv').config();

const { REACT_APP_API_ENDPOINT, REACT_APP_AUTH } = process.env;
execSync(`npx get-graphql-schema ${REACT_APP_API_ENDPOINT} --header 'Authorization=${REACT_APP_AUTH}' > schema.graphql`);
