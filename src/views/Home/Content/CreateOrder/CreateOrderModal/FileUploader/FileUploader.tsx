import {
    ReactElement, useCallback, useMemo, memo,
} from 'react';

import { DropzoneOptions } from 'react-dropzone';
import cn from 'classnames';
import { useField } from 'formik';

import {
    Box, Icon, Spinner, FileUploaderUi, Tooltip,
} from '@/uikit';
import { TooltipTheme } from '@/uikit/Tooltip/types';
import { FileName } from './FileName';
import classes from './FileUploader.module.scss';
import { tooltipText } from './helpers';
import { FileUploaderProps } from './types';

export const FileUploader = memo<FileUploaderProps>(({ disabled, uploading }): ReactElement => {
    const [, { value, error }, { setValue }] = useField('file');

    const options = useMemo((): DropzoneOptions => {
        return {
            multiple: false,
            disabled,
            onDrop: (acceptedFiles) => {
                setValue(acceptedFiles[0]);
            },
        };
    }, [setValue, disabled]);

    const onDeleteClick = useCallback(() => {
        setValue(undefined);
    }, [setValue]);

    return (
        <Box direction="column" className={classes.wrap}>
            <Box alignItems="center" className={classes.titleLine}>
                <div className={classes.title}>File</div>
                <Tooltip
                    theme={TooltipTheme.white}
                    placement="top-start"
                    tooltip={tooltipText}
                >
                    <Icon
                        name="info_fill2"
                        width={16}
                        height={16}
                        className={classes.iconInfo}
                    />
                </Tooltip>
            </Box>
            {value ? (
                <Box className={cn(classes.file, { [classes['file-error']]: error })} alignItems="center">
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
                    <FileName {...{ filename: value?.name }} />
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
        </Box>
    );
});
