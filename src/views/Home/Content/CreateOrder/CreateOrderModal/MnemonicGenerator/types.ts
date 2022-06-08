export interface MnemonicGeneratorComponentProps {
    canShowAgreement: boolean;
    setAgreement: Function;
    name: string;
    nameMode: string;
}

export interface MnemonicGeneratorProps extends MnemonicGeneratorComponentProps {
    classNameWrap?: string;
}
