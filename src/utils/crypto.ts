import eccrypto from 'eccrypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bip39 = require('bip39');

export interface GenerateECIESKeysResult {
    privateKeyBase64: string;
    publicKeyBase64: string;
    privateKeyBuffer: Buffer;
    publicKeyBuffer: Buffer;
    mnemonic: string;
}
export interface GenerateRandomKeysResult {
    privateKeyBuffer: Buffer;
    publicKeyBuffer: Buffer;
    privateKeyBase64: string;
    publicKeyBase64: string;
}

export const generateMnemonic = (): string => bip39.generateMnemonic(256);

export const validateMnemonic = (mnemonic: string): boolean => bip39.validateMnemonic(mnemonic);

export const generateECIESKeys = (mnemonic: string): GenerateECIESKeysResult => {
    const entropy = bip39.mnemonicToEntropy(mnemonic);
    const privateKeyBuffer = Buffer.from(entropy, 'hex');
    const publicKeyBuffer = eccrypto.getPublic(privateKeyBuffer);
    const privateKeyBase64 = privateKeyBuffer.toString('base64');
    const publicKeyBase64 = publicKeyBuffer.toString('base64');
    return {
        privateKeyBase64,
        publicKeyBase64,
        privateKeyBuffer,
        publicKeyBuffer,
        mnemonic,
    };
};

export const generateRandomKeys = (): GenerateRandomKeysResult => {
    const privateKeyBuffer = eccrypto.generatePrivate();
    const publicKeyBuffer = eccrypto.getPublic(privateKeyBuffer);
    const privateKeyBase64 = privateKeyBuffer.toString('base64');
    const publicKeyBase64 = publicKeyBuffer.toString('base64');
    return {
        privateKeyBuffer,
        publicKeyBuffer,
        privateKeyBase64,
        publicKeyBase64,
    };
};
