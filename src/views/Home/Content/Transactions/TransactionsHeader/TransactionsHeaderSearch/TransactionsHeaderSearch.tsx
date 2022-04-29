import { memo, FC } from 'react';
import { Icon, InputFormik } from '@/uikit';
import { TransactionsHeaderSearchProps } from './types';
import classes from './TransactionsHeaderSearch.module.scss';

export const TransactionsHeaderSearch: FC<TransactionsHeaderSearchProps> = memo(() => {
    return (
        <InputFormik
            name="search"
            prepend={<Icon name="search" width={14} />}
            classNameWrap={classes.wrap}
            classNameInputLabel={classes.inputLabel}
            classNameInput={classes.input}
            placeholder="Search"
            showError={false}
        />
    );
});
