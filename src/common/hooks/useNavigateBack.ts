import { useHistory } from 'react-router-dom';
import queryString from 'query-string';

export const useNavigateBack: (state?: any) => Function = (state) => {
    const history = useHistory();
    return (): void => {
        const { pathname, search } = history.location;
        const searchStr = search || pathname.split('?')[1];
        const { goBackUrl } = queryString.parse(searchStr);
        history.push(goBackUrl || '/', state);
    };
};
