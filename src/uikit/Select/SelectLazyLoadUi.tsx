import {
    memo,
    useCallback,
    useState,
    FC,
} from 'react';
import uniqby from 'lodash.uniqby';
import { SelectUi } from '@/uikit';
import { SelectLazyLoadUiProps, Item, Value } from './types';

const LOAD_DELAY_MS = 300;

export const SelectLazyLoadUi: FC<SelectLazyLoadUiProps> = memo(({
    fetcher,
    onError,
    components: componentsProps,
    ...props
}) => {
    // for selecting active value. not the best solution :(
    const [options, setOptions] = useState<Item<Value>[]>([]);
    const refetch = useCallback(async ({ cursor, signal, search }) => {
        try {
            const {
                cursor: newCursor,
                options,
            } = fetcher ? await fetcher({ cursor, search, signal }) : { options: [], cursor: null };
            return { cursor: newCursor, options: options || [] };
        } catch (e) {
            return { cursor: undefined, options: [] };
        }
    }, [fetcher]);

    const loadOptions = useCallback(async (search, prevOptions, props) => {
        const { cursor } = props || {};
        const { options, cursor: newCursor } = await refetch({ cursor, search });
        setOptions((optionsOld) => uniqby(optionsOld?.concat(options || []), 'value')); // todo fix
        return {
            options,
            hasMore: newCursor !== null,
            additional: {
                cursor: newCursor,
            },
        };
    }, [refetch]);

    return (
        <SelectUi
            options={options}
            loadOptions={loadOptions}
            mode="async-query"
            debounceTimeout={LOAD_DELAY_MS}
            {...props}
        />
    );
});
