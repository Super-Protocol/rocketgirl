import { DocumentNode } from 'graphql';
import { OperationVariables } from '@apollo/client';

export interface OffersAdderProps {
    query: DocumentNode;
    label: string;
    name: string;
    isMulti?: boolean;
    filter?: OperationVariables;
}
