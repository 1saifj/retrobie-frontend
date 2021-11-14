import React, {Suspense} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Loading from '../components/loading';
import {regularRoutes} from './routes-list';
import NotFound from '../pages/not-found';


function AppRoutes() {


  return (
    <BrowserRouter>
      <Suspense fallback={<Loading message={false} />}>
        <Routes>
          {
            regularRoutes.map(route => {
              const Component: any = route.component;

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<Component />} />
              );
            })
          }

          <Route element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
