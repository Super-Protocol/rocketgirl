import {
    useCallback, useState, useMemo, createContext, memo,
} from 'react';
import { v4 as uuid } from 'uuid';
import { ModalOkCancel } from '@/uikit';
import { ModalOkCancelProps } from '@/uikit/Modals/ModalOkCancel/types';
import { ModalOkCancelContextProps, ModalOkCancelProviderProps, ModalOkCancelProviderResult } from './types';

export const ModalOkCancelContext = createContext<ModalOkCancelContextProps>({
    showModal: () => {},
    onClose: () => {},
    goBack: () => {},
    goNext: () => {},
});

export const ModalOkCancelProvider = memo(({ children }: ModalOkCancelProviderProps): ModalOkCancelProviderResult => {
    const [active, setActive] = useState<string | null>(null);
    const [history, setHistory] = useState<{ id: string, props: ModalOkCancelProps }[]>([]);
    const activeModal = useMemo(() => (active ? history.find(({ id }) => id === active) : null), [active, history]);
    const goBack = useCallback(async (count) => {
        const newHistory = history.slice(0, history.length - ((typeof count === 'number' ? count : 0) + 1));
        setHistory(newHistory);
        setActive(newHistory?.length ? newHistory[newHistory.length - 1]?.id : null);
    }, [history]);

    const goNext = useCallback(async (params: ModalOkCancelProps) => {
        const newId = uuid();
        setHistory((h) => h.concat({ id: newId, props: params }));
        setActive(newId);
    }, []);

    const reset = useCallback(() => {
        setHistory([]);
        setActive(null);
    }, []);

    const onClose = useCallback(() => {
        reset();
        activeModal?.props?.onClose?.();
    }, [reset, activeModal]);

    const showModal = useCallback((modalProps: ModalOkCancelProps) => {
        const newId = uuid();
        setHistory(modalProps ? [{ id: newId, props: modalProps }] : []);
        setActive(newId);
    }, []);

    const value = useMemo(() => ({
        showModal,
        goBack,
        goNext,
        reset,
        onClose,
    }), [showModal, onClose, reset, goNext, goBack]);

    const onCancel = useCallback(() => {
        onClose();
        activeModal?.props?.onCancel?.();
    }, [onClose, activeModal]);

    const onContinue = useCallback(() => {
        onClose();
        activeModal?.props?.onContinue?.();
    }, [onClose, activeModal]);

    const props = useMemo(() => ({
        ...activeModal?.props,
        onClose,
        onCancel,
        onContinue,
        show: !!activeModal,
    }), [activeModal, onClose, onCancel, onContinue]);

    return (
        <ModalOkCancelContext.Provider value={value}>
            <ModalOkCancel {...props} />
            {children}
        </ModalOkCancelContext.Provider>
    );
});

export const ModalOkCancelContextConsumer = ModalOkCancelContext.Consumer;
