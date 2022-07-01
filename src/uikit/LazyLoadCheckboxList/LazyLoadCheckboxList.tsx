import React, {
    memo,
    FC,
    useCallback,
    useMemo,
} from 'react';
import uniqby from 'lodash.uniqby';
import { Box, LazyLoadList, CheckboxUi } from '@/uikit';
import { RenderListProps } from '@/uikit/LazyLoadList/types';
import { LazyLoadCheckboxListFetcherData, LazyLoadCheckboxListProps, Item } from './types';
import classes from './LazyLoadCheckboxList.module.scss';
import { LazyLoadCheckboxListDescription } from './LazyLoadCheckboxListDescription';
import { lazyLoadCheckboxListDescriptionClasses } from './helpers';

type Info = any; // todo

export const LazyLoadCheckboxList: FC<LazyLoadCheckboxListProps<Info>> = memo(({
    fetcher,
    isMulti = false,
    values,
    onChange: onChangeProp,
    onError,
}) => {
    const onChange = useCallback((newItem: Item<Info>, checked: boolean) => {
        if (isMulti) {
            onChangeProp?.(
                checked
                    ? uniqby([...(values || []) as Item<Info>[], newItem], 'value')
                    : ((values || []) as Item<Info>[]).filter((item) => item?.value !== newItem?.value),
            );
        } else {
            onChangeProp?.(checked ? newItem as Item<Info> : undefined);
        }
    }, [values, onChangeProp, isMulti]);
    const renderList = useCallback(({ options }: RenderListProps<LazyLoadCheckboxListFetcherData>) => {
        if (!options?.length) return null;
        return (
            <Box direction="column" className={classes.listWrap}>
                {options.map((option) => {
                    const { value, label, data } = option;
                    const checked = isMulti
                        ? ((values || []) as Item<Info>[]).some((option) => option?.value === value)
                        : value === (values as Item<Info>)?.value;
                    return (
                        <Box
                            key={value as string}
                            className={classes.option}
                            alignItems="flex-start"
                            onClick={() => onChange({ value, data }, !checked)}
                        >
                            <Box className={classes.check}>
                                {isMulti ? (
                                    <CheckboxUi
                                        label={label}
                                        checked={checked}
                                        onChange={(checked, e) => {
                                            e.preventDefault();
                                            onChange({ value, data }, !checked);
                                        }}
                                    />
                                ) : label}
                            </Box>
                            <LazyLoadCheckboxListDescription
                                classes={lazyLoadCheckboxListDescriptionClasses}
                                value={data?.description}
                            />
                        </Box>
                    );
                })}
            </Box>
        );
    }, [values, isMulti, onChange]);
    return (
        <LazyLoadList <LazyLoadCheckboxListFetcherData>
            fetcher={fetcher}
            renderList={renderList}
            classes={useMemo(() => ({ wrap: classes.wrap }), [])}
            onError={onError}
        />
    );
});
