import React, {
    memo,
    FC,
    useState,
    useCallback,
} from 'react';
import { Box, Button, LazyLoadCheckboxList } from '@/uikit';
import { ListAdderEditorProps } from './types';
import classes from './ListAdderEditor.module.scss';

type Info = any; // todo

export const ListAdderEditor: FC<ListAdderEditorProps<Info>> = memo(({
    isMulti,
    fetcher,
    onSave: onSaveProps,
    onCancel,
    values: initialValues,
    classes: classesProps,
    onError,
}) => {
    const [values, setValues] = useState(initialValues);
    const onChange = useCallback((v) => {
        if (isMulti) {
            setValues(v);
        } else {
            onSaveProps?.(v);
        }
    }, [onSaveProps, isMulti]);
    const onSave = useCallback(() => {
        onSaveProps?.(values);
    }, [onSaveProps, values]);
    return (
        <Box direction="column" className={classesProps?.wrap}>
            <LazyLoadCheckboxList
                fetcher={fetcher}
                isMulti={isMulti}
                values={values}
                onChange={onChange}
                onError={onError}
            />
            <Box justifyContent="flex-end">
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                {isMulti && <Button variant="primary" onClick={onSave} className={classes.btnSave}>Add</Button>}
            </Box>
        </Box>
    );
});
