import { S3, AWSError, Response } from 'aws-sdk';
import { Progress, Request } from 'aws-sdk/lib/request';
import { PutObjectOutput } from 'aws-sdk/clients/s3';
import { useCallback, useState } from 'react';
import CONFIG from '@/config';

const { REACT_APP_S3_UPLOAD_ACCESS_KEY_ID, REACT_APP_S3_UPLOAD_ACCESS_SECRET_KEY, REACT_APP_S3_ENDPOINT } = CONFIG;

export interface UploadFileByS3PropsOptions {
    onHttpUploadProgress?: (progress: Progress) => void;
    onComplete?: (response: Response<PutObjectOutput, AWSError>) => void;
    onError?: (err: AWSError) => void;
}

export interface UploadFileByS3Props {
    ciphertext?: string;
    fileName: string;
    options?: UploadFileByS3PropsOptions;
}

export type UploadFileByS3Result = Request<S3.Types.PutObjectOutput, AWSError>;

export interface UploadFileProps {
    ciphertext?: string;
    fileName: string;
}

export interface UseFileUploaderResult {
    uploadFile: (props: UploadFileProps) => Promise<UploadFileByS3Result>;
    uploading: boolean;
}

export const uploadFileByS3 = async (props: UploadFileByS3Props): Promise<UploadFileByS3Result> => {
    const client = new S3({
        credentials: {
            accessKeyId: REACT_APP_S3_UPLOAD_ACCESS_KEY_ID,
            secretAccessKey: REACT_APP_S3_UPLOAD_ACCESS_SECRET_KEY,
        },
        endpoint: REACT_APP_S3_ENDPOINT,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
        httpOptions: { timeout: 0 },
    });
    const { ciphertext, fileName, options } = props || {};
    const { onHttpUploadProgress, onComplete } = options || {};
    if (!ciphertext) throw new Error('File is empty');
    const buf = Buffer.from(ciphertext, 'base64');
    if (!buf?.length) throw new Error('File is empty');
    const result = await client.putObject({
        ACL: 'public-read',
        Body: buf,
        Bucket: 'inputs',
        ContentEncoding: 'base64',
        Key: fileName,
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
                console.error('upload file error: ', err);
                throw err;
            }
        });
    return result;
};

export const useFileUploader = (): UseFileUploaderResult => {
    const [uploading, setUploading] = useState(false);
    const uploadFile = useCallback(async (props: UploadFileProps): Promise<UploadFileByS3Result> => {
        setUploading(true);
        let result;
        try {
            result = await uploadFileByS3(props);
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
