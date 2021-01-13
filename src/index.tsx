import React from 'react';
import ReactDOM from 'react-dom';
// import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import configureStore from './state';
import Routes from './routes';
import {toast} from 'react-toastify';
import * as Sentry from '@sentry/browser';
import styled from 'styled-components';
import {env} from './config';
import ScrollToTop from './components/ScrollToTop';
import {PersistGate} from 'redux-persist/integration/react';
import {FilterProviderV2} from './hooks/useFiltersV2';

require('react-hot-loader/patch');

toast.configure({
    autoClose: 5000,
    draggable: false,
});

if (!env.isDev()) {
    //Only launch Sentry in production
    Sentry.init({dsn: "https://b9c3bf6a03da4740afaa0f1d8bd931e9@sentry.io/1886895"});
}

const Root = styled.div`
  display: flex;
  justify-content: center;
  & > div {
    width: 100%;
  }
`;


const render = Component => {

    const {store, persistor} = configureStore();
    return ReactDOM.render((
      <Provider store={store}>
        <FilterProviderV2>
          <PersistGate loading={<p>Please wait...</p>} persistor={persistor}>
            <Root>
              <ScrollToTop/>
              <Component/>
            </Root>
          </PersistGate>
        </FilterProviderV2>
      </Provider>
    ), document.getElementById('root'));
};

render(Routes);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();

// @ts-ignore
if (module.hot) {
// @ts-ignore
    module.hot.accept('./routes', () => {
        const NextApp = require('./routes').default;
        render(NextApp);
    })
}
