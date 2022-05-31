import { DocumentNode } from 'graphql';
import { OperationVariables } from '@apollo/client';
import { ConvertNode } from '@/common/hooks/useSelectQueryCursorSPFetcher';
import { Info } from '@/uikit/ListAdder/ListAdderView/types';
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
    onDelete?: (values: FormValues<Info>) => void;
    onSave?: (values: FormValues<Info>) => void;
    reset?: string[];
}
