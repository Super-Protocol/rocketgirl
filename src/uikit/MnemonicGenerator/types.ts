export enum Modes {
    generate = 'generate',
    own = 'own',
}

export interface MnemonicGeneratorUiProps {
    value?: string;
    onChange: Function;
    isInvalid?: boolean;
    error?: string;
    mode?: Modes;
    setMode?: Function;
    phrase: string;
}

export interface MnemonicGeneratorFormikProps {
    namePhraseInput: string;
    namePhraseGenerated: string;
    debounceInterval?: number;
    nameMode: string;
}
