import { memo, FC, lazy } from 'react';
import {
    BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import { AppRouterProps } from './types';

const Error404 = lazy(() => import(/* webpackChunkName: 'Error404' */'@/views/Error/Error404/Error404'));
const Home = lazy(() => import(/* webpackChunkName: 'Home' */'@/views/Home/Home'));
const OrderDetails = lazy(() => import(/* webpackChunkName: 'OrderDetails' */'@/views/Order/OrderDetails/OrderDetails'));

const AppRouter: FC<AppRouterProps> = memo(() => {
    return (
        <BrowserRouter basename="/">
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/order/:id" exact component={OrderDetails} />
                <Route path="/404" component={Error404} />
                <Route from="*">
                    <Redirect to="/404" />
                </Route>
            </Switch>
        </BrowserRouter>
    );
});

export default memo(AppRouter);
