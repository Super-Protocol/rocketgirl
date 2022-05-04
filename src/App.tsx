import {
    ReactElement, Suspense,
} from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppRouter from '@/router/AppRouter';
import { Spinner } from '@/uikit';
import { ModalOkCancelProvider } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { ApolloClientProvider } from '@/apollo/providers/ApolloClientProvider';
import Global from './Global';

const queryClient = new QueryClient();

const App = (): ReactElement => (
    <Suspense fallback={<Spinner fullscreen />}>
        <ApolloClientProvider>
            <QueryClientProvider client={queryClient}>
                <Global>
                    <ModalOkCancelProvider>
                        <AppRouter />
                    </ModalOkCancelProvider>
                </Global>
            </QueryClientProvider>
        </ApolloClientProvider>
    </Suspense>
);

export default App;
