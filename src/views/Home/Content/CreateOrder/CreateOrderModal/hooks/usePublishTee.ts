import {
    TIIGenerator,
} from '@super-protocol/sp-sdk-js';
import {
    Encryption,
    ResourceType,
    StorageType,
    Resource,
} from '@super-protocol/sp-dto-js';
import { useCallback, useState } from 'react';
import CONFIG from '@/config';

export interface GenerateByOfferProps {
    offerId: string;
    encryption: Encryption;
    filepath: string;
}

export interface UsePublishTeeResult {
    generateByOffer: (props: GenerateByOfferProps) => Promise<string | undefined>;
    generating: boolean;
}

export const usePublishTee = (): UsePublishTeeResult => {
    const [generating, setGenerating] = useState(false);
    const generateByOffer = useCallback(async (props: GenerateByOfferProps): Promise<string | undefined> => {
        setGenerating(true);
        try {
            const { offerId, encryption, filepath } = props;
            return TIIGenerator.generateByOffer(
                offerId,
                [],
                undefined,
                {
                    type: ResourceType.StorageProvider,
                    storageType: StorageType.StorJ,
                    filepath,
                    credentials: {
                        storageId: 'inputs',
                        token: CONFIG.REACT_APP_ARGS_BUCKET_READACCESS,
                    },
                } as Resource,
                undefined,
                encryption,
            );
        } finally {
            setGenerating(false);
        }
    }, []);
    return {
        generating,
        generateByOffer,
    };
};
