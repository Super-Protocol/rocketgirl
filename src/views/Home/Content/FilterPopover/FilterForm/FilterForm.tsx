import React, {
    memo, FC, useContext,
} from 'react';
import cn from 'classnames';
import { useField, useFormikContext } from 'formik';
import { useDebouncedCallback } from 'use-debounce';
import {
    Box, Button, InputFormik, SelectFormik,
} from '@/uikit';
import { FilterFormProps } from './types';
import classes from './FilterForm.module.scss';
import { FilterContext } from '../FilterContext/context';
import { FilterMode } from '../models/types';

export const FilterForm: FC<FilterFormProps> = memo(() => {
    const { resetForm, submitForm } = useFormikContext();
    const { filters } = useContext(FilterContext);
    const [,, { setValue }] = useField('values');
    const debouncedSubmit = useDebouncedCallback(submitForm, 300);
    return (
        <Box direction="row" justifyContent="space-between" className={classes.wrap} alignItems="flex-start">
            <Box direction="row" alignItems="flex-start" className={classes.filters}>
                {filters.map(({
                    name,
                    placeholder,
                    label,
                    mode,
                    options,
                }) => {
                    const path = `values.${name}.value`;
                    switch (mode) {
                        case FilterMode.regex:
                            return (
                                <InputFormik
                                    key={name}
                                    placeholder={placeholder}
                                    name={path}
                                    classNameWrap={cn(classes.block, classes.inputWrap)}
                                    classNameInputLabel={classes.inputLabel}
                                    showError={false}
                                    onChange={debouncedSubmit}
                                />
                            );
                        case FilterMode.eq:
                            return (
                                <SelectFormik
                                    key={name}
                                    name={path}
                                    placeholder={placeholder}
                                    classNameWrap={cn(classes.block, classes.selectWrap)}
                                    label={label}
                                    options={options}
                                    showError={false}
                                    onChange={() => submitForm()}
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </Box>
            <Button
                onClick={() => {
                    setValue({});
                    resetForm({});
                    submitForm();
                }}
                variant="grey-light"
                className={classes.btnClear}
            >
                Clear
            </Button>
        </Box>
    );
});
