import isEqual from 'lodash.isequal';

export const getStringWithEllipsis = (str: string, len: number): string => {
    return str && str.length > len ? `${str.substring(0, len)}...` : str;
};

export const generateArray = (len: number): number[] => Array.from(Array(len).keys());

export function fetchMock<DataType>(data: DataType, timeout = 1000, error = false): Promise<DataType> {
    return new Promise((res, rej) => { setTimeout(() => (error ? rej() : res(data)), timeout); });
}

export const genRandomNumBetween = (min = 0, max = 10): number => Math.floor(Math.random() * (max - min + 1) + min);

export function getDiffObj<Struct1 extends object, Struct2 extends object>(obj1: Struct1, obj2: Struct2): Set<string> {
    return Object.entries(obj1).reduce((acc, [keyOld, valueOld]) => {
        if (!isEqual(obj2[keyOld], valueOld)) {
            acc.add(keyOld);
        }
        return acc;
    }, new Set() as Set<string>);
}

export function removeTypenames<Obj = object>(obj: Obj, clone = true): Obj {
    if (typeof obj !== 'object') {
        return obj;
    }

    if (clone) {
        const omitTypename = (key, value) => (key === '__typename' ? undefined : value);
        return JSON.parse(JSON.stringify(obj), omitTypename);
    }

    Object.entries(obj).forEach(([key, val]) => {
        if (key === '__typename') {
            delete obj[key];
        } else if (val && typeof val === 'object') {
            removeTypenames(val, false);
        }
    });

    return obj;
}

export const getQSFromObj = (params: object): string => Object
    .entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as any)}`)
    .join('&');
