import { ReactNode } from 'react';

export interface FileUploaderUiProps {
    children: ReactNode;
    uploadFile?: Function;
}
