import { useCallback } from 'react';
import Web3 from 'web3';
import { workflow, WorkflowPropsValues } from '@/connectors/orders';
import { generateMnemonic } from '@/utils/crypto';
import { useFileUploader } from './useFileUploader';
import { usePublishTee } from './usePublishTee';
import { useEncryptFile } from './useEncryptFile';
import { FormValues } from '../types';

export interface RunWorkflowProps {
    formValues: FormValues;
    actionAccountAddress?: string;
    web3?: Web3;
}

export interface UseWorkflowResult {
    runWorkflow: (props: RunWorkflowProps) => Promise<void>;
    uploading: boolean;
    generating: boolean;
    encrypting: boolean;
}

export const getWorkflowValues = (formValues: FormValues, mnemonic: string, teeGeneratorId?: string): WorkflowPropsValues => {
    const {
        solution,
        data,
        tee,
        storage,
        deposit,
    } = formValues;
    return {
        mnemonic: mnemonic || '',
        solution: [solution?.value as string]
            .concat(
                solution?.data?.sub
                    ?.map((item) => item?.value as string)
                    .filter((value) => value) || [],
            ),
        data: data?.map((d) => d?.value as string),
        tee: tee?.value as string,
        storage: storage?.value as string,
        deposit: deposit || 0,
        args: teeGeneratorId ? JSON.stringify({ data: [teeGeneratorId] }) : undefined,
    };
};

export const useWorkflow = (): UseWorkflowResult => {
    const { uploading, uploadFile, getFilePath } = useFileUploader();
    const { generating, generateByOffer } = usePublishTee();
    const { encrypting, encryptFile } = useEncryptFile();
    const runWorkflow = useCallback(async (props: RunWorkflowProps) => {
        const { formValues, actionAccountAddress, web3 } = props || {};
        if (!actionAccountAddress || !web3) throw new Error('Metamask account not found');
        const {
            file,
            data,
            tee,
            phrase,
        } = formValues || {};
        let teeGeneratorId;
        if (!phrase) throw new Error('Seed phrase required');
        if (!data?.length) {
            if (!file) throw new Error('File required');
            if (!tee?.value) throw new Error('TEE required');
            const encryption = await encryptFile(file);
            const { ciphertext } = encryption;
            const uploadResult = await uploadFile({ fileName: file.name, ciphertext });
            console.log('uploadResult', uploadResult);
            const filepath = getFilePath(uploadResult);
            console.log('filepath', filepath, encryption);
            console.log('tee: ', tee?.value);
            teeGeneratorId = await generateByOffer({ offerId: tee?.value, encryption, filepath });
            console.log('teeGeneratorId', teeGeneratorId);
        }
        await workflow({
            values: getWorkflowValues(formValues, phrase as string, teeGeneratorId),
            actionAccountAddress,
            web3,
        });
    }, [encryptFile, generateByOffer, uploadFile, getFilePath]);

    return {
        runWorkflow,
        uploading,
        generating,
        encrypting,
    };
};
