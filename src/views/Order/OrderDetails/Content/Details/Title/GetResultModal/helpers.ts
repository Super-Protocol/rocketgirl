import * as Yup from 'yup';
import { getPhraseSchema } from '@/views/Home/Content/CreateOrder/CreateOrderModal/helpers';
import { Fields } from './types';

export const getValidationSchema = (): any => {
    return Yup.object({
        [Fields.phrase]: getPhraseSchema(Fields.phrase),
    });
};

export const initialValues = {
    [Fields.phrase]: '',
};

export const placeholder = 'Enter a passphrase here...';
