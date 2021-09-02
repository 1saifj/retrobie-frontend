import {
  ADD_TO_CART,
  CREATE_CHECKOUT,
  DELETE_CART,
  DELETE_CHECKOUT,
  LOG_IN_USER,
  LOG_OUT_USER,
  REFRESH_SESSION,
  REMOVE_FROM_CART,
  TOGGLE_SIDEBAR,
  SAVE_CHECKOUT_ADDRESS,
  SAVE_SHIPPING_QUOTE,
  SAVE_ZOOM_LEVEL, FETCH_REMOTE_CART, EMPTY_CART, IMAGE_UPLOADED, REMOVE_UPLOADED_IMAGE, FETCH_FILTERED_PRODUCTS,
} from './constants';
import {AddressType, CartItemType, CartType, LoginResponseType} from '../../types';
import {UploadedImageType} from '../../components/uploader/ImageUploader';

const createAction = (type: string, payload?: any) => ({type, payload});

// cart
export const addItemToCartAction = (payload: {item: CartItemType}) =>
  createAction(ADD_TO_CART, payload);
export const removeItemFromCartAction = (payload: {item: CartItemType}) =>
  createAction(REMOVE_FROM_CART, payload);

// emptying a cart involves getting rid of all the cart items
// but doesn't delete the cartId
export const emptyCartAction = () => createAction(EMPTY_CART);
// deleting a cart deletes everything to do with the cart.
// This is normally done only after a successful checkout.
export const deleteCartAction = () => createAction(DELETE_CART);
export const fetchRemoteCartAction = (payload: {id: string}) => createAction(FETCH_REMOTE_CART, payload);

export const createCheckoutAction = (payload: CartType) => createAction(CREATE_CHECKOUT, payload);
// since the checkoutId is taken directly from the cartId
// there is no need to have separate 'delete' and 'empty' actions
export const deleteCheckoutAction = () => createAction(DELETE_CHECKOUT);

//user
export const loginUserAction = (payload: LoginResponseType) =>
  createAction(LOG_IN_USER, payload);
export const logoutUserAction = () => createAction(LOG_OUT_USER);
export const saveCheckoutAddressAction = (data: {address: AddressType})=> createAction(SAVE_CHECKOUT_ADDRESS, data)
export const saveShippingQuoteAction = (data: {cost: number, courierOrderNo?: string})=>
  createAction(SAVE_SHIPPING_QUOTE, data)
export const refreshSessionAction = (payload: {accessToken: string}) =>
  createAction(REFRESH_SESSION, payload);
export const setZoomLevelAction = (payload: {level: number}) => createAction(SAVE_ZOOM_LEVEL, payload);

// products
export const fetchFilteredProductsAction = (payload: {query: string}) =>
  createAction(FETCH_FILTERED_PRODUCTS, payload);

// meta
export const toggleSidebarAction = (payload: {open: boolean}) =>
  createAction(TOGGLE_SIDEBAR, payload);
export const imageUploadedAction = (payload: {image: UploadedImageType, uploaderId: string}) =>
  createAction(IMAGE_UPLOADED, payload);
export const deleteUploadedImageAction = (payload: {uploaderId: string}) =>
  createAction(REMOVE_UPLOADED_IMAGE, payload);
