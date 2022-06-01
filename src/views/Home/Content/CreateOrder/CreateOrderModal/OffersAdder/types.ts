import { DocumentNode } from 'graphql';
import { TOfferType } from '@/gql/graphql';
import { OperationVariables } from '@apollo/client';
import { ConvertNode } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { FormValues } from '../types';

export interface OffersAdderProps<TNode> {
    query: DocumentNode;
    label: string;
    name: string;
    isMulti?: boolean;
    filter?: OperationVariables;
    btnLabel?: string;
    className?: string;
    convertNode?: ConvertNode<TNode>;
    showError?: boolean;
    checkTouched?: boolean;
    onDelete?: (values: FormValues) => void;
    onSave?: (values: FormValues) => void;
    reset?: string[];
    disabled?: boolean;
    isRequestBaseOffer?: boolean;
    offerType?: TOfferType;
}
