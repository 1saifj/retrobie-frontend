import dotenv from 'dotenv';
dotenv.config();

/**
 * The NODE_ENV attribute is set automatically by React. It can only be 'production', 'test' or 'development'.
 * As such, it's not necessary to set these values in their respective environments.
 *
 * Since React doesn't allow us to change these values, and we need a way to identify the 'staging'
 *  environment, the REACT_APP_ENV variable is used for that purpose.
 */

class Env {
  getApiHost() {
    return this.isStaging()
      ? 'https://api.staging.retrobie.com/api'
      : this.isDev()
      ? 'http://localhost:2500/api'
      : 'https://api.retrobie.com/api';
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
    return process.env.NODE_ENV === 'development';
  }

  isStaging() {
    return (
      process.env.REACT_APP_ENV === 'staging' ||
      window.location.hostname.includes('netlify') ||
      window.location.hostname.includes('vercel') ||
        window.location.hostname.includes("dev.retrobie")
    );
  }

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }
}

export default Env;
