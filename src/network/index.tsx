import axios from 'axios';
import {env} from '../config';

// @deprecated
export const axis = axios.create({
  baseURL: env.getApiBaseUrl(),
  timeout: 30000,
});

export {useApi} from '../hooks';
