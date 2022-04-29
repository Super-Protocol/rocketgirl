import { FC, memo } from 'react';
import { Modal } from 'react-bootstrap';
import cn from 'classnames';
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
    messages,
    children,
    components,
}) => {
    return (
        <Modal show={show} onHide={onClose} size="lg" dialogClassName={classes.root} centered>
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
                                            variant="transparent-black"
                                            className={cn(classes.btn, classes.btnCancel)}
                                        >
                                            {messages.cancel}
                                        </Button>
                                    )}
                                    {!!messages?.ok && (
                                        <Button onClick={onContinue} className={classes.btn} variant="red">
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
