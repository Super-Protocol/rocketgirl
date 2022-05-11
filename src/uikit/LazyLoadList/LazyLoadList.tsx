import React, {
    memo,
    FC,
    useState,
    useCallback,
    useRef,
} from 'react';
import cn from 'classnames';
import { useLazyLoad, Box, Spinner } from '@/uikit';
import { Item } from '@/uikit/Select/types';
import { LazyLoadListProps } from './types';
import classes from './LazyLoadList.module.scss';

export const LazyLoadList: FC<LazyLoadListProps> = memo(({ fetcher, renderList }) => {
    const triggerRef = useRef(null);
    const [options, setOptions] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const cursor = useRef<string | null | undefined>();
    const refetch = useCallback(async ({ cursor }) => {
        try {
            const {
                cursor: newCursor,
                options,
            } = fetcher ? await fetcher({ cursor }) : { options: [], cursor: null };
            return { cursor: newCursor, options: options || [] };
        } catch (e) {
            return { cursor: undefined, options: [] };
        }
    }, [fetcher]);
    const fetchData = useCallback(async () => {
        if (loading || cursor.current === null) return;
        setLoading(true);
        const { cursor: newCursor, options: newOptions } = await refetch({ cursor: cursor.current });
        cursor.current = newCursor;
        setOptions((options) => options.concat(newOptions));
        setLoading(false);
    }, [refetch, loading]);
    useLazyLoad({
        fetchData,
        triggerRef,
    });

    return (
        <Box direction="column" className={classes.wrap}>
            {loading && (
                <Spinner fullscreen />
            )}
            {renderList({ options, loading })}
            <div ref={triggerRef} className={cn(classes.trigger)} />
        </Box>
    );
});
