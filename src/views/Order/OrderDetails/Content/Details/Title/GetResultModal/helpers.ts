import * as Yup from 'yup';
import { Modes } from '@/uikit/MnemonicGenerator/types';
import { getPhraseSchema } from '@/views/Home/Content/CreateOrder/CreateOrderModal/helpers';
import { Fields } from './types';

export const getValidationSchema = (): any => {
    return Yup.object({
        [Fields.phrase]: getPhraseSchema(Fields.phrase),
        [Fields.agreement]: Yup.boolean().required('required'),
        [Fields.phraseTabMode]: Yup.string(),
    });
};

export const getInitialValues = (agreement?: boolean): {[x: string]: any } => ({
    [Fields.phraseTabMode]: Modes.generate,
    [Fields.agreement]: agreement,
    [Fields.phrase]: '',
});
