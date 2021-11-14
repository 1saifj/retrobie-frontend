import {reducer as tooltip} from 'redux-tooltip';
import {combineReducers} from 'redux';
import {cartReducers, uploaderReducers, metaReducers, userReducers} from './reducers';

/**
 * Don't forget to whitelist a reducer inside persistGate after
 * adding it here.
 */
const rootReducer = combineReducers({
  tooltip,
  cart: cartReducers,
  meta: metaReducers,
  user: userReducers,
  uploader: uploaderReducers,
});

export default rootReducer;
