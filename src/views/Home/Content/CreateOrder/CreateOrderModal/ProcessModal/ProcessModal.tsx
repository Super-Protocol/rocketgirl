import React, {
    memo, FC, useCallback, useMemo, useContext, useEffect, useRef,
} from 'react';
import { useMount } from 'react-use';
import { Box, Button, ProgressBar } from '@/uikit';
import { ModalOkCancelContext, WalletContext } from '@/common/context';
import { Process } from '@/connectors/orders';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { ProcessModalProps } from './types';
import classes from './ProcessModal.module.scss';
import { useWorkflow } from '../hooks/useWorkflow';
import { ProcessItem } from '../ProcessItem';
import { State } from '../hooks/useWorkflowProcess';
import { CancellingModal } from '../CancellingModal';

export const ProcessModal: FC<ProcessModalProps> = memo(({ formValues, createProcessModal, initialState }) => {
    const { selectedAddress, instance } = useContext(WalletContext);
    const refStateProcess = useRef<State>();
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const { showModal } = useContext(ModalOkCancelContext);
    const createCancellingModal = useCallback((state?: State) => {
        showModal({
            components: {
                main: <CancellingModal state={state} />,
            },
            classNameBody: classes.cancellingBody,
        });
    }, [showModal]);
    const {
        runWorkflow,
        progress,
        stateProcess,
    } = useWorkflow(initialState);
    const {
        tee,
        solution,
        storage,
        data,
        file,
    } = useMemo(() => formValues, [formValues]);
    const executeWorkflow = useCallback(async (state?: State) => {
        await runWorkflow({
            formValues,
            actionAccountAddress: selectedAddress,
            web3: instance,
            state,
        });
    }, [instance, formValues, selectedAddress, runWorkflow]);
    const init = useCallback(async (state?: State) => {
        try {
            await executeWorkflow(state);
            showSuccessModal('Your order has been successfully created');
        } catch (e) {
            console.log('e', e);
            // showErrorModal(
            //     e,
            //     {
            //         components: {
            //             footer: (
            //                 <Box justifyContent="center" className={classes.btns}>
            //                     {Object.values(refStateProcess.current || {})?.some(({ result }) => result) && (
            //                         <Button
            //                             className={classes.btnCancel}
            //                             onClick={() => createCancellingModal(refStateProcess.current)}
            //                             variant="secondary"
            //                         >
            //                             Cancel order
            //                         </Button>
            //                     )}
            //                     <Button
            //                         variant="primary"
            //                         onClick={() => createProcessModal(formValues, refStateProcess.current)}
            //                     >
            //                         Try again
            //                     </Button>
            //                 </Box>
            //             ),
            //         },
            //     },
            // );
        }
    }, [showSuccessModal, showErrorModal, executeWorkflow, createProcessModal, formValues, createCancellingModal]);
    useMount(() => {
        init(initialState);
    });

    useEffect(() => {
        refStateProcess.current = { ...stateProcess };
    }, [stateProcess]);

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
                        // error={stateProcess[Process.FILE]?.error}
                    />
                )}
                {!!tee && (
                    <ProcessItem
                        name="Tee order"
                        className={classes.mrb}
                        status={stateProcess[Process.TEE]?.status}
                        // error={stateProcess[Process.TEE]?.error}
                    />
                )}
                {!!solution && (
                    <ProcessItem
                        name="Solution order"
                        className={classes.mrb}
                        status={stateProcess[Process.SOLUTION]?.status}
                       //  error={stateProcess[Process.SOLUTION]?.error}
                    />
                )}
                {!!storage && (
                    <ProcessItem
                        name="Storage order"
                        className={classes.mrb}
                        status={stateProcess[Process.STORAGE]?.status}
                        // error={stateProcess[Process.STORAGE]?.error}
                    />
                )}
                {!!data && (
                    <ProcessItem
                        name="Data order"
                        className={classes.mrb}
                        status={stateProcess[Process.DATA]?.status}
                        // error={stateProcess[Process.DATA]?.error}
                    />
                )}
                <ProcessItem
                    name="Tee order start"
                    className={classes.mrb}
                    status={stateProcess[Process.ORDER_START]?.status}
                    // error={stateProcess[Process.ORDER_START]?.error}
                />
                <Box justifyContent="center" className={classes.btns}>
                    {Object.values(refStateProcess.current || {})?.some(({ result }) => result) && (
                        <Button
                            className={classes.btnCancel}
                            onClick={() => createCancellingModal(refStateProcess.current)}
                            variant="secondary"
                        >
                            Cancel order
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        onClick={() => executeWorkflow(refStateProcess.current)}
                    >
                        Try again
                    </Button>
                </Box>
            </Box>
        </Box>
    );
});
