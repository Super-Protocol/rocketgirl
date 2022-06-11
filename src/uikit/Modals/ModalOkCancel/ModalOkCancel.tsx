import {
    FC, memo, useCallback, useEffect, useState, useContext,
} from 'react';
import { Modal } from 'react-bootstrap';
import cn from 'classnames';
import overlayscrollbars from 'overlayscrollbars';

import { ScrollbarContext } from '@/common/context';
import { overlayScrollbarOptions } from '@/uikit/CustomScrollbar';
import { Button } from '@/uikit';
import classes from './ModalOkCancel.module.scss';
import { ModalOkCancelProps } from './types';

export const ModalOkCancel: FC<ModalOkCancelProps> = memo(({
    show,
    onClose = () => {},
    onCancel = () => {},
    onContinue = () => {},
    classNameTitle,
    classNameHeader,
    classNameWrap,
    messages,
    children,
    components,
}) => {
    const { instance } = useContext(ScrollbarContext);
    const [isFormShow, setIsFormShow] = useState(false);
    const onShow = useCallback(async () => {
        setIsFormShow(true);
    }, []);

    useEffect(() => {
        if (isFormShow) {
            overlayscrollbars(document.getElementById('modal')?.parentNode, overlayScrollbarOptions);
            if (instance) {
                instance.sleep();
            }
        }
    }, [isFormShow, instance]);

    const onExited = useCallback(() => {
        if (instance) {
            instance.update();
        }
        setIsFormShow(false);
    }, [instance]);

    return (
        <Modal
            show={show}
            onHide={onClose}
            onExited={onExited}
            id="modal"
            size="lg"
            dialogClassName={cn(classes.root, classNameWrap)}
            centered
            backdropClassName={classes.backdrop}
            contentClassName={classes.content}
            onShow={onShow}
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
