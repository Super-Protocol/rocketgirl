import React, {
    memo, FC, useMemo, useState,
} from 'react';
import { Formik } from 'formik';
import { FilterContextProps } from './types';
import { getFilters, getInitialValues, getValidationSchema } from './helpers';
import { FilterContextProvider } from './context';

export const FilterContext: FC<FilterContextProps> = memo(({ children, table, onSubmit }) => {
    const [open, setOpen] = useState(false);
    const filters = useMemo(() => getFilters(table), [table]);
    const initialValues = useMemo(() => getInitialValues(filters), [filters]);
    const validationSchema = useMemo(() => getValidationSchema(), []);
    const filterContextValue = useMemo(() => ({ open, setOpen, filters }), [setOpen, open, filters]);
    if (!filters.length) return <>{children}</>;
    return (
        <FilterContextProvider value={filterContextValue}>
            <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={initialValues}
                onSubmit={onSubmit}
                enableReinitialize
                validationSchema={validationSchema}
            >
                {children}
            </Formik>
        </FilterContextProvider>
    );
});
