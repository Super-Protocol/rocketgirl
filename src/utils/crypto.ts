import eccrypto from 'eccrypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bip39 = require('bip39');

export interface GenerateKeysResult {
    privateKey: string;
    publicKey: string;
    mnemonic: string;
}

export const generateMnemonic = (): string => bip39.generateMnemonic(256);

export const generateKeys = (mnemonic: string): GenerateKeysResult => {
    const entropy = bip39.mnemonicToEntropy(mnemonic);
    const privateKey = Buffer.from(entropy, 'hex');
    const publicKey = eccrypto.getPublic(privateKey);
    const privateKeyBase64 = privateKey.toString('base64');
    const publicKeyBase64 = publicKey.toString('base64');
    return {
        privateKey: privateKeyBase64,
        publicKey: publicKeyBase64,
        mnemonic,
    };
};
