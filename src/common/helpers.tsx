import { ReactNode } from 'react';
import dayjs from 'dayjs';
import { Buffer } from 'buffer';
import BlockchainConnector, {
    OfferType,
    OfferGroup,
    TcbStatus,
    OrderStatus,
} from '@super-protocol/sp-sdk-js';
import { TOfferType } from '@/gql/graphql';
import { Item } from '@/uikit/Select/types';
import CONFIG from '@/config';

export const getAddressByKey = (key: string): string => BlockchainConnector.initActionAccount(key);

export function getEnumName(value: string, en: { [key: string]: string | number }): string {
    if (!value) return '';
    return Object.entries(en).find(([, val]) => value === val)?.[0] || '';
}

export const getOfferTypeName = (offerType: OfferType): string => getEnumName(offerType, OfferType);

// export const getOrderStatusName = (status: TOrderStatus): string => getEnumName(status, TOrderStatus);
export const getOrderStatusName = (status: OrderStatus): string => getEnumName(status, OrderStatus);

export const getOfferGroupName = (group: OfferGroup): string => getEnumName(group, OfferGroup);

export const getTCBStatusName = (status: TcbStatus): string => getEnumName(status, TcbStatus);

export const getParsedErrorTransactions = (e: Error): { message: string; transactionHash: string; } => {
    if (!e) return { message: '', transactionHash: '' };
    try {
        const transactionHash = JSON.parse(JSON.stringify(e))?.receipt?.transactionHash;
        return {
            transactionHash,
            message: e?.message,
        };
    } catch (error) {
        return { message: e?.message, transactionHash: '' };
    }
};

export const getTransactionHashLink = (hash?: string): string => {
    if (!hash) return '';
    return `${CONFIG.REACT_APP_POLYGON_SCAN}/${hash}`;
};

export const getErrorTransactionsTemplate = (e: Error): string => {
    const parsedError = getParsedErrorTransactions(e);
    if (!parsedError?.transactionHash) return parsedError?.message;
    const link = getTransactionHashLink(parsedError?.transactionHash);
    return parsedError?.transactionHash
        ? `<a href="${link}" target="_blank" rel="noopener noreferrer">${parsedError?.message}</a>`
        : parsedError?.message;
};

export const joinReactElements = (list: ReactNode[]): ReactNode | null => {
    if (Array.isArray(list) && list.length) {
        return list.reduce((prev, curr) => [prev, ', ', curr] as any);
    }
    return null;
};

export const getJoinedKeys = (data: object): ReactNode => (
    <>
        {
            joinReactElements(
                Object.entries(data).map(([key, value]) => (
                    <span key={key}>{`${key ? `${key}: ` : ''}${value || (typeof value === 'string' ? '-' : value)}`}</span>
                )),
            )
        }
    </>
);

export const getBase64FromHex = (hex: string): string => {
    if (!hex) return '';
    return Buffer.from(hex, 'hex').toString('base64');
};

export const genRanHex = (size: number): string => [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');

export const getOfferOptions = (): Item[] => Object.values(TOfferType).map((value) => ({ label: value, value }));

export const getTableDate = (date?: number): string => {
    if (!date) return '-';
    const dj = dayjs(date);
    return dj.isValid() ? dj.format('DD.MM.YYYY HH:mm') : '-';
};

export const getTableDateFromNow = (date?: number): string => {
    if (!date) return '-';
    const dj = dayjs(date);
    return dj.isValid() ? dj.fromNow() : '-';
};

export const isJSONString = (str: string): boolean => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const getExternalId = (): string => genRanHex(16);

export const getBase64FromBlob = (blob: Blob): Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});

export const getBase64FromFile = (file: File): Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

export const sliceWithDot = (str?: string, lenFrom = 6): string => {
    if (!str) return '';
    if (str.length < lenFrom) return str;
    return `${str.slice(0, lenFrom)}...${str.slice(str.length - lenFrom)}`;
};
