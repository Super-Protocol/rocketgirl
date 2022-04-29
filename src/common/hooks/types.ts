export interface TDataDefaultPageData {
    count?: number | null;
    limit?: number | null;
    offset?: number | null;
}

export interface TDataDefaultPageEdge<TNode> {
    node?: TNode | null;
    cursor?: string | null;
}

export interface TDataDefaultPageInfo {
    endCursor?: string | null;
    startCursor?: string | null;
    hasNextPage?: boolean | null;
    hasPreviousPage?: boolean | null;
}

export interface TDataDefaultPage<TNode> {
    edges?: TDataDefaultPageEdge<TNode>[] | null;
    pageInfo?: TDataDefaultPageInfo | null;
}

export interface TDataDefault<TNode> {
    result?: {
        pageData?: TDataDefaultPageData | null;
        page?: TDataDefaultPage<TNode> | null;
    }
}
