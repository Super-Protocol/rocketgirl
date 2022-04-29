import { FilterMode } from './types';
import { Item } from '@/uikit/Select/types';

export interface FilterProps {
    name: string;
    value?: any;
    mode?: FilterMode;
    field?: string;
    placeholder?: string;
    label?: string;
    options?: Item[];
}

export class Filter {
    public name: string;
    public value: any;
    public mode: FilterMode;
    public placeholder: string;
    public label: string;
    public options: Item[];
    constructor({
        name,
        value,
        mode,
        placeholder,
        label,
        options,
    }: FilterProps) {
        this.name = name;
        this.mode = mode || FilterMode.eq;
        this.value = value;
        this.placeholder = placeholder || '';
        this.label = label || '';
        this.options = options || [];
    }
}
