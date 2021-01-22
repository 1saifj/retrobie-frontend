import {
  CREATE_CHECKOUT,
  DELETE_CHECKOUT,
  LOG_IN_USER,
  LOG_OUT_USER,
  REFRESH_SESSION,
  SAVE_CHECKOUT_ADDRESS,
  SAVE_SHIPPING_QUOTE,
  SAVE_ZOOM_LEVEL,
} from '../actions/constants';
import {AddressType, CartType, CheckoutType} from '../../types';

export type UserInfoType = {
  email: string;
  username: string;
  isVerified: string;
  role: 'user'
  is2FAEnabled: string;
  firstName: string;
  lastName: string;
  addresses:  string;
  avatar: {
    url: string,
    thumbnailUrl: string;
  },
  phoneNumber: string;
}

export type UserState =  {
  firstName?: string,
  lastName?: string,
  phoneNumber?: string,
  role: 'user',
  isVerified: boolean;
  addresses: Array<AddressType>,
  avatar: {
    url: string,
    thumbnailUrl: string,
  },
  tokens: {
    accessToken: string,
    refreshToken: string,
  },
  isLoggedIn: boolean,
  checkout: CheckoutType,
}

const initialState: UserState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  role: 'user',
  isVerified: null,
  avatar: null,
  tokens: null,
  isLoggedIn: false,
  addresses: null,
  checkout: null,
};

export type LoginUserActionPayload = {
  accessToken: string,
  refreshToken: string
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_USER:
      const loginUserPayload: LoginUserActionPayload = action.payload;
      let loginUserState = Object.assign({}, state);
      loginUserState = {
        ...loginUserState,
        role: action.payload.role || 'user',
        tokens: {
          accessToken: loginUserPayload.accessToken,
          refreshToken: loginUserPayload.refreshToken,
        },
        avatar: {
          url: action.payload.avatar?.url,
          thumbnailUrl: action.payload.avatar?.thumbnailUrl,
        },
        isLoggedIn: true,
      };
      return loginUserState;
    case LOG_OUT_USER:
      let emptyUserState = Object.assign({}, state);
      emptyUserState = initialState;
      emptyUserState.isLoggedIn = false;
      return emptyUserState;
    case CREATE_CHECKOUT:
      // create a new checkout from a cart
      // PS: notice that checkoutId and cartId are the same
      const createCheckoutPayload: CartType = action.payload;
      let createCheckoutState = Object.assign({}, state);
      createCheckoutState = {
        ...createCheckoutState,
        checkout: {
          ...createCheckoutState.checkout,
          id: createCheckoutPayload.id,
          total: createCheckoutPayload.total,
          count: createCheckoutPayload.count,
          items: createCheckoutPayload.items,
        }
      }
      return createCheckoutState;
    case DELETE_CHECKOUT:
      let deleteCheckoutState = Object.assign({}, state);
      // delete everything from the checkout
      // apart from delivery location and metadata
      deleteCheckoutState = {
        ...deleteCheckoutState,
        checkout: {
          ...deleteCheckoutState.checkout,
          id: null,
          total: null,
          count: 0,
          items: null,
        }
      };
      return deleteCheckoutState;
    case REFRESH_SESSION:
      let refreshSessionState = Object.assign({}, state);
      refreshSessionState = {
        ...refreshSessionState,
        tokens: {
          ...refreshSessionState.tokens,
          accessToken: action.payload.accessToken,
        },
      }

      return refreshSessionState;
    case SAVE_CHECKOUT_ADDRESS:
      let gotUserInfoState = Object.assign({}, state);
      const gotUserInfoPayload = action.payload;
      gotUserInfoState = {
        ...gotUserInfoState,
        checkout: {
          ...gotUserInfoState.checkout,
          delivery: {
            cost: null,
            address: {
              ...gotUserInfoPayload.address
            }
          }
        }
      }
      return gotUserInfoState;
    case SAVE_SHIPPING_QUOTE:
      let quoteState = Object.assign({}, state);
      const saveShippingPayload = action.payload
      quoteState = {
        ...quoteState,
        checkout: {
          ...quoteState.checkout,
          delivery: {
            ...quoteState.checkout.delivery,
            cost: saveShippingPayload.cost,
            courierOrderNo: saveShippingPayload.courierOrderNo
          }
        }
      }
      return quoteState;
    case SAVE_ZOOM_LEVEL:
      let saveZoomLevelState = Object.assign({}, state);
      const zoomLevelPayload: {level: number} = action.payload;
      saveZoomLevelState = {
        ...saveZoomLevelState,
        checkout: {
          ...saveZoomLevelState.checkout,
          meta: {
            zoomLevel: zoomLevelPayload.level
          }
        }
      }
      return saveZoomLevelState;
    default:
      return state;
  }
};
