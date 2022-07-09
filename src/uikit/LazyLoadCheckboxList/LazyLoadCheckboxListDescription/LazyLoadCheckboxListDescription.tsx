import React, {
    memo,
    FC,
    useMemo,
    useState,
    useCallback,
} from 'react';
import cn from 'classnames';
import { Box, HtmlBox } from '@/uikit';
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
    const strBox = useMemo(() => (
        <HtmlBox text={isLimit ? isShow ? str : strLimited : str} />
    ), [isLimit, isShow, str, strLimited]);
    return (
        <Box className={classesProps?.wrap} direction="column">
            {isLimit ? (
                <>
                    {strBox}
                    <Box>
                        <span onClick={onPress} className={cn(classes.toggle, classesProps?.toggle)}>
                            {isShow ? 'Hide' : 'Read all'}
                        </span>
                    </Box>
                </>
            ) : strBox}
        </Box>
    );
});
