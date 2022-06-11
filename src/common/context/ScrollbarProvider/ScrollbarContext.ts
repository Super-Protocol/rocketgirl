import { createContext } from 'react';

import { ScrollbarContextProps } from './types';

export const ScrollbarContext = createContext<ScrollbarContextProps>({
    instance: null,
});

export const ScrollbarContextProvider = ScrollbarContext.Provider;
