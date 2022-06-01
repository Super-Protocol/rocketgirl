import { ReactElement, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { S3 } from 'aws-sdk';

import { Box, Icon } from '@/uikit';
import classes from './FileUploader.module.scss';
import { S3_BUCKET, S3_CONFIG } from './helpers';

const client = new S3(S3_CONFIG);

export const FileUploader = (): ReactElement => {
    const [progress, setProgress] = useState(0);
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

        client.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100));
            })
            .on('complete', (_) => {
                setUploadedFiles((prev) => [...prev, file.name]);
            })
            .send((err) => {
                if (err) console.error(err);
            });
    }, [uploadedFiles]);

    const {
        getRootProps, getInputProps,
    } = useDropzone({
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
                <ul>
                    {uploadedFiles.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <div>{progress}</div>
                <div {...getRootProps({ className: classes.dropzone })}>
                    <input {...getInputProps()} />
                    <Box alignItems="center">
                        <Icon name="clip2" width={12} height={14} className={classes.icon} />
                        <p>Add file or drag and drop</p>
                    </Box>
                </div>
            </Box>
            <div className={classes.errorEmpty} />
        </Box>
    );
};
