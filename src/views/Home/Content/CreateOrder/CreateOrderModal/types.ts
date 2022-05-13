export interface FormValues {
    solution?: string;
    data?: (string | undefined)[];
    tee?: string;
    storage?: string;
    file?: any; // todo
    deposit?: number;
}

export interface CreateOrderModalProps {
    initialValues?: FormValues;
}
