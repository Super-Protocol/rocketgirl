import React, {
    memo,
    FC,
    useCallback,
    useState, useMemo, useContext,
} from 'react';
import { Formik } from 'formik';
import cn from 'classnames';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { Box, Button, InputFormik } from '@/uikit';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { replenishOrder } from '@/connectors/orders';
import { WalletContext } from '@/common/context/WalletProvider';
import { FormValues, ReplenishOrderModalProps } from './types';
import { initialValues, getValidationSchema } from './helpers';
import classes from './ReplenishOrderModal.module.scss';

export const ReplenishOrderModal: FC<ReplenishOrderModalProps> = memo(({ orderAddress, onSuccess }) => {
    const { selectedAddress, instance } = useContext(WalletContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const { onClose } = useContext(ModalOkCancelContext);
    const [loading, setLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const validationSchema = useMemo(() => getValidationSchema(), []);

    const onSubmit = useCallback(async (values: FormValues) => {
        setLoading(true);
        try {
            const { amount } = values || {};
            await replenishOrder({
                orderAddress,
                amount,
                instance,
                accountAddress: selectedAddress,
            });
            onClose();
            showSuccessModal('Order successfully replenished');
            onSuccess();
        } catch (e) {
            showErrorModal(e);
        }
        setLoading(false);
    }, [showSuccessModal, showErrorModal, onClose, orderAddress, instance, selectedAddress, onSuccess]);

    const onReplenish = useCallback((submitForm) => () => {
        setIsValidating(true);
        submitForm();
    }, []);

    const onCancel = useCallback(() => {
        onClose();
    }, [onClose]);

    return (
        <Formik
            validateOnChange={isValidating}
            validateOnBlur={isValidating}
            initialValues={initialValues}
            onSubmit={onSubmit}
            enableReinitialize
            validationSchema={validationSchema}
        >
            {({ submitForm }) => {
                return (
                    <Box direction="column">
                        <InputFormik name="amount" label="Amount" checkTouched={!isValidating} disabled={loading} />
                        <Box justifyContent="flex-end">
                            <Button
                                loading={loading}
                                onClick={onCancel}
                                variant="secondary"
                                className={cn(classes.btn, classes.btnCancel)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onReplenish(submitForm)}
                                className={classes.btn}
                                variant="primary"
                                loading={loading}
                            >
                                Replenish
                            </Button>
                        </Box>
                    </Box>
                );
            }}
        </Formik>
    );
});
