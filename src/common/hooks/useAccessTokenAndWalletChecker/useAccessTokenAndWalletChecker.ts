import {
    useContext,
    useMemo,
    useCallback,
    useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalOkCancelContext, WalletContext } from '@/common/context';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import { AUTH_TOKEN } from '@/common/constants';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { parseJwt } from '@/common/helpers';
import classes from './useAccessTokenAndWalletChecker.module.scss';

export const useAccessTokenAndWalletChecker = (): void => {
    const { onClose } = useContext(ModalOkCancelContext);
    const navigate = useNavigate();
    const { selectedAddress } = useContext(WalletContext);
    const { showErrorModal } = useErrorModal();
    const [token] = useLocalStorage<string>(AUTH_TOKEN, undefined);
    const onContinue = useCallback(() => {
        navigate('/login');
    }, [navigate]);
    const addressFromToken = useMemo(() => parseJwt<{ address: string }>(token)?.address, [token]);
    const invalid = useMemo(
        () => selectedAddress && addressFromToken && selectedAddress !== addressFromToken,
        [selectedAddress, addressFromToken],
    );
    const showModal = useCallback(() => {
        showErrorModal(
            // eslint-disable-next-line max-len
            new Error(`Access token connected to account ${addressFromToken}, please connect this account or use another access token.`),
            {
                classNameMain: classes.body,
                onContinue,
                backdrop: 'static',
                messages: {
                    ok: 'Enter token',
                },
                classNameBottom: classes.bottom,
            },
        );
    }, [showErrorModal, onContinue, addressFromToken]);

    useEffect(() => {
        if (invalid) {
            showModal();
        } else {
            onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invalid]);
};
