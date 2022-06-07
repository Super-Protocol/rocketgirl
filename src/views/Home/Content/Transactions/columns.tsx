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
            const { hash } = row.original || {};
            if (!hash) return '-';
            return <EyeLink onClick={() => onClickTxnHash(hash)}>{hash}</EyeLink>;
        },
        width: 'auto',
    },
    // todo
    // {
    //     Header: 'Method',
    //     id: 'method',
    //     Cell: ({ row }) => row.original?.method || '-',
    //     isEllipsis: true,
    //     width: 'auto',
    // },
    {
        Header: 'Block',
        id: 'block',
        Cell: ({ row }) => row.original?.blockNumber || '-',
        isEllipsis: true,
        width: 'auto',
    },
    {
        Header: 'Age',
        id: 'age',
        Cell: ({ row }) => {
            const { timestamp } = row.original || {};
            return getTableDateFromNow(timestamp);
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
            const { value } = row.original || {};
            if (!value) return '-';
            return value;
        },
        isEllipsis: true,
        width: 'auto',
    },
    {
        Header: '[Txn Fee]',
        id: 'tnxFee',
        Cell: ({ row }) => {
            const { gas, gasPrice } = row.original || {};
            return gas && gasPrice ? (Number(gas) * Number(gasPrice)) / 10 ** 18 : '-'; // todo
        },
        isEllipsis: true,
        width: 'auto',
    },
];
