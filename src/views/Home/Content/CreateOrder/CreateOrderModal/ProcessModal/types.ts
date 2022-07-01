import { FormValues } from '@/views/Home/Content/CreateOrder/CreateOrderModal/types';
import { State } from '../hooks/useWorkflowProcess';

export interface ProcessModalProps {
    formValues: FormValues;
    createProcessModal: (formValues: FormValues, state?:State) => void;
    initialState?: State;
}
