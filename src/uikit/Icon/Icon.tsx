import {
    forwardRef, ForwardRefExoticComponent, memo, Ref,
} from 'react';
import cn from 'classnames';
import icons from '@/assets/icons/icons.svg';
import { IconProps } from './types';
import classes from './Icon.module.scss';

export const Icon: ForwardRefExoticComponent<IconProps> = memo(forwardRef(({
    name,
    height,
    width = 20,
    className = '',
    ...props
}, ref?: Ref<SVGSVGElement>) => (
    <svg
        ref={ref}
        className={cn(classes.icon, className)}
        style={{ width: `${width}px`, height: `${height || width}px` }}
        {...props}
    >
        <use href={`${icons}#${name}`} />
    </svg>
)));
