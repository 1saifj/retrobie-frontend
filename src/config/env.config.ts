import dotenv from 'dotenv';
dotenv.config();

/**
 * The NODE_ENV attribute is set automatically by React. It can only be 'production', 'test' or 'development'.
 * As such, it's not necessary to set these values in their respective environments.
 *
 * Since React doesn't allow us to change these values, and we need a way to identify the 'staging'
 *  environment, the REACT_APP_ENV variable is used for that purpose.
 */

const process = {
  env: {
    REACT_APP_ENV: undefined,
    NODE_ENV: undefined,
  },
};

class Env {
  getApiHost() {
    return 'http://localhost:2500/api';
  }

  getApiVersion() {
    return 'v2';
  }

  getClientBaseUrl() {
    return 'https://retrobie.com';
  }

  getApiBaseUrl() {
    return `${this.getApiHost()}/${this.getApiVersion()}`;
  }

  /**
   * Get the current environment. It returns NODE_ENV if REACT_APP_ENV is not set
   */
  getEnvironment() {
    return process.env.REACT_APP_ENV || process.env.NODE_ENV;
  }

  isDev() {
    return this.getEnvironment() === 'development';
  }

  isStaging(location) {
    return (
      process.env.REACT_APP_ENV === 'staging' ||
      location.hostname.includes('netlify') ||
      location.hostname.includes('vercel') ||
      location.hostname.includes('dev.retrobie')
    );
  }

  isProduction() {
    // return process.env.NODE_ENV === 'production';
    return false;
  }
}

export default Env;
