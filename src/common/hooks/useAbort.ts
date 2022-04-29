import { useCallback, useRef } from 'react';
import { useMount } from 'react-use';

export interface UseAbortResult {
    abortController: AbortController;
    resetAbortController: () => AbortController;
}

export interface UseAbortProps {
    isAbortUnmount?: boolean;
}

const useAbort = (props?: UseAbortProps): UseAbortResult => {
    const abortController = useRef<AbortController>(new AbortController());

    const abort: () => void = useCallback(
        () => abortController.current && abortController.current.abort(),
        [abortController],
    );

    const resetAbortController: () => AbortController = useCallback(() => {
        abort();
        abortController.current = new AbortController();
        return abortController.current;
    }, [abortController, abort]);

    useMount(() => {
        return () => {
            if (props?.isAbortUnmount) {
                resetAbortController();
            }
        };
    });

    return { abortController: abortController.current, resetAbortController };
};

export default useAbort;
