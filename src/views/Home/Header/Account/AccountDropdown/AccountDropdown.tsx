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
        selectedWallet,
    } = useContext(WalletContext);
    const address = useMemo(() => selectedWallet?.address, [selectedWallet]);
    const list = useMemo(() => (
        address
            ? [{ value: address, label: address, title: 'Connected with MetaMask' }]
            : []
    ), [address]);
    const renderItemLabel = useCallback((item) => {
        const { label, title } = item || {};
        return <AccountDropdownItemChildren label={label} title={title} />;
    }, []);

    return (
        <Dropdown
            active={address}
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
