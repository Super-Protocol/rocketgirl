import { useCallback, useEffect, useRef } from 'react';

export const useIsMounted = (): () => boolean => {
    const isMountedRef = useRef(true);
    const isMounted = useCallback(() => isMountedRef.current, []);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return isMounted;
};
