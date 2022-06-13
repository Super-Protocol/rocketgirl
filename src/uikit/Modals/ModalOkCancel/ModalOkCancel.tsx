import {
    FC, memo, useCallback, useEffect, useState, useContext, useRef,
} from 'react';
import { Modal } from 'react-bootstrap';
import cn from 'classnames';
import overlayscrollbars from 'overlayscrollbars';
import { v1 as uuid } from 'uuid';

import { ScrollbarContext } from '@/common/context';
import { overlayScrollbarOptions } from '@/uikit/CustomScrollbar';
import { Button } from '@/uikit';
import classes from './ModalOkCancel.module.scss';
import { ModalOkCancelProps } from './types';

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const ModalOkCancel: FC<ModalOkCancelProps> = memo(({
    show: showProps,
    onClose = () => {},
    onCancel = () => {},
    onContinue = () => {},
    classNameTitle,
    classNameHeader,
    classNameWrap,
    messages,
    children,
    components,
    showMuarScrollbar = false,
}) => {
    const { instance } = useContext(ScrollbarContext);
    const [isFormShow, setIsFormShow] = useState(false);
    const [show, setShow] = useState(showProps);
    const [id] = useState(uuid());
    const onShow = useCallback(() => {
        setIsFormShow(true);
    }, []);
    const refModal = useRef(null);

    useEffect(() => {
        if (isFormShow && showMuarScrollbar) {
            const overlayInstance = overlayscrollbars(document.getElementById(id)?.parentNode, overlayScrollbarOptions);
            if (instance) {
                instance.sleep();
            }
            setTimeout(() => {
                const osContentElm = overlayInstance.getElements().content;
                osContentElm.prepend((refModal.current as any)?._modal?.backdrop);
            }, 1);
        }
    }, [isFormShow, instance, showMuarScrollbar, id, refModal]);

    const onExited = useCallback(() => {
        if (instance && showMuarScrollbar) {
            instance.update();
        }
        setIsFormShow(false);
    }, [instance, showMuarScrollbar]);

    useEffect(() => {
        if (show && !showProps && showMuarScrollbar) {
            const dialog = (refModal.current as any)?._modal?.dialog;
            const backdrop = (refModal.current as any)?._modal?.backdrop;
            dialog.parentNode.append(dialog, backdrop);
        }
        setShow(showProps);
    }, [showProps, show, refModal, showMuarScrollbar]);

    return (
        <Modal
            show={show}
            onHide={onClose}
            onExited={onExited}
            id={id}
            size="lg"
            dialogClassName={cn(classes.root, classNameWrap)}
            centered
            backdropClassName={cn(classes.backdrop, { [classes['backdrop-zindex']]: showMuarScrollbar })}
            contentClassName={classes.content}
            onShow={onShow}
            ref={refModal}
        >
            <Modal.Body className={classes.body}>
                {components?.main || (
                    <>
                        {components?.header || (
                            !!messages?.header && (
                                <div className={cn(classes.header, classNameHeader)}>
                                    {messages.header}
                                </div>
                            )
                        )}
                        <div className={classes.main}>
                            {children || messages?.title?.map((message, index) => (
                                <div className={cn(classes.title, classNameTitle)} key={index}>{message}</div>
                            ))}
                        </div>
                        {components?.footer || (
                            (!!messages?.cancel || !!messages?.ok) && (
                                <div className={classes.bottom}>
                                    {!!messages?.cancel && (
                                        <Button
                                            onClick={onCancel}
                                            variant="secondary"
                                            className={cn(classes.btn, classes.btnCancel)}
                                        >
                                            {messages.cancel}
                                        </Button>
                                    )}
                                    {!!messages?.ok && (
                                        <Button onClick={onContinue} className={classes.btn} variant="primary">
                                            {messages.ok}
                                        </Button>
                                    )}
                                </div>
                            )
                        )}
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
});
