import React, {
    memo, FC, useCallback, useMemo, useContext,
} from 'react';
import { useMount } from 'react-use';
import toastr from '@/services/Toastr/toastr';
import { Box, ListAdderView, ProgressBar } from '@/uikit';
import { TooltipLink } from '@/common/components/TooltipLink';
import { WalletContext } from '@/common/context';
import { Item } from '@/uikit/types';
import { Info } from '@/uikit/ListAdder/ListAdderView/types';
import { Process, Status } from '@/connectors/orders';
import { ProcessModalProps } from './types';
import classes from './ProcessModal.module.scss';
import { useWorkflow } from '../hooks/useWorkflow';
import { ProcessItem } from './ProcessItem';

export const ProcessModal: FC<ProcessModalProps> = memo(({ formValues }) => {
    const { selectedAddress, instance } = useContext(WalletContext);
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
    } = useMemo(() => formValues, [formValues]);
    const init = useCallback(async () => {
        try {
            await runWorkflow({
                formValues,
                actionAccountAddress: selectedAddress,
                web3: instance,
                changeState: changeStateProcess,
            });
        } catch (e) {
            toastr.error(e);
        }
    }, [formValues, selectedAddress, instance, runWorkflow, changeStateProcess]);
    useMount(() => {
        init();
    });
    return (
        <Box direction="column" className={classes.wrap}>
            <ProgressBar progress={progress} />
            <Box className={classes.body} direction="column">
                <div className={classes.mrb}>Please do not reload or close window until all suborders created</div>
                <button onClick={() => changeStateProcess(Process.TEE, Status.IN_PROGRESS)}>tee in progress</button>
                <button onClick={() => changeStateProcess(Process.TEE, Status.CREATED)}>tee created</button>
                {!!tee && (
                    <ProcessItem name={(tee as any)?.name} className={classes.mrb} status={stateProcess[Process.TEE]} />
                )}
                {!!solution && (
                    <ProcessItem name={(solution as any)?.name} className={classes.mrb} status={stateProcess[Process.SOLUTION]} />
                )}
                {!!storage && (
                    <ProcessItem name={(storage as any)?.name} className={classes.mrb} status={stateProcess[Process.STORAGE]} />
                )}
                {!!data && (
                    <ProcessItem name={(data as any)?.name} className={classes.mrb} status={stateProcess[Process.DATA]} />
                )}
            </Box>
        </Box>
    );
});
