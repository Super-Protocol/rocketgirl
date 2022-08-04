export type Color = 'yellow'
    | 'red'
    | 'blue'
    | 'green'
    | 'orange'
    | 'violet'
    | 'violet-light'
    | 'grey';

export interface StatusBarProps {
    color?: Color;
    isSpinner?: boolean;
    isStatus?: boolean;
}
