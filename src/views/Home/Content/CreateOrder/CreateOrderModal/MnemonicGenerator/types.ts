export interface MnemonicGeneratorComponentProps {
    name: string;
    nameMode: string;
    nameAgreement: string;
}

export interface MnemonicGeneratorProps extends MnemonicGeneratorComponentProps {
    classNameWrap?: string;
}
