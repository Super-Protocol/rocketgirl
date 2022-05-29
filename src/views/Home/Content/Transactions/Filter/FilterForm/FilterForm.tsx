import React, {
    memo, FC, useMemo,
} from 'react';
import cn from 'classnames';
import { Formik } from 'formik';
import { useDebouncedCallback } from 'use-debounce';
import {
    Box, InputFormik, SelectFormik,
} from '@/uikit';
import { FilterFormProps } from './types';
import classes from './FilterForm.module.scss';
import { FilterMode } from '../models/types';
import {
    getFilters,
    getInitialValues,
    getValidationSchema,
} from './helpers';

export const FilterForm: FC<FilterFormProps> = memo(({ onSubmit }) => {
    const filters = useMemo(() => getFilters(), []);
    const initialValues = useMemo(() => getInitialValues(filters), [filters]);
    const validationSchema = useMemo(() => getValidationSchema(), []);
    const debouncedSubmit = useDebouncedCallback(onSubmit, 300);
    if (!filters.length) return null;
    return (
        <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={initialValues}
            onSubmit={debouncedSubmit}
            enableReinitialize
            validationSchema={validationSchema}
        >
            {({ submitForm }) => (
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
                                        classNameInput={classes.input}
                                        showError={false}
                                        onChange={submitForm}
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
                                        onChange={submitForm}
                                    />
                                );
                            default:
                                return null;
                        }
                    })}
                </Box>
            )}
        </Formik>
    );
});
