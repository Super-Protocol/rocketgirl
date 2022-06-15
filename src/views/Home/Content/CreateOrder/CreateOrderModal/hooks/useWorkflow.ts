import { useCallback } from 'react';
import Web3 from 'web3';
import { Modes } from '@/uikit/MnemonicGenerator/types';
import { workflow, WorkflowPropsValues } from '@/connectors/orders';
import { useFileUploader } from './useFileUploader';
import { useGenerateTII } from './useGenerateTII';
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
        args: tiiGeneratorId ? JSON.stringify({ data: [tiiGeneratorId] }) : undefined,
    };
};

export const useWorkflow = (): UseWorkflowResult => {
    const { uploading, uploadFile, getFilePath } = useFileUploader();
    const { generating, generateByOffer } = useGenerateTII();
    const { encrypting, encryptFile } = useEncryptFile();
    const runWorkflow = useCallback(async (props: RunWorkflowProps) => {
        const { formValues, actionAccountAddress, web3 } = props || {};
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
        if (!data?.length && file) {
            if (!tee?.value) throw new Error('TEE required');
            const { encryption, key } = await encryptFile(file);
            const { ciphertext, ...restEncryption } = encryption;
            const uploadResult = await uploadFile({ fileName: file.name, ciphertext });
            const filepath = getFilePath(uploadResult);
            const tiiEncryption = { ...restEncryption, key };
            tiiGeneratorId = await generateByOffer({ offerId: tee?.value, encryption: tiiEncryption, filepath });
        }
        await workflow({
            values: getWorkflowValues(formValues, phrase as string, tiiGeneratorId),
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
