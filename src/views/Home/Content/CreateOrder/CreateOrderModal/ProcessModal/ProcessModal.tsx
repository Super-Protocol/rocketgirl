import React, {
    memo, FC, useCallback, useMemo, useContext,
} from 'react';
import { useMount } from 'react-use';
import { Box, ProgressBar } from '@/uikit';
import { WalletContext } from '@/common/context';
import { Process } from '@/connectors/orders';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { ProcessModalProps } from './types';
import classes from './ProcessModal.module.scss';
import { useWorkflow } from '../hooks/useWorkflow';
import { ProcessItem } from './ProcessItem';

export const ProcessModal: FC<ProcessModalProps> = memo(({ formValues }) => {
    const { selectedAddress, instance } = useContext(WalletContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const {
        runWorkflow,
        progress,
        stateProcess,
        changeStateProcess,
    } = useWorkflow();
    const {
        tee,
        solution,
        storage,
        data,
        file,
    } = useMemo(() => formValues, [formValues]);
    const init = useCallback(async () => {
        try {
            await runWorkflow({
                formValues,
                actionAccountAddress: selectedAddress,
                web3: instance,
                changeState: changeStateProcess,
            });
            showSuccessModal('Your order has been successfully created');
        } catch (e) {
            showErrorModal(e);
        }
    }, [formValues, selectedAddress, instance, runWorkflow, changeStateProcess, showSuccessModal, showErrorModal]);
    useMount(() => {
        init();
    });
    return (
        <Box direction="column" className={classes.wrap}>
            <ProgressBar progress={progress} />
            <Box className={classes.body} direction="column">
                <div className={classes.title}>Creating...</div>
                <div className={classes.mrb}>Please do not reload or close window until all suborders created</div>
                {!!file && (
                    <ProcessItem
                        name="File uploading"
                        className={classes.mrb}
                        status={stateProcess[Process.FILE]?.status}
                        error={stateProcess[Process.FILE]?.error}
                    />
                )}
                {!!tee && (
                    <ProcessItem
                        name="Tee order"
                        className={classes.mrb}
                        status={stateProcess[Process.TEE]?.status}
                        error={stateProcess[Process.TEE]?.error}
                    />
                )}
                {!!solution && (
                    <ProcessItem
                        name="Solution order"
                        className={classes.mrb}
                        status={stateProcess[Process.SOLUTION]?.status}
                        error={stateProcess[Process.SOLUTION]?.error}
                    />
                )}
                {!!storage && (
                    <ProcessItem
                        name="Storage order"
                        className={classes.mrb}
                        status={stateProcess[Process.STORAGE]?.status}
                        error={stateProcess[Process.STORAGE]?.error}
                    />
                )}
                {!!data && (
                    <ProcessItem
                        name="Data order"
                        className={classes.mrb}
                        status={stateProcess[Process.DATA]?.status}
                        error={stateProcess[Process.DATA]?.error}
                    />
                )}
                <ProcessItem
                    name="Tee order start"
                    className={classes.mrb}
                    status={stateProcess[Process.ORDER_START]?.status}
                    error={stateProcess[Process.ORDER_START]?.error}
                />
            </Box>
        </Box>
    );
});
