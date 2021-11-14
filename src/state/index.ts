import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

const composeEnhancers = compose;

const configureStore = function () {
  const middlewares = [thunk];

  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));

  return {store};
};
export default configureStore;
