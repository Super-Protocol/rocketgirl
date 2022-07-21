import React, { memo, FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import { AUTH_TOKEN } from '@/common/constants';
import { RouteGuardProps } from './types';

export const RouteGuard: FC<RouteGuardProps> = memo(({ children }) => {
    const [token] = useLocalStorage<string>(AUTH_TOKEN, undefined);
    if (!token) return <Navigate to="/login" replace />;
    return children;
});
