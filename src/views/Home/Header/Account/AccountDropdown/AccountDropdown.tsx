import React, {
    memo, FC, useMemo, useCallback, useContext,
} from 'react';
import { Dropdown } from '@/uikit';
import { WalletContext } from '@/common/context/WalletProvider';
import { AccountDropdownItem } from './AccountDropdownItem';
import { AccountDropdownItemChildren } from './AccountDropdownItemChildren';
import { AccountDropdownHeader } from './AccountDropdownHeader';
import { AccountDropdownProps } from './types';
import classes from './AccountDropdown.module.scss';

export const AccountDropdown: FC<AccountDropdownProps> = memo(() => {
    const {
        loading,
        selectedAddress,
    } = useContext(WalletContext);
    const list = useMemo(() => (
        selectedAddress
            ? [{ value: selectedAddress, label: selectedAddress, title: 'Connected with MetaMask' }]
            : []
    ), [selectedAddress]);
    const renderItemLabel = useCallback((item) => {
        const { label, title } = item || {};
        return <AccountDropdownItemChildren label={label} title={title} />;
    }, []);

    return (
        <Dropdown
            active={selectedAddress}
            list={list}
            classNameWrap={classes.wrap}
            classNameDropdownMenu={classes.dropdownMenu}
            loading={loading}
            DropdownItemComponent={AccountDropdownItem}
            renderItemLabel={renderItemLabel}
            header={<AccountDropdownHeader />}
        />
    );
});
