import {
    ReactElement, Suspense,
} from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppRouter from '@/router/AppRouter';
import { Spinner } from '@/uikit';
import { ApolloClientProvider } from '@/apollo/providers/ApolloClientProvider';
import { ScrollbarProvider } from '@/common/context';

const queryClient = new QueryClient();

const App = (): ReactElement => (
    <Suspense fallback={<Spinner fullscreen />}>
        <ApolloClientProvider>
            <QueryClientProvider client={queryClient}>
                <ScrollbarProvider>
                    <AppRouter />
                </ScrollbarProvider>
            </QueryClientProvider>
        </ApolloClientProvider>
    </Suspense>
);

export default App;
