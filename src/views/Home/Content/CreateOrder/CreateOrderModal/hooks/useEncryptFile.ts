import { useCallback, useState } from 'react';
import { Crypto } from '@super-protocol/sp-sdk-js';
import { CryptoAlgorithm, Encoding } from '@super-protocol/sp-dto-js/build/enum';
import { Encryption } from '@super-protocol/sp-dto-js';
import { generateRandomKeys } from '@/utils/crypto';
import { getBase64FromFile, getBase64FromHex } from '@/common/helpers';

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
        const { privateKey } = generateRandomKeys();
        const base64Key = getBase64FromHex(privateKey);
        const base64 = await getBase64FromFile(file);
        try {
            const encryption = await Crypto.encrypt(
                base64 as string,
                {
                    algo: CryptoAlgorithm.AES,
                    encoding: Encoding.base64,
                    key: base64Key,
                },
            );
            return {
                encryption,
                key: base64Key,
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
