import { UseTablesSkipType } from '@/views/Home/hooks/useTables';
import { UseTableQueryFetcherPropsSkip } from '@/common/hooks/useTableQueryFetcher';

export interface SkipBlockProps {
    skip: UseTableQueryFetcherPropsSkip<UseTablesSkipType>;
}
