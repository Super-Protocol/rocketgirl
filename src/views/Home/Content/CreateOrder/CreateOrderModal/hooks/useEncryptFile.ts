import { useCallback, useState } from 'react';
import { Crypto } from '@super-protocol/sp-sdk-js';
import { CryptoAlgorithm, Encoding } from '@super-protocol/sp-dto-js/build/enum';
import { Encryption } from '@super-protocol/sp-dto-js';
import { generateRandomKeys } from '@/utils/crypto';
import { getBase64FromFile, getBase64FromHex } from '@/common/helpers';

export interface UseEncryptFileResult {
    encryptFile: (file: File) => Promise<Encryption>;
    encrypting: boolean;
}

export const useEncryptFile = (): UseEncryptFileResult => {
    const [encrypting, setEncrypting] = useState(false);
    const encryptFile = useCallback(async (file: File): Promise<Encryption> => {
        setEncrypting(true);
        const { privateKey } = generateRandomKeys();
        const base64 = await getBase64FromFile(file);
        try {
            return Crypto.encrypt(
                base64 as string,
                {
                    algo: CryptoAlgorithm.AES,
                    encoding: Encoding.base64,
                    key: getBase64FromHex(privateKey),
                },
            );
        } finally {
            setEncrypting(false);
        }
    }, []);
    return {
        encryptFile,
        encrypting,
    };
};
