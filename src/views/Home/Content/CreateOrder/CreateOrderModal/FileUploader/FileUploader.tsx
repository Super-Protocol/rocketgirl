import {
    ReactElement, useCallback, useMemo, memo,
} from 'react';

import { DropzoneOptions } from 'react-dropzone';
import cn from 'classnames';
import { useField } from 'formik';

import {
    Box, Icon, Spinner, FileUploaderUi,
} from '@/uikit';
import { LabelToolkit } from '@/common/components';
import { FileName } from './FileName';
import classes from './FileUploader.module.scss';
import { tooltipText } from './helpers';
import { FileUploaderProps } from './types';

export const FileUploader = memo<FileUploaderProps>(({
    disabled,
    uploading,
    name,
}): ReactElement => {
    const [, { value, error }, { setValue, setError }] = useField(name);

    const options = useMemo((): DropzoneOptions => {
        return {
            multiple: false,
            disabled,
            onDrop: (acceptedFiles) => {
                const file = acceptedFiles[0];
                const { size, name } = file || {};
                if (size > 67108864) {
                    setError('File size should not exceed 64MB');
                    return;
                }
                if (!(name.endsWith('.tar') || name.endsWith('.tar.gz'))) {
                    setError('File format must be .tar or .tar.gz');
                    return;
                }
                setError(undefined);
                setValue(file);
            },
            onDropRejected: (result) => {
                const errors = result.map(({ errors }) => errors).flat();
                if (errors.length) {
                    setError(errors[0]?.message);
                }
            },
        };
    }, [setValue, disabled, setError]);

    const onDeleteClick = useCallback(() => {
        if (!disabled) {
            setValue(undefined);
        }
    }, [setValue, disabled]);

    return (
        <LabelToolkit
            tooltipText={tooltipText}
            title="File"
        >
            {value ? (
                <Box
                    className={cn(classes.file, { [classes['file-error']]: error, [classes.disabled]: disabled })}
                    alignItems="center"
                >
                    {uploading && (
                        <div className={classes.spinnerWrapper}>
                            <Spinner
                                animation="border"
                                size="sm"
                                variant="custom"
                                className={classes.spinner}
                            />
                        </div>
                    )}
                    <FileName {...{ filename: value?.name, disabled }} />
                    {!uploading && (
                        <Icon
                            name="close-small"
                            width={12}
                            height={14}
                            className={classes.iconDelete}
                            onClick={onDeleteClick}
                        />
                    )}
                </Box>
            ) : (
                <FileUploaderUi {...{ options, error: !!error }}>
                    <Box alignItems="center" className={cn({ [classes.disabled]: disabled })}>
                        <Icon name="clip2" width={12} height={14} className={classes.icon} />
                        <div className={classes.text}>
                            <span className={classes.addfile}>Add file</span>
                        &nbsp;
                            <span className={classes.dragdrop}>or drag and drop</span>
                        </div>
                    </Box>
                </FileUploaderUi>
            )}
            {error ? (
                <div className={classes.error}>{error}</div>
            ) : <div className={classes.errorEmpty} />}
        </LabelToolkit>
    );
});
