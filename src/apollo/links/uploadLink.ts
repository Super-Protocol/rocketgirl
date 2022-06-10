import { createUploadLink } from 'apollo-upload-client';
import CONFIG from '@/config';
import { getQSFromObj } from '@/utils';
import fetchUpload from '../fetchUpload';

const { REACT_APP_AUTH, REACT_APP_API_ENDPOINT, REACT_APP_IS_USE_PROXY } = CONFIG;

const uploadLink = (): createUploadLink => {
    return createUploadLink({
        uri: (req) => {
            const queries = getQSFromObj({
                op: req.operationName,
            });
            return `${!REACT_APP_IS_USE_PROXY ? REACT_APP_API_ENDPOINT || '' : '/graphql'}${queries.length ? `?${queries}` : ''}`;
        },
        credentials: 'same-origin',
        fetch: fetchUpload,
        ...(REACT_APP_AUTH ? {
            headers: {
                authorization: REACT_APP_AUTH,
            },
        } : {}),
    });
};

export default uploadLink;
