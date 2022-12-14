import { ColumnProps } from 'react-table';
import { Provider } from '@/gql/graphql';
import { CopyToClipboard } from '@/uikit';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { TooltipLink } from '@/common/components/TooltipLink';
import { getTableDate } from '@/common/helpers';

export type ProviderColumns = UseTableQueryFetcherResultList<Provider>;

export const getColumns = (): Array<ColumnProps<ProviderColumns>> => [
    {
        Header: 'ID',
        id: 'id',
        Cell: ({ row }) => <CopyToClipboard>{row.original?.address || '-'}</CopyToClipboard>,
        width: 'auto',
    },
    {
        Header: 'Name',
        id: 'name',
        Cell: ({ row }) => {
            const { name } = row.original?.providerInfo || {};
            return name ? <TooltipLink text={name} title="Name" checkOverflow /> : '-';
        },
        width: 'auto',
        isEllipsis: true,
    },
    // todo add link support
    {
        Header: 'Description',
        id: 'description',
        Cell: ({ row }) => {
            const { description } = row.original?.providerInfo || {};
            return description ? <TooltipLink text={description} title="Description" checkOverflow /> : '-';
        },
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
        Cell: ({ row }) => getTableDate(row.original?.origins?.modifiedDate),
        width: 'auto',
    },
];
