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
    addresses: string[];
}

export interface UsePublishTeeResult {
    generateByOffer: (props: GenerateByOfferProps) => Promise<string | undefined>;
    generating: boolean;
}

export const useGenerateTII = (): UsePublishTeeResult => {
    const [generating, setGenerating] = useState(false);
    const generateByOffer = useCallback(async (props: GenerateByOfferProps): Promise<string | undefined> => {
        setGenerating(true);
        try {
            const {
                offerId,
                encryption,
                filepath,
                addresses,
            } = props;
            const { hashes, linkage } = await TIIGenerator.getSolutionHashesAndLinkage(addresses);
            return TIIGenerator.generateByOffer(
                offerId,
                hashes,
                linkage,
                {
                    type: ResourceType.StorageProvider,
                    storageType: StorageType.StorJ,
                    filepath,
                    credentials: {
                        bucket: 'inputs',
                        prefix: '',
                        token: CONFIG.REACT_APP_ARGS_BUCKET_READ_ACCESS,
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
