import { ReactElement, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, Header as HeaderUIKit } from '@/uikit';
import { Account } from '@/views/Home/Header/Account';

export const Header = (): ReactElement => {
    const history = useHistory();
    const onClick = useCallback(() => {
        history.push('/');
    }, [history]);

    return (
        <HeaderUIKit>
            <Button
                variant="grey-light"
                onClick={onClick}
            >
                Back
            </Button>
            <Account />
        </HeaderUIKit>
    );
};
