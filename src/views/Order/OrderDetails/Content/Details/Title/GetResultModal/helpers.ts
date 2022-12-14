import * as Yup from 'yup';
import { S3 } from 'aws-sdk';
import {
    Crypto,
    Order,
    OrderStatus,
} from '@super-protocol/sdk-js';
import {
    Encryption,
    StorageProviderResource,
} from '@super-protocol/dto-js';
import {
    getBase64FromBlob,
} from '@/common/helpers';
import CONFIG from '@/config';
import { generateECIESKeys, validateMnemonic } from '@/utils/crypto';
import { Fields, ErrorDecription } from './types';

export const getPhraseSchema = (): Yup.BaseSchema => Yup.string().test(
    Fields.phrase,
    'Invalid phrase entered',
    (str = '') => validateMnemonic(str),
) as Yup.BaseSchema;

export const getValidationSchema = (): any => {
    return Yup.object({
        [Fields.phrase]: getPhraseSchema(),
    });
};

export const initialValues = {
    [Fields.phrase]: '',
};

export const placeholder = 'Enter a passphrase here...';

const {
    REACT_APP_S3_DOWNLOAD_ACCESS_KEY_ID,
    REACT_APP_S3_DOWNLOAD_ACCESS_SECRET_KEY,
    REACT_APP_S3_ENDPOINT,
} = CONFIG;

export const getFileUrlFromS3Storage = async (fileName: string, bucket: string): Promise<string> => {
    const config = {
        credentials: {
            accessKeyId: REACT_APP_S3_DOWNLOAD_ACCESS_KEY_ID,
            secretAccessKey: REACT_APP_S3_DOWNLOAD_ACCESS_SECRET_KEY,
        },
        endpoint: REACT_APP_S3_ENDPOINT,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
        httpOptions: { timeout: 0 },
    };

    const client = new S3(config);
    const url = await client.getSignedUrlPromise('getObject', {
        Bucket: bucket,
        Key: fileName,
    });
    return url || '';
};

export const encodingAndDownloadFile = async (
    orderId: string,
    phrase: string,
    status?: OrderStatus,
): Promise<{ isFile: boolean, content: string }> => {
    const { privateKeyBase64 } = generateECIESKeys(phrase);
    const order = new Order(orderId);
    const { encryptedResult, encryptedError } = await order.getOrderResult();
    if (!encryptedResult && !encryptedError) throw new Error('Order encrypted result is empty');
    const encryptedStr = encryptedResult || encryptedError;

    let decrypted = '';

    const encryptedObj: { resource: Encryption, encryption: Encryption } = JSON.parse(encryptedStr);
    if (encryptedObj.resource && encryptedObj.encryption) {
        try {
            const encryptedResource: Encryption = encryptedObj.resource;
            encryptedResource.key = privateKeyBase64;
            const decryptedResource = await Crypto.decrypt(encryptedResource);

            const encryptedEncryption: Encryption = encryptedObj.encryption;
            encryptedEncryption.key = privateKeyBase64;
            const decryptedEncryption = await Crypto.decrypt(encryptedEncryption);

            decrypted = `{ "resource": ${decryptedResource}, "encryption": ${decryptedEncryption} }`;
        } catch (e) {
            console.error(e);
            throw new Error('Unable to decrypt the order result');
        }
    } else {
        const encryptedObj: Encryption = JSON.parse(encryptedStr);
        encryptedObj.key = privateKeyBase64;
        try {
            decrypted = await Crypto.decrypt(encryptedObj);
        } catch (e) {
            console.error(e);
            throw new Error('Unable to decrypt the order result');
        }
        const decryptedResult: ErrorDecription = JSON.parse(decrypted);
        if (decryptedResult?.name.indexOf('Error') !== -1) {
            if (status === OrderStatus.Error) {
                throw new Error(decryptedResult?.message);
            } else {
                decrypted = decryptedResult?.message;
            }
        }
    }

    const decryptedObj: { resource: StorageProviderResource, encryption: Encryption } = JSON.parse(decrypted);
    if (!decryptedObj) throw new Error('Decrypted object is empty');
    const { resource, encryption } = decryptedObj || {};
    const { filepath } = resource || {};
    if (!filepath) {
        return {
            isFile: false,
            content: JSON.stringify(decryptedObj, null, 2),
        };
    }
    const url = await getFileUrlFromS3Storage(
        decryptedObj.resource.credentials.prefix + filepath, decryptedObj.resource.credentials.bucket,
    );
    if (!url) {
        throw new Error('Wrong url');
    }
    const data = await fetch(url);
    if ([403, 404].includes(data?.status)) {
        throw new Error('Unable to get file result');
    }
    const dataBlob = await data.blob();
    const base64WithoutTags = (await getBase64FromBlob(dataBlob) as string).split(',').pop();
    if (!base64WithoutTags) throw new Error('File is empty');
    encryption.ciphertext = base64WithoutTags;

    const fileName = filepath.replace('.encrypted', '');
    const fileContent = await Crypto.decrypt(encryption);
    const base64Content = Buffer.from(fileContent, 'binary').toString('base64');

    const pom = document.createElement('a');
    pom.setAttribute('href', `data:application/octet-stream;charset=utf-16le;base64, ${base64Content}`);
    pom.setAttribute('download', fileName);

    if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }

    return {
        isFile: true,
        content: base64Content,
    };
};
