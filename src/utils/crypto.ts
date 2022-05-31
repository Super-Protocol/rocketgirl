import eccrypto from 'eccrypto';

export interface GenerateKeysResult {
    privateKey: string;
    publicKey: string;
    phrase: string;
}

export const generateKeys = (phrase: string): GenerateKeysResult => {
    const privateKey = Buffer.from(phrase);
    const privateKeyBase64 = privateKey.toString('base64');
    const publicKey = eccrypto.getPublic(privateKey);
    const publicKeyBase64 = publicKey.toString('base64');
    return {
        privateKey: privateKeyBase64,
        publicKey: publicKeyBase64,
        phrase,
    };
};
