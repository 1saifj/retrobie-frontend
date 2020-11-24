import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {env} from '../config';
import {refreshSessionAction} from '../state/actions';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {UserState} from '../state/reducers/userReducers';
import {AuthenticatedUser} from '../types';
import jwtDecode from 'jwt-decode';
import CONSTANTS from '../constants';

function isExpiredOrCloseToExpiry(token: string) {
  const decoded: AuthenticatedUser = jwtDecode(token);
  const expiryTime =  decoded.exp * 1000;
  return expiryTime < 0 || (expiryTime - Date.now() < 60 * 1000);
}

// when we
let gettingTokenPromise = null;

/**
 * This serves as a replacement for useApi.
 * <br/>
 *
 * NOTE: Every exported function in this hook is a thunk.
 */
export default function() {

  const dispatch = useDispatch();
  const userState: UserState = useSelector((state: RootStateOrAny) => state.user);

  /**
   * Get a new access token
   * @param expiredToken
   * @param refreshToken
   */
  async function getFreshToken({expiredToken, refreshToken}): Promise<{accessToken: string}> {
    // if there is no other request underway
    if (gettingTokenPromise == null) {
      // create and assign a new request
      gettingTokenPromise = axios.post(`${env.getApiBaseUrl()}/auth/session/refresh`, {
        expiredToken,
      }, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }).then(({data}) => {
        // set the
        gettingTokenPromise = null;
        dispatch(refreshSessionAction({accessToken: data.accessToken}));
        return Promise.resolve(data);
      }).catch(err => {
        gettingTokenPromise = null;
        // todo?
        throw err;
      });
    }

    // otherwise, return the underway request
    return gettingTokenPromise;
  }

  /**
   * Returns the Bearer together with a fresh access
   * token if the current one is almost stale.
   */
  async function getBearer(): Promise<string> {
    const {accessToken, refreshToken} = userState.tokens;
    // if both the access token and refresh token are available in state
    if (accessToken && refreshToken) {
      if (isExpiredOrCloseToExpiry(accessToken)) {
        // if (isExpiredOrCloseToExpiry(refreshToken)) {
        //   // todo: logout
        // }

        // if the access token is expired or close to expiry
        // get a new access token from the server
        const {accessToken: newAccessToken} = await getFreshToken({
          expiredToken: accessToken,
          refreshToken,
        });
        return `Bearer ${newAccessToken}`;
      } else {
        return `Bearer ${accessToken}`;
      }
    }

    return undefined;
  }


  const getAxis: () => Promise<AxiosInstance> =
    async () => {
      const bearer = await getBearer();
      const axis = axios.create({
        baseURL: env.getApiBaseUrl(),
        headers: {
          Authorization: bearer,
        },
      });
      axis.interceptors.response.use(
        value => value,
        err => {
          if (err.response?.status === 401) {
            console.log('Got 401 error');
          }
          return err;
        },
      );
      return axis;
    };

  const orders = {
    getAll: ()=> async () => (await getAxis()).get(`/orders/all`),
    getSingle: (uuid)=> async () => (await getAxis()).get(`/orders/${uuid}`),
    new: (data)=> async () => (await getAxis()).post('/orders/new', data),
    mine: (params)=> async ()=> (await getAxis()).get(`/orders/mine?include=${params}`),
  };

  const payments = {
    initiateMpesaOnlinePayment: data => async () =>
      (await getAxis()).post('/payments/mpesa/pay-online/initiate', data)
  };


  const imageKit = {
    getSignature: ()=> async () => (await getAxis()).get(`/auth/imagekit/signature`),
    upload: (data)=> async () => axios.post(CONSTANTS.IMAGEKIT_URL, data),
    delete: (data)=> async () => (await getAxis()).delete(`https://api.imagekit.io/v1/files/${data.fileId}`),
  };


  /**
   * Use this to access all methods related to the '/brands' route
   * @param name
   * @return {{getSingle: (function(): Promise<AxiosResponse<*>>), getAll: (function(): Promise<AxiosResponse<*>>), get: (function(): Promise<AxiosResponse<*>>), create: (function(Object): Promise<AxiosResponse<*>>), updateImage: (function(*): Promise<AxiosResponse<any>>), getProducts: (function(): Promise<AxiosResponse<*>>)}}
   */
  const brands = {
    /**
     * Get all products
     * @returns {Promise<AxiosResponse<any>>}
     */
    getAll: ()=> async () => (await getAxis()).get(`/brands/all`),
    /**
     * Get a single brand
     * @returns {Promise<AxiosResponse<any>>}
     */
    getSingle: ()=> ()=> async (name) => (await getAxis()).get(`/brands/${name}/info`),
    /**
     * Get a single brand's products
     * @returns {Promise<AxiosResponse<any>>}
     */
    getProducts: ()=> async (name) => (await getAxis()).get(`/brands/${name}/products`),
    updateImage: ()=> async uuid => (await getAxis()).put(`/brands/images/${uuid}`),
    /**
     * Create a single brand
     * @param {object}data
     * @returns {Promise<AxiosResponse<any>>}
     */
    create: (data)=> async () => (await getAxis()).post(`/brands/new`, data),
  };
  const products = {
    getAll: ()=> async () => (await getAxis()).get('/products/all'),
    getFeatured: ()=> async () => (await getAxis()).get('/products/popular'),
    getSingle: (id)=> async () => (await getAxis()).get(`/products/${id}`),
    get: (id)=> async () => (await getAxis()).get(`/products/${id}`),
    create: (data)=> async () => (await getAxis()).post('/products/new', data),
    update: (id, data)=> async () => (await getAxis()).put(`/products/${id}/update`, data),
  };

  const accounts = {
    register: (data)=> async () => (await getAxis()).post('auth/register', data),
    requestPasswordReset: (data)=> async () => (await getAxis()).post('auth/request-password-reset', data),
    resetPassword: (data)=> async () => (await getAxis()).post('auth/reset-password', data),
    verify: (data)=> async () => (await getAxis()).post('auth/verify-account', data),
    me: ()=> async ()=> (await getAxis()).get('accounts/me'),
    login: (data)=> async () => (await getAxis()).post('auth/login', data),
    logOut: (data: {accessToken: string})=> async () => (await getAxis()).post("/accounts/logout", data),
    check: ()=> async () => (await getAxis()).get('auth/check'),
  };

  async function ping() {
    return (await getAxis()).get('up');
  }

  return {
    accounts,
    brands,
    imageKit,
    orders,
    payments,
    products,
    ping,
  };
};