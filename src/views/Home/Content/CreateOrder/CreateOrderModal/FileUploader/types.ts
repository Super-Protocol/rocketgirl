export interface FileUploaderProps {
    disabled?: boolean;
    uploading?: boolean;
    error?: string;
    name: string;
}

export interface FileNameProps {
    filename: string;
    disabled?: boolean;
}
