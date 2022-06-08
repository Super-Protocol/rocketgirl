export interface MnemonicGeneratorComponentProps {
    canShowAgreement: boolean;
    setAgreement: Function;
    name: string;
    nameMode: string;
    nameAgreement: string;
}

export interface MnemonicGeneratorProps extends MnemonicGeneratorComponentProps {
    classNameWrap?: string;
}
