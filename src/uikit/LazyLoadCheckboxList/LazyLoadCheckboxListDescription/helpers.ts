export const LIMIT_CHAR = 150;

export const getIsLimit = (str?: string, limit?: number): boolean => (str?.length || 0) > (limit || 0);

export const getDottedStr = (str?: string, limit?: number): string => {
    if (!str) return '';
    if (!getIsLimit(str, limit)) return str;
    return `${str.substr(0, limit)}...`;
};

export const getCheckedStr = (str?: string, limit?: number): { strLimited: string, isLimit: boolean; str: string } => {
    return {
        isLimit: getIsLimit(str, limit),
        strLimited: getDottedStr(str, limit),
        str: str || '',
    };
};
