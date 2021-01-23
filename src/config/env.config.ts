class Env {
  getApiHost() {
    return this.isDev()
      ? 'http://localhost:2500/api'
      : this.isStaging
      ? 'https://api.staging.retrobie.com/api'
      : 'https://api.retrobie.com/api';
  }

  getApiVersion() {
    return 'v2';
  }

  getClientBaseUrl() {
    return "https://retrobie.com"
  }

  getApiBaseUrl() {
    return `${this.getApiHost()}/${this.getApiVersion()}/`;
  }

  getEnvironment() {
    return process.env.NODE_ENV;
  }

  isDev() {
    return process.env.NODE_ENV === 'development';
  }

  isStaging() {
    return (
      window.location.hostname.includes('netlify') || window.location.hostname.includes('vercel')
    );
  }
}

export default Env;
