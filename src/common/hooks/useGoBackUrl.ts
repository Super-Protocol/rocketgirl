import { useLocation } from 'react-router-dom';

export const useGoBackUrl = (): string => {
    const { pathname, search } = useLocation();
    return `goBackUrl=${encodeURIComponent(pathname)}${encodeURIComponent(search)}`;
};
