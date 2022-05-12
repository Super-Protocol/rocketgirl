import React, {
    memo,
    FC,
    useMemo,
    useState,
    useCallback,
} from 'react';
import cn from 'classnames';
import { Box } from '@/uikit';
import { LazyLoadCheckboxListDescriptionProps } from './types';
import { LIMIT_CHAR, getCheckedStr } from './helpers';
import classes from './LazyLoadCheckboxListDescription.module.scss';

export const LazyLoadCheckboxListDescription: FC<LazyLoadCheckboxListDescriptionProps> = memo(({
    classes: classesProps,
    value,
}) => {
    const { isLimit, strLimited, str } = useMemo(() => getCheckedStr(value, LIMIT_CHAR), [value]);
    const [isShow, setIsShow] = useState(false);
    const onPress = useCallback((e) => {
        e.stopPropagation();
        setIsShow(!isShow);
    }, [isShow]);
    return (
        <Box className={classesProps?.wrap} direction="column">
            {isLimit ? (
                <>
                    {isShow ? str : strLimited}
                    <Box>
                        <span onClick={onPress} className={cn(classes.toggle, classesProps?.toggle)}>
                            {isShow ? 'Hide' : 'Read all'}
                        </span>
                    </Box>
                </>
            ) : str}
        </Box>
    );
});
