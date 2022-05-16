import { ColumnProps } from 'react-table';
import { Provider } from '@/gql/graphql';
import { CopyToClipboard } from '@/uikit';
import { getTableDate } from '@/views/Home/Content/MainTable/helpers';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { TooltipLink } from '@/common/components/TooltipLink';

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
    // todo add link support
    {
        Header: 'Description',
        id: 'description',
        Cell: ({ row }) => {
            const { description } = row.original?.providerInfo || {};
            return description ? <TooltipLink description={description} /> : '-';
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
        Header: 'Modified Date',
        id: 'modifiedDate',
        Cell: ({ row }) => getTableDate(row.original?.origins?.modifiedDate / 1000),
        width: 'auto',
    },
];
