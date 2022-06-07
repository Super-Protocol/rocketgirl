import { Tables } from '@/views/Home/types';

export interface ContentProps {}

export interface GetTablesProps {
    hide?: Tables[];
}

export type GetDiffIndexesResult = Map<number, Set<string>> | null;
