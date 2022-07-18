import { memo, FC, lazy } from 'react';
import {
    BrowserRouter, Switch, Redirect, Route,
} from 'react-router-dom';
import { AppRouterProps } from './types';
import { RouteGuard } from './RouteGuard';

const Error404 = lazy(() => import(/* webpackChunkName: 'Error404' */'@/views/Error/Error404/Error404'));
const Home = lazy(() => import(/* webpackChunkName: 'Home' */'@/views/Home/Home'));
const Login = lazy(() => import(/* webpackChunkName: 'Home' */'@/views/Login/Login'));
const OrderDetails = lazy(() => import(/* webpackChunkName: 'OrderDetails' */'@/views/Order/OrderDetails/OrderDetails'));

const AppRouter: FC<AppRouterProps> = memo(() => {
    return (
        <BrowserRouter basename="/">
            <Switch>
                <RouteGuard path="/" exact component={Home} />
                <RouteGuard path="/order/:id" exact component={OrderDetails} />
                <Route path="/login" component={Login} />
                <RouteGuard path="/404" component={Error404} />
                <RouteGuard path="*">
                    <Redirect to="/404" />
                </RouteGuard>
            </Switch>
        </BrowserRouter>
    );
});

export default memo(AppRouter);
