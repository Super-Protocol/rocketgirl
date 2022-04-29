import { memo, FC } from 'react';
import { Spinner as SpinnerBootstrap } from 'react-bootstrap';
import classes from './Spinner.module.scss';
import { SpinnerProps } from './types';

export const Spinner: FC<SpinnerProps> = memo(({ fullscreen = false, animation = 'grow', ...props }) => {
    if (fullscreen) {
        return (
            <div className={classes.wrap}>
                <SpinnerBootstrap animation={animation} {...props} />
            </div>
        );
    }
    return <SpinnerBootstrap animation={animation} {...props} />;
});
