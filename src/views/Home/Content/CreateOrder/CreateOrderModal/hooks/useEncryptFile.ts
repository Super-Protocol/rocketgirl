import { useCallback, useState } from 'react';
import { Crypto } from '@super-protocol/sp-sdk-js';
import { CryptoAlgorithm, Encoding } from '@super-protocol/sp-dto-js/build/enum';
import { Encryption } from '@super-protocol/sp-dto-js';
import { generateRandomKeys } from '@/utils/crypto';
import { getBase64FromFile } from '@/common/helpers';

export interface UseEncryptFileResultEncryptFileResult {
    encryption: Encryption;
    key: string;
}

export interface UseEncryptFileResult {
    encryptFile: (file: File) => Promise<UseEncryptFileResultEncryptFileResult>;
    encrypting: boolean;
}

export const useEncryptFile = (): UseEncryptFileResult => {
    const [encrypting, setEncrypting] = useState(false);
    const encryptFile = useCallback(async (file: File): Promise<UseEncryptFileResultEncryptFileResult> => {
        setEncrypting(true);
        const { privateKeyBase64 } = generateRandomKeys();
        const base64 = (await getBase64FromFile(file)).split(',').pop();
        try {
            const encryption = await Crypto.encrypt(
                base64 as string,
                {
                    algo: CryptoAlgorithm.AES,
                    encoding: Encoding.base64,
                    key: privateKeyBase64,
                },
            );
            // const fileContent = await Crypto.decrypt({ ...encryption, key: privateKeyBase64 });
            // console.log('fileContent', fileContent);
            // console.log('base64', base64);
            // console.log('base64Content', fileContent);
            //
            // const pom = document.createElement('a');
            // pom.setAttribute('href', `data:application/octet-stream;charset=utf-16le;base64, ${fileContent}`);
            // pom.setAttribute('download', 'test.gz');
            // if (document.createEvent) {
            //     const event = document.createEvent('MouseEvents');
            //     event.initEvent('click', true, true);
            //     pom.dispatchEvent(event);
            // } else {
            //     pom.click();
            // }
            return {
                encryption,
                key: privateKeyBase64,
            };
        } finally {
            setEncrypting(false);
        }
    }, []);
    return {
        encryptFile,
        encrypting,
    };
};
