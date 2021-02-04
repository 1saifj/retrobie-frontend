import '../assets/style/index.scss';
import React, {Suspense} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Loading from '../components/loading';
import AdminDashboard from '../pages/admin/dashboard';

import {regularRoutes, adminRoutes} from './routes-list'
import NotFound from '../pages/not-found';


function Routes() {
  const AdminRoute = function ({ component: Component, ...rest }) {
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
                exact={route.exact}
                path={route.path}
                component={route.component}/>
            ))
          }

          {
            adminRoutes.map(route => (
              <AdminRoute
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
