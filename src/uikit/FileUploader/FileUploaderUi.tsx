import { memo } from 'react';
import { useDropzone } from 'react-dropzone';

import { Box } from '@/uikit';
import { FileUploaderUiProps } from './types';
import classes from './FileUploaderUi.module.scss';

export const FileUploaderUi = memo<FileUploaderUiProps>(({
    children,
    uploadFile = () => {},
}) => {
    const {
        getRootProps, getInputProps,
    } = useDropzone({
        multiple: false,
        onDrop: (acceptedFiles) => {
            for (let i = 0; i < acceptedFiles.length; i++) {
                uploadFile(acceptedFiles[i]);
            }
        },
    });

    return (
        <Box direction="column">
            <div className={classes.title}>File</div>
            <Box direction="column">
                <div {...getRootProps({ className: classes.dropzone })}>
                    <input {...getInputProps()} />
                    {children}
                </div>
            </Box>
            <div className={classes.errorEmpty} />
        </Box>
    );
});
