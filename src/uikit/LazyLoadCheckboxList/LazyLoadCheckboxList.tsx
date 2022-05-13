import React, {
    memo,
    FC,
    useCallback,
    useMemo,
} from 'react';
import { Box, LazyLoadList, CheckboxUi } from '@/uikit';
import { Value } from '@/uikit/Select/types';
import { RenderListProps } from '@/uikit/LazyLoadList/types';
import { LazyLoadCheckboxListFetcherData, LazyLoadCheckboxListProps } from './types';
import classes from './LazyLoadCheckboxList.module.scss';
import { LazyLoadCheckboxListDescription } from './LazyLoadCheckboxListDescription';
import { lazyLoadCheckboxListDescriptionClasses } from './helpers';

export const LazyLoadCheckboxList: FC<LazyLoadCheckboxListProps> = memo(({
    fetcher,
    isMulti = false,
    values,
    onChange: onChangeProp,
}) => {
    const onChange = useCallback((value: Value, checked: boolean) => {
        if (isMulti) {
            onChangeProp?.(
                checked
                    ? [...new Set([...(values || []) as Value[], value])]
                    : ((values || []) as Value[]).filter((v) => v !== value),
            );
        } else {
            onChangeProp?.(checked ? value : undefined);
        }
    }, [values, onChangeProp, isMulti]);
    const renderList = useCallback(({ options }: RenderListProps<LazyLoadCheckboxListFetcherData>) => {
        if (!options?.length) return null;
        return (
            <Box direction="column" className={classes.listWrap}>
                {options.map((option) => {
                    const { value, label, data } = option;
                    const checked = isMulti ? ((values || []) as Value[]).includes(value) : value === values;
                    return (
                        <Box
                            key={value as string}
                            className={classes.option}
                            alignItems="flex-start"
                            onClick={() => onChange(value, !checked)}
                        >
                            <Box className={classes.check}>
                                {isMulti ? (
                                    <CheckboxUi
                                        label={label}
                                        checked={checked}
                                        onChange={(checked, e) => {
                                            e.preventDefault();
                                            onChange(value, !checked);
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
        />
    );
});
