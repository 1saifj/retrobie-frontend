import {applyMiddleware, compose, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import {createStateSyncMiddleware, initStateWithPrevTab} from 'redux-state-sync';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import rootReducer from './combineReducers';
import { env } from '../config';

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;

const rootState = function() {
  const persistConfig = {
    key: env.isStaging() || env.isDev() ? `redux:${env.getEnvironment()}` : 'redux',
    storage: storage,
    stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
    whitelist: ['cart', 'meta', 'user', 'uploader'],
  };

  const tabsSyncMiddleWareConfig = {
    // we don't want these actions to be synced across tabs
    blacklist: [
      "persist/PERSIST",
      "persist/REHYDRATE"
    ],
  };

  const pReducer = persistReducer(persistConfig, rootReducer);

  const middlewares = [thunk, createStateSyncMiddleware(tabsSyncMiddleWareConfig)];

  const store = createStore(pReducer, composeEnhancers(applyMiddleware(...middlewares)));

  // initialize our tabs sync middleware
  initStateWithPrevTab(store);

  if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    if (module.hot) {
      // @ts-ignore
      module.hot.accept('./combineReducers', () => {
        const nextRootReducer = require('./combineReducers').default;
        store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
      });
    }
  }

  const persistor = persistStore(store);
  return {store, persistor};
}
export default rootState;
