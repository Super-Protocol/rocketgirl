import CONFIG from '@/config';

const { REACT_APP_S3_CONFIG } = CONFIG;

export const S3_BUCKET = 'inputs';

export const S3_CONFIG = {
    ...REACT_APP_S3_CONFIG,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    httpOptions: { timeout: 0 },
};
