import { useLocation } from 'react-router-dom';

const useSearchParams = (): URLSearchParams => {
    return new URLSearchParams(useLocation().search);
};

export default useSearchParams;
