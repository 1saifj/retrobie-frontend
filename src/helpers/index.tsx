import slugify from './slugify';
import axios from 'axios';
import {env} from '../config';


export function formatNumberWithCommas(x: number): string {
  return x.toLocaleString('en-KE', {
    currency:'Ksh',
    minimumSignificantDigits: 2
  })
}

export function addDashes(phoneNumber) {
  if (phoneNumber) {
    const value = phoneNumber.replace(/\D[^\.]/g, '');
    return value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
  }

  return undefined;
}

export function findIndexWithAttr(array, attr, value) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

export function capitalize(str) {
  if (str && typeof str === 'string') return str.charAt(0).toUpperCase() + str.substring(1);

  return '';
}


/**
 * Use this method to get images uploaded to Imagekit but
 * not to our servers yet.
 * @param str - a unique id
 * @returns {[*]}
 */

/**
 * This function replaces a certain string from the input string throughout the whole word.
 * @param {string} input - the input string
 * @param {string} replaceWith - the string to be replaced
 * @returns {string} - string without replaced character
 */
export function replaceNonAlphanumeric(input, replaceWith) {
  return input.replace(/\W/g, replaceWith);
}

/**
 * This function looks for any consecutive non-alphanumeric characters and replaces them with an empty string.
 * @param {string} str - the string input
 * @returns {string}
 */
export const removeConsecutiveNonAlphanumericChars = str => {
  return str.replace(/(\W)\1+/g, '$1');
};

export function cleanString(str, replaceWith) {
  if (str)
    return removeConsecutiveNonAlphanumericChars(replaceNonAlphanumeric(str, replaceWith || ''));
}

/**
 * Creates a slug. Removes all spaces and non-alphanumeric characters, replacing then with a single hyphen.
 * <br/>
 * <br/>
 * A string like "st george s school" would end up as "st-georges-school"
 * @param {string} name
 * @returns {string}
 */
export {slugify};

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function deleteAllCookies() {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

function dec2hex(dec) {
  return dec < 10 ? '0' + String(dec) : dec.toString(16);
}

export function generateRandomString(len) {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}

export function extractErrorMessage(e) {
  if (!e) return;

  // Check if it has an axios response
  if (e.response?.data?.message) {
    // and return the message if it exists
    return e.response.data.message;
  } else {
    // check if the user is online
    if (!navigator.onLine) {
      return 'Please connect to the internet and try again.';
    }

    // if the error object has its own message, return it
    if (e.code) {
      console.log("Error code")
      // timeout error
      if (e.code === 'ECONNABORTED') {
        return "Could not process your request at this time. Please try again in a minute or so.";
      }
    }

    if (e.message) {
      return e.message;
    }

    // otherwise, ping api
    axios.get(`${env.getApiBaseUrl()}/up`)
      .then(({data})=> {
        if (!data || data.message.toLowerCase() !== 'ok') {
          return 'Could not reach the server. Please try again in a few minutes.';
        }

        return 'Up';
      }).catch(e=> {

      return e.message;
    });

    return 'An unknown error occurred. Please try again later.';
  }
}

class DefaultHelpers {
  /**
   * Returns the diff of two objects.
   * Note: this doesn't compare arrays.
   * @param obj1
   * @param obj2
   * @returns {{}}
   */
  objectDiff<T>(obj1: T, obj2: T): Partial<T> {
    return Object.keys(obj2).reduce((diff, key) => {
      if (obj1[key] === obj2[key]) return diff;
      return {
        ...diff,
        [key]: obj2[key],
      };
    }, {});
  }

  /**
   * Simple method to compare whether two arrays are equal.
   * @param arr1
   * @param arr2
   * @returns {boolean}
   */
  arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }
}

const defaultHelpers = new DefaultHelpers();

export default defaultHelpers;