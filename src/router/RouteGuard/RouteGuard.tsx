import React, { memo, FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import { AUTH_TOKEN } from '@/common/constants';
import { RouteGuardProps } from './types';

export const RouteGuard: FC<RouteGuardProps> = memo(({ component: Component, ...rest }) => {
    const [token] = useLocalStorage<string>(AUTH_TOKEN, undefined);
    if (!Component) return null;
    return (
        <Route
            {...rest}
            render={(props) => (token ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />)}
        />
    );
});
