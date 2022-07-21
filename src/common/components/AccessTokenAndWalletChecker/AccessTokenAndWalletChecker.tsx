import {
    memo,
    FC,
} from 'react';
import { useAccessTokenAndWalletChecker } from '@/common/hooks/useAccessTokenAndWalletChecker';
import { AccessTokenAndWalletCheckerProps } from './types';

export const AccessTokenAndWalletChecker: FC<AccessTokenAndWalletCheckerProps> = memo(({ children }) => {
    useAccessTokenAndWalletChecker();
    return children;
});
