import {
    useMutation as useMutationApollo,
    MutationHookOptions as MutationHookOptionsApollo,
    MutationTuple,
    OperationVariables,
} from '@apollo/client';
import { DocumentNode } from 'graphql';

export interface MutationHookOptions<TData, TVariables> extends MutationHookOptionsApollo<TData, TVariables> {}

export const useMutation = <TData = any, TVariables = OperationVariables>
    (mutation: DocumentNode, options?: MutationHookOptions<TData, TVariables>): MutationTuple<TData, TVariables> => {
    return useMutationApollo(mutation, options);
};
