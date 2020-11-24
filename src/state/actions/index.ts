import {
  ADD_TO_CART,
  CREATE_CHECKOUT,
  DELETE_CHECKOUT,
  LOG_IN_USER,
  LOG_OUT_USER,
  REFRESH_SESSION,
  REMOVE_FROM_CART,
  TOGGLE_SIDEBAR,
} from './constants';
import {CartItemType, CartType} from '../../types';
import {LoginUserActionPayload} from '../reducers/userReducers';

export const createAction = (type: string, payload?: any) => ({type, payload});

// cart
export const addItemToCartAction = (payload: {item: CartItemType}) =>
  createAction(ADD_TO_CART, payload);
export const removeItemFromCartAction = (payload: {item: CartItemType}) =>
  createAction(REMOVE_FROM_CART, payload);
export const createCheckoutAction = (payload: CartType) => createAction(CREATE_CHECKOUT, payload);
export const deleteCheckoutAction = () => createAction(DELETE_CHECKOUT);

//user
export const loginUserAction = (payload: LoginUserActionPayload) =>
  createAction(LOG_IN_USER, payload);
export const logoutUserAction = () => createAction(LOG_OUT_USER);
export const refreshSessionAction = (payload: {accessToken: string}) =>
  createAction(REFRESH_SESSION, payload);

// meta
export const toggleSidebarAction = (payload: {open: boolean}) =>
  createAction(TOGGLE_SIDEBAR, payload);
