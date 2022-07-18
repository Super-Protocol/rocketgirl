export interface AccessTokenModalProps {
    onSuccess?: (token: string) => void;
}

export enum Fields {
    token = 'token'
}

export interface FormValues {
    [Fields.token]: string;
}
