import { memo, useCallback } from 'react';
import copy from 'copy-to-clipboard';

import { Icon } from '@/uikit';
import toastr from '@/services/Toastr/toastr';
import { CopyToClipboardSimpleProps } from './types';
import classes from './CopyToClipboard.module.scss';

export const CopyToClipboardSimple = memo<CopyToClipboardSimpleProps>(({ text, notification }) => {
    const onCopy = useCallback((event) => {
        copy(text);
        if (notification) {
            toastr.success(`Copy: ${text}`);
        }
    }, [text, notification]);

    return (
        <div className={classes.wrap}>
            <Icon
                width={16}
                name="copy2"
                className={classes.iconSimple}
                onClick={onCopy}
            />
        </div>
    );
});
