import * as Yup from 'yup';
import { Fields, FormValues } from './types';

export const getValidationSchema = (): Yup.SchemaOf<FormValues> => {
    return Yup.object({
        [Fields.token]: Yup.string().required('Incorrect access token'),
    });
};
