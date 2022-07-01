import { ReactNode } from 'react';
import { DropzoneOptions } from 'react-dropzone';

export interface FileUploaderUiProps {
    children: ReactNode;
    options?: DropzoneOptions;
    error?: boolean;
}
