import { createUploadLink } from 'apollo-upload-client';
import { getQSFromObj } from '@/utils';
import CONFIG from '@/config';
import fetchUpload from '../fetchUpload';

const uploadLink = (): createUploadLink => {
    return createUploadLink({
        uri: (req) => {
            const queries = getQSFromObj({
                op: req.operationName,
            });

            return `${CONFIG.REACT_APP_API_ENDPOINT}/graphql${queries.length ? `?${queries}` : ''}`;
        },
        credentials: 'same-origin',
        fetch: fetchUpload,
    });
};

export default uploadLink;
