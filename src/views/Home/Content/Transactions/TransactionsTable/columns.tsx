import { ColumnProps } from 'react-table';
import dayjs from 'dayjs';
import { CopyToClipboard, EyeLink } from '@/uikit';
import { Columns, GetColumnsProps } from './types';

export const getColumns = ({ onClickTxnHash = () => {} }: GetColumnsProps): Array<ColumnProps<Columns>> => [
    {
        Header: 'Tnx hash',
        id: 'txnHash',
        Cell: ({ row }) => <EyeLink onClick={() => onClickTxnHash(row.original?.txnHash)}>{row.original?.txnHash}</EyeLink>,
    },
    {
        Header: 'Method',
        id: 'method',
        Cell: ({ row }) => row.original?.method || '-',
        isEllipsis: true,
    },
    {
        Header: 'Block',
        id: 'block',
        Cell: ({ row }) => row.original?.block || '-',
        isEllipsis: true,
    },
    {
        Header: 'Date Time (UTC)',
        id: 'dateTime',
        Cell: ({ row }) => (row.original?.dateTime ? dayjs(row.original.dateTime).format('YYYY-MM-DD HH:mm:ss') : '-'),
        isEllipsis: true,
    },
    {
        Header: 'From',
        id: 'from',
        Cell: ({ row }) => <CopyToClipboard>{row.original?.from || '-'}</CopyToClipboard>,
    },
    {
        Header: 'To',
        id: 'to',
        Cell: ({ row }) => <CopyToClipboard>{row.original?.to || '-'}</CopyToClipboard>,
    },
];
