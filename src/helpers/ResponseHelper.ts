import axios from 'axios';
import {env} from '../config';

class ResponseHelper {
  extractErrorMessage(e) {
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


}

const responseHelper = new ResponseHelper();

export default responseHelper;

