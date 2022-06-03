import { S3, AWSError, Response } from 'aws-sdk';
import { Progress, Request } from 'aws-sdk/lib/request';
import { PutObjectOutput } from 'aws-sdk/clients/s3';
import { useCallback, useState } from 'react';
import {
    Crypto,
} from '@super-protocol/sp-sdk-js';
import { CryptoAlgorithm, Encoding } from '@super-protocol/sp-dto-js/build/enum';
import { Encryption } from '@super-protocol/sp-dto-js';
import { generateRandomKeys } from '@/utils/crypto';
import { getBase64FromFile } from '@/common/helpers';
import CONFIG from '@/config';

const { REACT_APP_S3_ACCESS_KEY_ID, REACT_APP_S3_SECRET_ACCESS_KEY, REACT_APP_S3_ENDPOINT } = CONFIG;

export const encryptFile = async (file: File): Promise<Encryption> => {
    const { privateKey } = generateRandomKeys();
    const base64 = await getBase64FromFile(file);
    return Crypto.encrypt(
        base64 as string,
        {
            algo: CryptoAlgorithm.AES,
            encoding: Encoding.base64,
            key: privateKey,
        },
    );
};

export interface UploadFileByS3PropsOptions {
    onHttpUploadProgress?: (progress: Progress) => void;
    onComplete?: (response: Response<PutObjectOutput, AWSError>) => void;
    onError?: (err: AWSError) => void;
}

export interface UploadFileByS3Props {
    file: File;
    options?: UploadFileByS3PropsOptions;
}

export type UploadFileByS3Result = Request<S3.Types.PutObjectOutput, AWSError>;

export interface UseFileUploaderResult {
    uploadFile: (file?: File) => Promise<UploadFileByS3Result>;
    uploading: boolean;
}

export const uploadFileByS3 = async (props: UploadFileByS3Props): Promise<UploadFileByS3Result> => {
    const client = new S3({
        credentials: {
            accessKeyId: REACT_APP_S3_ACCESS_KEY_ID,
            secretAccessKey: REACT_APP_S3_SECRET_ACCESS_KEY,
        },
        endpoint: REACT_APP_S3_ENDPOINT,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
        httpOptions: { timeout: 0 },
    });
    const { file, options } = props || {};
    const { onHttpUploadProgress, onComplete } = options || {};
    const { ciphertext } = await encryptFile(file);
    if (!ciphertext) throw new Error('File is empty');
    const buf = Buffer.from(ciphertext, 'base64');
    if (!buf?.length) throw new Error('File is empty');
    const result = await client.putObject({
        ACL: 'public-read',
        Body: buf,
        Bucket: 'inputs',
        ContentEncoding: 'base64',
        Key: file.name,
    });
    result
        .on('httpUploadProgress', (evt) => {
            onHttpUploadProgress?.(evt);
        })
        .on('complete', (response) => {
            onComplete?.(response);
        })
        .send((err) => {
            if (err) {
                console.error('err', err);
                throw err;
            }
        });
    return result;
};

export const useFileUploader = (): UseFileUploaderResult => {
    const [uploading, setUploading] = useState(false);
    const uploadFile = useCallback(async (file?: File): Promise<UploadFileByS3Result> => {
        setUploading(true);
        if (!file) throw new Error('File required');
        let result;
        try {
            result = await uploadFileByS3({ file });
        } catch (e) {
            throw new Error('File upload error');
        } finally {
            setUploading(false);
        }
        return result;
    }, []);
    return {
        uploadFile,
        uploading,
    };
};
