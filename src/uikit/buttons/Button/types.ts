import type { ReactNode, DetailedHTMLProps, ButtonHTMLAttributes } from 'react';

export type variants = 'red'
    | 'white'
    | 'grey'
    | 'grey-light'
    | 'transparent-black'
    | 'orange';

export type sizes = 'sm' | 'lg';

type ButtonBaseProps = Pick<
    DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    'title' | 'type' | 'style' | 'className' | 'disabled'
>

export interface ButtonProps extends ButtonBaseProps {
    children?: ReactNode | string;
    variant?: variants;
    size?: sizes;
    loading?: boolean;
    wide?: boolean;
    href?: string;
    onClick?: Function | void;
    fullWidth?: boolean;
    marginBottom?: boolean;
    label?: string;
}
