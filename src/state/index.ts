import {applyMiddleware, createStore, compose} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import rootReducer from './combineReducers';

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;

export default function() {
  const persistConfig = {
    key: 'redux',
    storage: storage,
    stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
    whitelist: ['cart', 'meta', 'user'],
  };

  const pReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(pReducer, composeEnhancers(applyMiddleware(thunk)));

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
