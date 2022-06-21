import { useCallback } from 'react';
import Web3 from 'web3';
import { Modes } from '@/uikit/MnemonicGenerator/types';
import {
    workflow,
    WorkflowPropsValues,
    Process,
    Status,
} from '@/connectors/orders';
import { useFileUploader } from './useFileUploader';
import { useGenerateTII } from './useGenerateTII';
import { useEncryptFile } from './useEncryptFile';
import { FormValues } from '../types';
import { ChangeStateProps, State, useWorkflowProcess } from './useWorkflowProcess';

export interface RunWorkflowProps {
    formValues: FormValues;
    actionAccountAddress?: string;
    web3?: Web3;
    state?: State;
}

export interface UseWorkflowResult {
    runWorkflow: (props: RunWorkflowProps) => Promise<void>;
    uploading: boolean;
    generating: boolean;
    encrypting: boolean;
    progress: number;
    changeStateProcess: (props: ChangeStateProps) => void;
    stateProcess: State;
}

export const getWorkflowValues = (formValues: FormValues, mnemonic: string, tiiGeneratorId?: string): WorkflowPropsValues => {
    const {
        solution,
        data,
        tee,
        storage,
        deposit,
    } = formValues;
    return {
        mnemonic: mnemonic || '',
        solution: (
            solution?.value
                ? [{ value: solution?.value as string, externalId: solution?.data?.externalId as string }]
                : []
        )
            .concat(
                solution?.data?.sub
                    ?.map((item) => ({ value: item?.value as string, externalId: item?.data?.externalId as string }))
                    .filter(({ value }) => value) || [],
            ),
        data: data?.map((d) => ({ value: d?.value as string, externalId: d?.data?.externalId as string })),
        tee: { value: tee?.value as string, externalId: tee?.data?.externalId as string },
        storage: storage?.value ? { value: storage.value as string, externalId: storage?.data?.externalId as string } : undefined,
        deposit: deposit || 0,
        args: tiiGeneratorId ? JSON.stringify({ data: [tiiGeneratorId] }) : undefined,
    };
};

export const getProcessList = (values: FormValues): Process[] => {
    const {
        tee,
        storage,
        solution,
        data,
        file,
    } = values || {};
    return ([] as Process[])
        .concat((tee ? Process.TEE : []))
        .concat((solution ? Process.SOLUTION : []))
        .concat((storage ? Process.STORAGE : []))
        .concat((data?.length ? Process.DATA : []))
        .concat(file ? Process.FILE : [])
        .concat(Process.ORDER_START);
};

export const useWorkflow = (initState?: State): UseWorkflowResult => {
    const { uploading, uploadFile, getFilePath } = useFileUploader();
    const { generating, generateByOffer } = useGenerateTII();
    const { encrypting, encryptFile } = useEncryptFile();
    const {
        progress,
        changeState,
        state: stateProcess,
        init: initProcess,
        rerunNotDone,
    } = useWorkflowProcess(initState);
    const runWorkflow = useCallback(async (props: RunWorkflowProps) => {
        const {
            formValues,
            actionAccountAddress,
            web3,
            state,
        } = props || {};
        if (!actionAccountAddress || !web3) throw new Error('Metamask account not found');
        const {
            file,
            data,
            tee,
            phraseGenerated,
            phraseInput,
            phraseTabMode,
        } = formValues || {};
        const phrase = phraseTabMode === Modes.generate ? phraseGenerated : phraseInput;
        let tiiGeneratorId;
        if (!phrase) throw new Error('Seed phrase required');
        if (!Object.keys(stateProcess).length) {
            initProcess(getProcessList(formValues));
        } else {
            rerunNotDone();
        }
        if (!data?.length && file && stateProcess[Process.FILE]?.status !== Status.DONE) {
            if (!tee?.value) throw new Error('TEE required');
            try {
                changeState({ process: Process.FILE, status: Status.PROGRESS });
                const { encryption, key } = await encryptFile(file);
                const { ciphertext, ...restEncryption } = encryption;
                const uploadResult = await uploadFile({ fileName: file.name, ciphertext });
                const filepath = getFilePath(uploadResult);
                const tiiEncryption = { ...restEncryption, key };
                tiiGeneratorId = await generateByOffer({ offerId: tee?.value, encryption: tiiEncryption, filepath });
                changeState({ process: Process.FILE, status: Status.DONE });
            } catch (e) {
                changeState({ process: Process.FILE, status: Status.ERROR, error: new Map().set(null, e as Error) });
                throw e;
            }
        }
        await workflow({
            values: getWorkflowValues(formValues, phrase as string, tiiGeneratorId),
            actionAccountAddress,
            web3,
            changeState,
            state,
        });
    }, [encryptFile, generateByOffer, uploadFile, getFilePath, changeState, initProcess, stateProcess, rerunNotDone]);

    return {
        runWorkflow,
        uploading,
        generating,
        encrypting,
        progress,
        changeStateProcess: changeState,
        stateProcess,
    };
};
