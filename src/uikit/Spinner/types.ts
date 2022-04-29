import { SpinnerProps as SpinnerPropsBootstrap } from 'react-bootstrap';

export interface SpinnerProps extends Omit<SpinnerPropsBootstrap, 'animation'> {
    fullscreen?: boolean;
    animation?: 'border' | 'grow';
}
