import { useCallback, useState } from 'react';
import { Crypto } from '@super-protocol/sdk-js';
import { CryptoAlgorithm, Encoding } from '@super-protocol/dto-js/build/enum';
import { Encryption, Cipher } from '@super-protocol/dto-js';
import { generateRandomKeys } from '@/utils/crypto';
import { getBinaryStringFromFile } from '@/common/helpers';

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
        const binaryString = await getBinaryStringFromFile(file);
        try {
            const encryption = await Crypto.encrypt(
                binaryString as string,
                {
                    algo: CryptoAlgorithm.AES,
                    encoding: Encoding.base64,
                    key: privateKeyBase64,
                    cipher: Cipher.AES_256_GCM,
                },
            );
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
