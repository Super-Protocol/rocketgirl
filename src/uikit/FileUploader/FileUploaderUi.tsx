import { memo } from 'react';
import { useDropzone } from 'react-dropzone';
import cn from 'classnames';

import { FileUploaderUiProps } from './types';
import classes from './FileUploaderUi.module.scss';

export const FileUploaderUi = memo<FileUploaderUiProps>(({
    children,
    options = {},
    error,
}) => {
    const { getRootProps, getInputProps } = useDropzone(options);

    return (
        <div {...getRootProps({ className: cn(classes.dropzone, { [classes['dropzone-error']]: error }) })}>
            <input {...getInputProps()} />
            {children}
        </div>
    );
});
