import { memo, ReactElement, useMemo } from 'react';

import { Tooltip } from '@/uikit';
import classes from './FileUploader.module.scss';
import { FileNameProps } from './types';

export const FileName = memo<FileNameProps>(({ filename, disabled }): ReactElement => {
    const filestruct = useMemo(() => {
        return {
            short: filename?.length >= 40 ? `${filename.substring(0, 37)}...` : filename,
            isLong: filename?.length >= 40,
        };
    }, [filename]);
    return (
        <div className={classes.fileName}>
            {filestruct.isLong
                ? (
                    disabled ? filestruct.short : (
                        <Tooltip
                            tooltip={filename}
                            placement="bottom"
                            hideArrow
                        >
                            {filestruct.short}
                        </Tooltip>
                    )
                ) : filename }
        </div>
    );
});
