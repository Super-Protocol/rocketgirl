import React, {
    memo,
    FC,
    useState,
    useCallback,
} from 'react';
import { Box, Button, LazyLoadCheckboxList } from '@/uikit';
import { ListAdderEditorProps } from './types';
import classes from './ListAdderEditor.module.scss';

export const ListAdderEditor: FC<ListAdderEditorProps> = memo(({
    isMulti,
    fetcher,
    onSave: onSaveProps,
    onCancel,
    values: initialValues,
    classes: classesProps,
}) => {
    const [values, setValues] = useState(initialValues);
    const onChange = useCallback((v) => setValues(v), []);
    const onSave = useCallback(() => {
        onSaveProps?.(values);
    }, [onSaveProps, values]);
    return (
        <Box direction="column" className={classesProps?.wrap}>
            <LazyLoadCheckboxList fetcher={fetcher} isMulti={isMulti} values={values} onChange={onChange} />
            <Box justifyContent="flex-end">
                <Button variant="grey-light" onClick={onCancel} className={classes.btnCancel}>Cancel</Button>
                <Button variant="orange" onClick={onSave}>Add</Button>
            </Box>
        </Box>
    );
});
