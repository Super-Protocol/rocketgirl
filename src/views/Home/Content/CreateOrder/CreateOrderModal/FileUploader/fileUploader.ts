import { S3, AWSError, Response } from 'aws-sdk';
import { Progress } from 'aws-sdk/lib/request';
import { PutObjectOutput } from 'aws-sdk/clients/s3';
import {
    Crypto,
} from '@super-protocol/sp-sdk-js';
import { CryptoAlgorithm, Encoding } from '@super-protocol/sp-dto-js/build/enum';
import { Encryption } from '@super-protocol/sp-dto-js';
import { generateRandomKeys } from '@/utils/crypto';
import { getBase64FromFile } from '@/common/helpers';
import { S3_BUCKET, S3_CONFIG } from './helpers';

const client = new S3(S3_CONFIG);

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

export const uploadFileByS3 = async (props: UploadFileByS3Props): Promise<void> => {
    const { file, options } = props || {};
    const { onHttpUploadProgress, onComplete, onError } = options || {};
    const { ciphertext } = await encryptFile(file);
    if (!ciphertext) throw new Error('File is empty');
    const buf = Buffer.from(ciphertext, 'base64');
    if (!buf?.length) throw new Error('File is empty');
    const params = {
        ACL: 'public-read',
        Body: buf,
        Bucket: S3_BUCKET,
        ContentEncoding: 'base64',
        Key: file.type,
    };
    await client.putObject(params)
        .on('httpUploadProgress', (evt) => {
            onHttpUploadProgress?.(evt);
        })
        .on('complete', (response) => {
            console.log('complete', response);
            onComplete?.(response);
        })
        .send((err) => {
            if (err) {
                console.error(err);
                onError?.(err);
            }
        });
};
