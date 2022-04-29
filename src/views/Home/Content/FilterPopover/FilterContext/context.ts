import React from 'react';
import { Filter } from '../models';

export interface FilterContextProps {
    open: boolean;
    setOpen: Function;
    filters: Filter[];
}

export const FilterContext = React.createContext<FilterContextProps>({
    open: false,
    setOpen: () => {},
    filters: [],
});

export const FilterContextConsumer = FilterContext.Consumer;
export const FilterContextProvider = FilterContext.Provider;
