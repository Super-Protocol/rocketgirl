import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';

export const useNavigateBack: (state?: any) => Function = (state) => {
    const { pathname, search } = useLocation();
    const navigate = useNavigate();
    return (): void => {
        const searchStr = search || pathname.split('?')[1];
        const { goBackUrl } = queryString.parse(searchStr);
        navigate(goBackUrl as string || '/', state);
    };
};
