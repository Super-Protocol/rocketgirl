import { WebSocketLink } from '@apollo/client/link/ws';
import Cookies from 'js-cookie';
import CONFIG from '@/config';
// import { onLocalStorageEvent } from '@/utils/local-storage-events';

const { host } = new URL(CONFIG.REACT_APP_API_ENDPOINT || window.location.href);
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const { REACT_APP_AUTH } = process.env;

const wsLink = (): WebSocketLink => {
    // After changing account, closing this connection link because it'll be no more actual
    // onLocalStorageEvent('accountChanged', () => {
    //     wsConnectionLink.subscriptionClient.client.close();
    // }, { once: true });

    return new WebSocketLink({
        uri: `${protocol}://${host}/graphql-subscriptions`,
        options: {
            reconnect: false,
        },
        connectionParams: async () => {
            const token = Cookies.get('id_token');
            const account = Cookies.get('account');

            const headers = REACT_APP_AUTH ? {
                headers: {
                    authorization: REACT_APP_AUTH,
                },
            } : {};
            return {
                token,
                account,
                ...headers,
            };
        },
    });
};

export default wsLink;
