import { ReactElement } from 'react';
import { Button, Header as HeaderUIKit } from '@/uikit';
import { Account } from '@/views/Home/Header/Account';
import { useNavigateBack } from '@/common/hooks/useNavigateBack';

export const Header = (): ReactElement => {
    const navigateBack = useNavigateBack();

    return (
        <HeaderUIKit>
            <Button
                variant="grey-light"
                onClick={navigateBack}
            >
                Back
            </Button>
            <Account />
        </HeaderUIKit>
    );
};
