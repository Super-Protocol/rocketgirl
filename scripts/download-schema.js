const { execSync } = require('child_process');

const { REACT_APP_API_ENDPOINT } = process.env;

execSync(`npx get-graphql-schema "${REACT_APP_API_ENDPOINT}" > schema.graphql`);
