import { memo, FC } from 'react';
import { Box, Icon, Ellipsis } from '@/uikit';
import { EyeLinkProps } from './types';
import classes from './EyeLink.module.scss';

export const EyeLink: FC<EyeLinkProps> = memo(({
    children,
    onClick = () => {},
    isEllipsis = true,
}) => {
    if (!children) return null;
    return (
        <Box alignItems="center">
            <Box>
                <Icon
                    width={14}
                    name="eye"
                    className={classes.icon}
                    onClick={onClick}
                />
            </Box>
            {isEllipsis ? <Ellipsis>{children}</Ellipsis> : children}
        </Box>
    );
});
