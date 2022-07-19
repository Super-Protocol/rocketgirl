export interface AccessTokenModalProps {
    onSuccess?: () => void;
}

export enum Fields {
    token = 'token'
}

export interface FormValues {
    [Fields.token]: string;
}
