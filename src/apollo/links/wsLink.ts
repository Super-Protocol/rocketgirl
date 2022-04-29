import { WebSocketLink } from '@apollo/client/link/ws';
import CONFIG from '@/config';
// import { onLocalStorageEvent } from '@/utils/local-storage-events';

const { host } = new URL(CONFIG.REACT_APP_API_ENDPOINT || window.location.href);
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

const wsLink = (): WebSocketLink => {
    // After changing account, closing this connection link because it'll be no more actual
    // onLocalStorageEvent('accountChanged', () => {
    //     wsConnectionLink.subscriptionClient.client.close();
    // }, { once: true });

    return new WebSocketLink({
        uri: `${protocol}://${host}/graphql`,
        options: {
            reconnect: true,
        },
    });
};

export default wsLink;
