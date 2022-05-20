import * as Yup from 'yup';
import { FormValues } from './types';

export const initialValues = {};

export const getValidationSchema = (): Yup.SchemaOf<FormValues> => Yup.object({
    amount: Yup.number().required('required'),
});
