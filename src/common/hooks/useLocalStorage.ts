import { Dispatch, SetStateAction } from 'react';

import { useLocalStorage as useLocalStorageReactUse } from 'react-use';

const fakeKey = 'DEFAULT_LOCAL_STORAGE_KEY';
const fakeSetter = () => {};

export const useLocalStorage = <T>(
    key?: string,
    initialValueArg?: T | undefined,
    options?: {
        raw: false;
        serializer: (value: T) => string;
        deserializer: (value: string) => T;
    },
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] => {
    const initialValue = key ? initialValueArg : undefined;
    const localStorageData = useLocalStorageReactUse(key || fakeKey, initialValue, options || { raw: true });

    if (key) {
        return localStorageData;
    }

    return [initialValueArg, fakeSetter] as any;
};
