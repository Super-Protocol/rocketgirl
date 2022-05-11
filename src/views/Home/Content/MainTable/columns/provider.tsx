import { ColumnProps } from 'react-table';
import { Provider } from '@/gql/graphql';
import { CopyToClipboard, HtmlBox } from '@/uikit';
import { getTableDate } from '@/views/Home/Content/MainTable/helpers';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';

export type ProviderColumns = UseTableQueryFetcherResultList<Provider>;

export const getColumns = (): Array<ColumnProps<ProviderColumns>> => [
    {
        Header: 'Id',
        id: 'id',
        Cell: ({ row }) => <CopyToClipboard>{row.original?.address || '-'}</CopyToClipboard>,
        width: 'auto',
    },
    {
        Header: 'Name',
        id: 'name',
        Cell: ({ row }) => row.original?.providerInfo?.name || '-',
        width: 'auto',
        isEllipsis: true,
    },
    // todo add link support, add tooltip support
    {
        Header: 'Description',
        id: 'description',
        Cell: ({ row }) => {
            const { description } = row.original?.providerInfo || {};
            return description ? <HtmlBox text={description} /> : '-';
        },
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Authority',
        id: 'authority',
        Cell: ({ row }) => (row.original?.authority ? <CopyToClipboard>{row.original?.authority}</CopyToClipboard> : '-'),
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Account',
        id: 'account',
        Cell: ({ row }) => (
            row.original?.providerInfo?.actionAccount
                ? <CopyToClipboard>{row.original?.providerInfo.actionAccount}</CopyToClipboard>
                : '-'
        ),
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'ModifiedDate',
        id: 'modifiedDate',
        Cell: ({ row }) => getTableDate(row.original?.origins?.modifiedDate / 1000),
        width: 'auto',
    },
];
