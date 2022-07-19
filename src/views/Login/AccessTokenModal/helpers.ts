import * as Yup from 'yup';
import { Fields, FormValues } from './types';

export const DEFAULT_TOKEN_ERROR = 'Incorrect access token';

export const getValidationSchema = (): Yup.SchemaOf<FormValues> => {
    return Yup.object({
        [Fields.token]: Yup.string().required(DEFAULT_TOKEN_ERROR),
    });
};
