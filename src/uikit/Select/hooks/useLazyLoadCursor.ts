import {
    useEffect, useCallback, MutableRefObject,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Item } from '@/uikit/Select/types';

const INTERSECTION_THRESHOLD = 5;
const DELAY = 100;

export interface State {
    loading: boolean;
}

export type Cursor = string | null | undefined;

export type FetchDataResult = { cursor?: Cursor; options?: Item[] };

export type FetchData = (cursor: Cursor) => Promise<FetchDataResult>;

export interface UseLazyLoadCursorProps {
    triggerRef: MutableRefObject<null | undefined>;
    fetchData: FetchData;
    cursor: Cursor;
    loading: boolean;
    delay?: number;
}

const useLazyLoadCursor = ({
    triggerRef,
    fetchData,
    loading,
    cursor,
    delay = DELAY,
}: UseLazyLoadCursorProps): void => {
    const refetch = useCallback(async () => {
        return fetchData(cursor).catch(() => ({ cursor: null, options: [] }));
    }, [cursor, fetchData]);

    const handleEntry = useCallback(async (entry) => {
        const { intersectionRect, boundingClientRect } = entry || {};
        if (!loading
            && cursor !== null
            && (entry.isIntersecting && intersectionRect.bottom - boundingClientRect.bottom <= INTERSECTION_THRESHOLD)
        ) {
            await refetch();
        }
    }, [loading, cursor, refetch]);

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
    }, [triggerRef, onIntersect, cursor]);
};

export default useLazyLoadCursor;
