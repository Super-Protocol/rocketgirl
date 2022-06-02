import { ReactElement, useState, useCallback } from 'react';
import { S3 } from 'aws-sdk';

import {
    Box, Icon, Spinner, FileUploaderUi,
} from '@/uikit';
import classes from './FileUploader.module.scss';
import { S3_BUCKET, S3_CONFIG } from './helpers';

const client = new S3(S3_CONFIG);

export const FileUploader = (): ReactElement => {
    // const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState({
        show: false,
        process: false,
        fileName: '',
    });
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    const uploadFile = useCallback(async (file) => {
        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name,
        };
        const idx = uploadedFiles.findIndex((el) => el === file.name);
        if (idx >= 0) {
            return;
        }

        await client.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setLoading((prev) => ({
                    ...prev, show: true, fileName: file.name, process: true,
                }));
                // setProgress(Math.round((evt.loaded / evt.total) * 100));
            })
            .on('complete', (_) => {
                setLoading((prev) => ({
                    ...prev, process: false,
                }));
                setUploadedFiles((prev) => [...prev, file.name]);
            })
            .send((err) => {
                if (err) console.error(err);
            });
    }, [uploadedFiles]);

    return (
        <FileUploaderUi {...{ uploadFile }}>
            {loading.show ? (
                <Box className={classes.file} alignItems="center">
                    {loading.process && (
                        <div className={classes.spinnerWrapper}>
                            <Spinner
                                animation="border"
                                size="sm"
                                variant="custom"
                                className={classes.spinner}
                            />
                        </div>
                    )}
                    <div className={classes.fileName}>{loading.fileName}</div>
                </Box>
            ) : (
                <Box alignItems="center">
                    <Icon name="clip2" width={12} height={14} className={classes.icon} />
                    <p>Add file or drag and drop</p>
                </Box>
            )}
        </FileUploaderUi>
    );
};
