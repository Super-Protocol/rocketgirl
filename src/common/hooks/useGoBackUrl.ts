import { useHistory } from 'react-router-dom';

export const useGoBackUrl = (): string => {
    const { location: { pathname, search } } = useHistory();
    return `goBackUrl=${encodeURIComponent(pathname)}${encodeURIComponent(search)}`;
};
