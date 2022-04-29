import { useCallback, useRef, useState } from 'react';
import isEqual from 'lodash.isequal';
import { useMount } from 'react-use';
import cloneDeep from 'lodash.clonedeep';

export interface UseTableDiffProps {
    timeout?: number;
    key?: string;
}

export interface Diff {
    values: Set<string>;
    key?: string;
}

export interface UseTableDiffResult {
    updateDiff: (values: string[]) => void;
    diff: Diff;
    deleteFromDiff: () => void;
    deleteFromDiffTimeout: () => void;
    updateCache: (values: string[]) => void;
}

export const useTableDiff = ({
    timeout = 3000,
    key,
}: UseTableDiffProps): UseTableDiffResult => {
    const [diff, setDiff] = useState({ key, values: new Set<string>() });
    const cache = useRef<string[]>([]);
    const timeoutRef = useRef<number>();
    const deleteFromDiff = useCallback(() => {
        const values = cache.current;
        if (!values || !Array.isArray(values)) return;
        setDiff((prevState) => {
            const newValues = new Set(prevState?.values);
            values.forEach((val) => {
                newValues.delete(val);
            });
            const newState = { key: prevState?.key, values: newValues };
            return isEqual(newState, prevState) ? prevState : newState;
        });
    }, []);
    const updateDiff = useCallback((values: string[]) => {
        if (!values || !Array.isArray(values)) return;
        setDiff((prevState) => {
            const newValues = new Set(prevState?.values);
            values.forEach((value) => {
                newValues.add(value);
            });
            const newState = { key: prevState?.key, values: newValues };
            return isEqual(newState, prevState) ? prevState : newState;
        });
    }, []);
    const resetCache = useCallback(() => {
        deleteFromDiff?.();
        cache.current = [];
    }, [deleteFromDiff]);
    const deleteFromDiffTimeout = useCallback(() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            deleteFromDiff?.();
        }, timeout);
    }, [deleteFromDiff, timeout]);
    useMount(() => {
        return () => {
            resetCache();
            clearTimeout(timeoutRef.current);
        };
    });
    const updateCache = useCallback((data) => {
        cache.current = cloneDeep(data);
    }, []);
    return {
        diff,
        updateDiff,
        deleteFromDiff,
        deleteFromDiffTimeout,
        updateCache,
    };
};
