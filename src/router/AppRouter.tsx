import { memo, FC, lazy } from 'react';
import {
    BrowserRouter, Routes, Route, Navigate, Outlet,
} from 'react-router-dom';
import { AppRouterProps } from './types';
import { RouteGuard } from './RouteGuard';

// const Error404 = lazy(() => import(/* webpackChunkName: 'Error404' */'@/views/Error/Error404/Error404'));
const Home = lazy(() => import(/* webpackChunkName: 'Home' */'@/views/Home/Home'));
const Login = lazy(() => import(/* webpackChunkName: 'Home' */'@/views/Login/Login'));
const HomeLayout = lazy(() => import(/* webpackChunkName: 'Home' */'./HomeLayout/HomeLayout'));
const OrderDetails = lazy(() => import(/* webpackChunkName: 'OrderDetails' */'@/views/Order/OrderDetails/OrderDetails'));

const AppRouter: FC<AppRouterProps> = memo(() => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={(
                    <RouteGuard>
                        <HomeLayout>
                            <Outlet />
                        </HomeLayout>
                    </RouteGuard>
                )}
                >
                    <Route path="/" element={<Home />} />
                    <Route path="/order/:id" element={<OrderDetails />} />
                </Route>
                <Route path="/login" element={<Login />} />
                {/*<Route path="/404" element={<Error404 />} />*/}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </BrowserRouter>
    );
});

export default memo(AppRouter);
