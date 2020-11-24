//@ts-ignore
import axios, {AxiosResponse} from 'axios';
import CONSTANTS from '../constants';
import {env} from '../config';
import React, {useCallback} from 'react';

/**
 * @deprecated use {@link useAuth} instead
 */
export default function useApi() {

  let axis = useCallback(()=> {
    return axios.create({
      baseURL: env.getApiBaseUrl(),
      timeout: 30000,
    });
  }, [])();


  const orders = {
    getAll: () => axis.get(`/orders/all`),
    getSingle: uuid => axis.get(`/orders/${uuid}`),
    new: data => axis.post('/orders/new', data),
    mine: params => axis.get(`/orders/mine?include=${params}`),
  };


  const options = {
    setAccessToken: (accessToken) => {
      const newAxis = Object.assign({}, axis);
      // don't do anything if an access token is not provided
      if (accessToken === undefined) return undefined;

      // if provided with a null value, we probably
      // want to get rid of the authorization header
      if (accessToken === null) {
        delete newAxis.defaults.headers['Authorization'];
        return newAxis;
      }

      // if not null or undefined, set the token normally
      newAxis.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
      return newAxis;
    },

  };


  const payments = {
    async initiateMpesaOnlinePayment(data) {
      return axis.post('/payments/mpesa/pay-online/initiate', data);
    },
  };


  const imageKit = {
    getSignature: () => axis.get(`/auth/imagekit/signature`),
    upload: data =>
      axis.post(CONSTANTS.IMAGEKIT_URL, data, {
        headers: {
          Authorization: undefined,
        },
      }),
    delete: data => axis.delete(`https://api.imagekit.io/v1/files/${data.fileId}`),
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
    getAll: () => axis.get(`/brands/all`),
    /**
     * Get a single brand
     * @returns {Promise<AxiosResponse<any>>}
     */
    getSingle: (name) => axis.get(`/brands/${name}/info`),
    /**
     * Get a single brand's products
     * @returns {Promise<AxiosResponse<any>>}
     */
    getProducts: (name) => axis.get(`/brands/${name}/products`),
    updateImage: uuid => axis.put(`/brands/images/${uuid}`),
    /**
     * Create a single brand
     * @param {object}data
     * @returns {Promise<AxiosResponse<any>>}
     */
    create: data => axis.post(`/brands/new`, data),
  };
  const products = {
    getAll: () => axis.get('/products/all'),
    getFeatured: () => axis.get('/products/popular'),
    getSingle: id => axis.get(`/products/${id}`),
    get: (id) => axis.get(`/products/${id}`),
    create: data => axis.post('/products/new', data),
    update: (id, data) => axis.put(`/products/${id}/update`, data),
  };

  const accounts = {
    register: data => axis.post('auth/register', data),
    requestPasswordReset: data => axis.post('auth/request-password-reset', data),
    resetPassword: data => axis.post('auth/reset-password', data),
    verify: data => axis.post('auth/verify-account', data),
    me: () => {
      // console.log('State tokens ', userState.tokens);
      // console.log("Using headers ", axis.defaults.headers)
      return axis.get('accounts/me');
    },
    login: data => axis.post('auth/login', data),
    logOut: () => options.setAccessToken(null),
    check: () => axis.get('auth/check'),
  };

  async function ping() {
    return axis.get('up');
  }

  return {
    axis,
    accounts,
    brands,
    imageKit,
    orders,
    payments,
    products,
    ping,
  };
}

