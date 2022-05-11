import {
    useEffect, useCallback, MutableRefObject, useRef,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

const INTERSECTION_THRESHOLD = 5;
const DELAY = 100;

export interface State {
    loading: boolean;
}

export type FetchData = () => Promise<void>;

export interface useLazyLoadProps {
    triggerRef: MutableRefObject<null | undefined>;
    fetchData: FetchData;
    delay?: number;
}

export const useLazyLoad = ({
    triggerRef,
    fetchData,
    delay = DELAY,
}: useLazyLoadProps): void => {
    const initFetch = useRef(false);
    const handleEntry = useCallback(async (entry) => {
        const { intersectionRect, boundingClientRect } = entry || {};
        if (
            !initFetch.current
            || !(entry.isIntersecting && intersectionRect.bottom - boundingClientRect.bottom <= INTERSECTION_THRESHOLD
            )
        ) {
            initFetch.current = true;
            await fetchData();
        }
    }, [fetchData]);

    const handleEntryDebounce = useDebouncedCallback(handleEntry, delay);

    const onIntersect = useCallback(
        (entries) => {
            handleEntryDebounce(entries[0]);
        },
        [handleEntryDebounce],
    );

    useEffect(() => {
        if (triggerRef.current) {
            const container = triggerRef.current;
            const observer = new IntersectionObserver(onIntersect);

            observer.observe(container);

            return () => {
                observer.disconnect();
            };
        }
    }, [triggerRef, onIntersect]);
};
