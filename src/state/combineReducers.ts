import {reducer as tooltip} from 'redux-tooltip';
import {combineReducers} from 'redux';
import {cartReducers, uploaderReducers, metaReducers, userReducers} from './reducers';

export default combineReducers({
  tooltip,
  cart: cartReducers,
  meta: metaReducers,
  user: userReducers,
  uploader: uploaderReducers,
});
