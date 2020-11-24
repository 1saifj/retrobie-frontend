import {
  CREATE_CHECKOUT,
  DELETE_CHECKOUT,
  LOG_IN_USER,
  LOG_OUT_USER,
  REFRESH_SESSION,
} from '../actions/constants';
import {CartType} from '../../types';

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
  avatar: {
    url: string,
    thumbnailUrl: string,
  },
  tokens: {
    accessToken: string,
    refreshToken: string,
  },
  isLoggedIn: boolean,
  checkout: CartType,
}

const initialState: UserState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  role: 'user',
  avatar: {
    url: '',
    thumbnailUrl: '',
  },
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  isLoggedIn: false,
  checkout: {
    id: null,
    total: 0,
    count: 0,
    items: []
  },
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
      const createCheckoutPayload = action.payload;
      let createCheckoutState = Object.assign({}, state);
      createCheckoutState = {
        ...createCheckoutState,
        checkout: {
          id: createCheckoutPayload.id,
          total: createCheckoutPayload.total,
          count: createCheckoutPayload.count,
          items: createCheckoutPayload.items,
        }
      }
      return createCheckoutState;
    case DELETE_CHECKOUT:
      let deleteCheckoutState = Object.assign({}, state);
      deleteCheckoutState = {
        ...deleteCheckoutState,
        // @ts-ignore
        checkout: {}
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
    default:
      return state;
  }
};
