import '../assets/style/index.scss';
import React, {Suspense} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Loading from '../components/loading';
import AdminDashboard from '../pages/admin/dashboard';
import jwtDecode from 'jwt-decode';
import {regularRoutes, adminRoutes} from './routes-list'
import NotFound from '../pages/not-found';
import {UserState} from '../state/reducers/userReducers';
import {RootStateOrAny, useSelector} from 'react-redux';


function Routes() {

  const AdminRoute = function ({ component: Component, ...rest }) {

    const user: UserState = useSelector((state: RootStateOrAny) => state.user);

    const decodedAccessToken = jwtDecode(user?.tokens?.accessToken);

    if (!user?.isLoggedIn || decodedAccessToken.role !== 'ROLE_ADMIN'){
      return (
        <NotFound/>
      )
    }

    return (
      <Route
        {...rest}
        render={props => (
          <AdminDashboard {...props}>
            <Component {...props} />
          </AdminDashboard>
        )}
      />
    );
  };
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading message={false}/>}>
        <Switch>
          {
            regularRoutes.map(route => (
              <Route
                key={route.path}
                exact={route.exact}
                path={route.path}
                component={route.component}/>
            ))
          }

          {
            adminRoutes.map(route => (
              <AdminRoute
                key={route.path}
                exact={route.exact}
                path={route.path}
                component={route.component}/>
            ))
          }

          <Route component={NotFound}/>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default Routes;
