import { createUploadLink } from 'apollo-upload-client';

import { getQSFromObj } from '@/utils';
import fetchUpload from '../fetchUpload';

const { REACT_APP_AUTH } = process.env;

const uploadLink = (): createUploadLink => {
    return createUploadLink({
        uri: (req) => {
            const queries = getQSFromObj({
                op: req.operationName,
            });
            return `/graphql${queries.length ? `?${queries}` : ''}`;
        },
        credentials: 'same-origin',
        fetch: fetchUpload,
        headers: {
            authorization: REACT_APP_AUTH,
        },
    });
};

export default uploadLink;
