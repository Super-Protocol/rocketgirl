import { Accept } from 'react-dropzone';

export interface FileUploaderProps {
    disabled?: boolean;
    uploading?: boolean;
    error?: string;
    name: string;
    accept: Accept;
}

export interface FileNameProps {
    filename: string;
    disabled?: boolean;
}
