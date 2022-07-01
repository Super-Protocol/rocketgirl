export interface MnemonicGeneratorComponentProps {
    namePhraseInput: string;
    namePhraseGenerated: string;
    nameMode: string;
    nameAgreement: string;
}

export interface MnemonicGeneratorProps extends MnemonicGeneratorComponentProps {
    classNameWrap?: string;
}
