import React, {
    memo,
    FC,
    useContext, useCallback,
} from 'react';
import { useMount } from 'react-use';
import { useHistory } from 'react-router-dom';
import { ModalOkCancelContext } from '@/common/context';
import { AUTH_TOKEN } from '@/common/constants';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import { LoginProps } from './types';
import { AccessTokenModal } from './AccessTokenModal';

const Login: FC<LoginProps> = () => {
    const history = useHistory();
    const [, setToken] = useLocalStorage<string>(AUTH_TOKEN, undefined);
    const { showModal, onClose } = useContext(ModalOkCancelContext);
    const onSuccess = useCallback((token) => {
        setToken(token);
        history.replace('');
        onClose();
    }, [onClose, history, setToken]);
    useMount(() => {
        showModal({
            children: <AccessTokenModal onSuccess={onSuccess} />,
            messages: {
                header: 'Access token',
            },
            backdrop: 'static',
        });
    });
    return null;
};

export default memo(Login);
