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
    history: [],
});

export const ModalOkCancelProvider = memo(({ children }: ModalOkCancelProviderProps): ModalOkCancelProviderResult => {
    const [active, setActive] = useState<string | null>(null);
    const [showMuarScrollbar, setShowMuarScrollbar] = useState(false);
    const [history, setHistory] = useState<{ id: string, props: ModalOkCancelProps }[]>([]);
    const activeModal = useMemo(() => (active ? history.find(({ id }) => id === active) : null), [active, history]);
    const goBack = useCallback(async ({ count, props } = {}) => {
        const newHistory = history.slice(0, history.length - ((typeof count === 'number' ? count : 0) + 1));
        setHistory(
            props
                ? newHistory.map((history) => ({
                    ...history,
                    props: {
                        ...history.props,
                        children: {
                            ...(history.props.children || {}),
                            props: {
                                ...(history.props.children as { props: {} })?.props || {},
                                ...props,
                            },
                        },
                    },
                }))
                : newHistory,
        );
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
        setShowMuarScrollbar(modalProps?.showMuarScrollbar || false);
    }, []);

    const value = useMemo(() => ({
        showModal,
        goBack,
        goNext,
        reset,
        onClose,
        history,
    }), [showModal, onClose, reset, goNext, goBack, history]);

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
        history,
        showMuarScrollbar,
    }), [activeModal, onClose, onCancel, onContinue, history, showMuarScrollbar]);

    return (
        <ModalOkCancelContext.Provider value={value}>
            <ModalOkCancel {...props} />
            {children}
        </ModalOkCancelContext.Provider>
    );
});

export const ModalOkCancelContextConsumer = ModalOkCancelContext.Consumer;
