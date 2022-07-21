import React, {
    memo,
    FC,
    useContext, useCallback,
} from 'react';
import { useMount } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { ModalOkCancelContext } from '@/common/context';
import { LoginProps } from './types';
import { AccessTokenModal } from './AccessTokenModal';

const Login: FC<LoginProps> = () => {
    const navigate = useNavigate();
    const { showModal, onClose } = useContext(ModalOkCancelContext);
    const onSuccess = useCallback(() => {
        navigate('/');
        onClose();
    }, [onClose, navigate]);
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
