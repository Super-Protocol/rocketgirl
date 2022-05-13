import React, {
    memo,
    FC,
    useState, useMemo,
} from 'react';
import { Formik } from 'formik';
import {
    OffersSelectDocument,
    TOfferType,
    TeeOffersSelectDocument,
    Offer,
    TeeOffer,
} from '@/gql/graphql';
import { Box } from '@/uikit';
import { CreateOrderModalProps } from './types';
import { OffersAdder } from './OffersAdder';
import classes from './CreateOrderModal.module.scss';
import {
    valueOfferConvertNode,
    teeOfferConvertNode,
    solutionFilter,
    dataFilter,
    storageFilter,
} from './helpers';

export const CreateOrderModal: FC<CreateOrderModalProps> = memo(({ initialValues: initialValuesProps }) => {
    const [initialValues] = useState(initialValuesProps || {});
    return (
        <Box direction="column">
            <Formik initialValues={initialValues} enableReinitialize onSubmit={() => {}}>
                <>
                    <OffersAdder
                        <Offer>
                        query={OffersSelectDocument}
                        label="Solution"
                        name="solution"
                        btnLabel="Add solution"
                        isMulti
                        filter={solutionFilter}
                        className={classes.adder}
                        convertNode={valueOfferConvertNode}
                    />
                    <OffersAdder
                        <Offer>
                        query={OffersSelectDocument}
                        label="Data"
                        name="data"
                        btnLabel="Add data"
                        isMulti
                        filter={dataFilter}
                        className={classes.adder}
                        convertNode={valueOfferConvertNode}
                    />
                    <OffersAdder
                        <Offer>
                        query={OffersSelectDocument}
                        label="Storage"
                        name="storage"
                        btnLabel="Add storage"
                        filter={storageFilter}
                        className={classes.adder}
                        convertNode={valueOfferConvertNode}
                    />
                    <OffersAdder
                        <TeeOffer>
                        query={TeeOffersSelectDocument}
                        label="TEE"
                        name="tee"
                        btnLabel="Add TEE"
                        className={classes.adder}
                        convertNode={teeOfferConvertNode}
                    />
                </>
            </Formik>
        </Box>
    );
});
