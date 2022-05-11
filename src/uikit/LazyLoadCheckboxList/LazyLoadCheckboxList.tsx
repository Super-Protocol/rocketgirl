import React, { memo, FC, useCallback } from 'react';
import { Box, LazyLoadList, CheckboxUi } from '@/uikit';
import { Value } from '@/uikit/Select/types';
import { LazyLoadCheckboxListProps } from './types';
import classes from './LazyLoadCheckboxList.module.scss';

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
    const renderList = useCallback(({ options }) => {
        return (
            <Box direction="column" className={classes.wrap}>
                {options.map((option) => {
                    const { value, label, description } = option;
                    return (
                        <Box key={value} className={classes.option}>
                            <Box className={classes.check}>
                                <CheckboxUi
                                    label={label}
                                    onChange={(checked) => onChange(value, checked)}
                                    checked={isMulti ? ((values || []) as Value[]).includes(value) : value === values}
                                />
                            </Box>
                            <Box className={classes.description}>
                                {description}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        );
    }, [values, isMulti, onChange]);
    return <LazyLoadList fetcher={fetcher} renderList={renderList} />;
});
