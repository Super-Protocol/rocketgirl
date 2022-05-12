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

export const LazyLoadCheckboxList: FC<LazyLoadCheckboxListProps> = memo(({ // todo
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
        return (
            <Box direction="column" className={classes.listWrap}>
                {options.map((option) => {
                    const { value, label, data } = option;
                    return (
                        <Box key={value as string} className={classes.option}>
                            <Box className={classes.check}>
                                <CheckboxUi
                                    label={label}
                                    onChange={(checked) => onChange(value, checked)}
                                    checked={isMulti ? ((values || []) as Value[]).includes(value) : value === values}
                                />
                            </Box>
                            <LazyLoadCheckboxListDescription classNameWrap={classes.description} value={data?.description} />
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
