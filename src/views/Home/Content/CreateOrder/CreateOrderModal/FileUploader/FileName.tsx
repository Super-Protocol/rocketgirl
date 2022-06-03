import { memo, ReactElement, useMemo } from 'react';

import { Tooltip } from '@/uikit';
import classes from './FileUploader.module.scss';
import { FileNameProps } from './types';

export const FileName = memo<FileNameProps>(({ filename }): ReactElement => {
    const filestruct = useMemo(() => {
        return {
            short: filename?.length >= 45 ? `${filename.substring(0, 42)}...` : filename,
            isLong: filename?.length >= 45,
        };
    }, [filename]);
    return (
        <div className={classes.fileName}>
            {filestruct.isLong
                ? (
                    <Tooltip
                        tooltip={filename}
                        placement="bottom"
                        hideArrow
                    >
                        {filestruct.short}
                    </Tooltip>
                ) : filename }
        </div>
    );
});
