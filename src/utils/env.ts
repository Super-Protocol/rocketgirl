export enum GetConfigWithEnvOptionsParsedType {
    number,
    string
}

export interface GetConfigWithEnvOptions {
    [kes: string]: GetConfigWithEnvOptionsParsedType;
}

export const getParsedEnvValue = (value: string, option?: GetConfigWithEnvOptionsParsedType): number | string => {
    switch (option) {
        case GetConfigWithEnvOptionsParsedType.number:
            return parseInt(value, 10);
        default:
            return value;
    }
};

export function getConfigWithEnv<Config>(defaultConfig: Config, options?: GetConfigWithEnvOptions): Config {
    try {
        return Object.entries(defaultConfig).reduce((acc, [key, value]) => {
            const newValue = process.env?.[key] || value;
            return {
                ...acc,
                [key]: getParsedEnvValue(newValue, options?.[key]),
            };
        }, {} as Config);
    } catch (e) {
        console.error('Error parse env: ', e);
        return defaultConfig;
    }
}
