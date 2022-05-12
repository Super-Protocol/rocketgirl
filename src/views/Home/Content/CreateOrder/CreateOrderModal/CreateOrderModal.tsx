import React, {
    memo,
    FC,
    useState, useMemo,
} from 'react';
import { Formik } from 'formik';
import { OffersSelectDocument, TOfferType } from '@/gql/graphql';
import { Box } from '@/uikit';
import { CreateOrderModalProps } from './types';
import { OffersAdder } from './OffersAdder';

export const CreateOrderModal: FC<CreateOrderModalProps> = memo(({ initialValues: initialValuesProps }) => {
    const [initialValues] = useState(initialValuesProps || {});
    return (
        <Box direction="column">
            <Formik initialValues={initialValues} enableReinitialize onSubmit={() => {}}>
                <>
                    <OffersAdder
                        query={OffersSelectDocument}
                        label="Solution"
                        name="solution"
                        filter={useMemo(() => ({ offerType: TOfferType.Solution }), [])}
                    />
                    <OffersAdder
                        query={OffersSelectDocument}
                        label="Data"
                        name="data"
                        isMulti
                        filter={useMemo(() => ({ offerType: TOfferType.Data }), [])}
                    />
                </>
            </Formik>
        </Box>
    );
});
