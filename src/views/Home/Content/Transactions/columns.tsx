import React from 'react';
import { ColumnProps } from 'react-table';
import { CopyToClipboard, EyeLink } from '@/uikit';
import { getTableDateFromNow } from '@/common/helpers';
import { Columns } from './types';

export interface GetColumnsProps {
    onClickTxnHash: (hash?: string) => void;
}

export const getColumns = ({ onClickTxnHash = () => {} }: GetColumnsProps): Array<ColumnProps<Columns>> => [
    {
        Header: 'Tnx hash',
        id: 'txnHash',
        Cell: ({ row }) => {
            const { txnHash } = row.original || {};
            if (!txnHash) return '-';
            return <EyeLink onClick={() => onClickTxnHash(txnHash)}>{txnHash}</EyeLink>;
        },
        width: 'auto',
    },
    {
        Header: 'Method',
        id: 'method',
        Cell: ({ row }) => row.original?.method || '-',
        isEllipsis: true,
        width: 'auto',
    },
    {
        Header: 'Block',
        id: 'block',
        Cell: ({ row }) => row.original?.block || '-',
        isEllipsis: true,
        width: 'auto',
    },
    {
        Header: 'Age',
        id: 'age',
        Cell: ({ row }) => {
            const { dateTime } = row.original || {};
            return getTableDateFromNow(dateTime);
        },
        isEllipsis: true,
        width: 'auto',
    },
    {
        Header: 'From',
        id: 'from',
        Cell: ({ row }) => {
            const { from } = row.original || {};
            if (!from) return '-';
            return <CopyToClipboard>{from}</CopyToClipboard>;
        },
        width: 'auto',
    },
    {
        Header: 'To',
        id: 'to',
        Cell: ({ row }) => {
            const { to } = row.original || {};
            if (!to) return '-';
            return <CopyToClipboard>{to}</CopyToClipboard>;
        },
        width: 'auto',
    },
    {
        Header: 'Value',
        id: 'value',
        Cell: ({ row }) => {
            return ''; // todo
        },
        isEllipsis: true,
        width: 'auto',
    },
    {
        Header: '[Txn Fee]',
        id: 'tnxFee',
        Cell: ({ row }) => {
            return ''; // todo
        },
        isEllipsis: true,
        width: 'auto',
    },
];
