import { WebSocketLink } from '@apollo/client/link/ws';
import CONFIG from '@/config';

const { host } = new URL(CONFIG.REACT_APP_API_ENDPOINT || window.location.href);
const { REACT_APP_BASIC_AUTH } = process.env;

const basicAuth = REACT_APP_BASIC_AUTH ? `${REACT_APP_BASIC_AUTH}@` : '';

const wsLink = (): WebSocketLink => {
    return new WebSocketLink({
        uri: `wss://${basicAuth}${host}/graphql`,
        options: {
            reconnect: true,
        },
    });
};

export default wsLink;
