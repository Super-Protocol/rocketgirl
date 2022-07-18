import React, {
    memo, FC, useMemo, useCallback, useContext,
} from 'react';
import { Dropdown } from '@/uikit';
import { sliceWithDot } from '@/common/helpers';
import { WalletContext } from '@/common/context/WalletProvider';
import { AccountDropdownItem } from './AccountDropdownItem';
import { AccountDropdownItemChildren } from './AccountDropdownItemChildren';
import { AccountDropdownHeader } from './AccountDropdownHeader';
import { AccountDropdownFooter } from './AccountDropdownFooter';
import { AccountDropdownProps } from './types';
import classes from './AccountDropdown.module.scss';

export const AccountDropdown: FC<AccountDropdownProps> = memo(() => {
    const {
        loading,
        selectedAddress,
    } = useContext(WalletContext);
    const list = useMemo(() => (
        selectedAddress
            ? [{ value: selectedAddress, label: sliceWithDot(selectedAddress), title: 'Connected with MetaMask' }]
            : []
    ), [selectedAddress]);
    const renderItemLabel = useCallback((item) => {
        const { label, title, value } = item || {};
        return <AccountDropdownItemChildren label={label} title={title} value={value} />;
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
            footer={<AccountDropdownFooter />}
        />
    );
});
