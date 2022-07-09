import {
    FC, memo, useState, useContext, useEffect,
} from 'react';
import { Modal } from 'react-bootstrap';
import cn from 'classnames';

import { useIsMounted } from '@/common/hooks/useIsMounted';
import { ScrollbarContext } from '@/common/context';
import { Button } from '@/uikit';
import classes from './ModalOkCancel.module.scss';
import { ModalOkCancelProps } from './types';

export const ModalOkCancel: FC<ModalOkCancelProps> = memo(({
    show: showProps,
    onClose = () => {},
    onCancel = () => {},
    onContinue = () => {},
    classNameTitle,
    classNameHeader,
    classNameWrap,
    classNameBody,
    classNameBottom,
    messages,
    children,
    components,
    showMuarScrollbar = false,
}) => {
    const { instance } = useContext(ScrollbarContext);
    const [show, setShow] = useState(showProps);
    const isMounted = useIsMounted();

    useEffect(() => {
        if (showMuarScrollbar) {
            if (show && !showProps) {
                if (instance) {
                    instance.update();
                }
            }
            if (!show && showProps) {
                if (instance) {
                    instance.sleep();
                }
            }
        }
        if (isMounted()) {
            setShow(showProps);
        }
    }, [showProps, show, instance, showMuarScrollbar, isMounted]);

    return (
        <Modal
            show={show}
            onHide={onClose}
            size="lg"
            dialogClassName={cn(classes.root, classNameWrap)}
            centered
            backdropClassName={classes.backdrop}
            contentClassName={classes.content}
        >
            <Modal.Body className={cn(classes.body, classNameBody)}>
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
                                <div className={cn(classes.bottom, classNameBottom)}>
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
