import { ReactElement } from 'react';
import { useDropzone } from 'react-dropzone';

import { Box, Icon } from '@/uikit';
import classes from './FileUploader.module.scss';

export const FileUploader = (): ReactElement => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    return (
        <Box direction="column">
            <div className={classes.title}>File</div>
            <section className={classes.container}>
                <div {...getRootProps({ className: classes.dropzone })}>
                    <input {...getInputProps()} />
                    <Box alignItems="center">
                        <Icon name="clip2" width={12} height={14} className={classes.icon} />
                        <p>Add file or drag and drop</p>
                    </Box>
                </div>
            </section>
            <div className={classes.errorEmpty} />
        </Box>
    );
};
