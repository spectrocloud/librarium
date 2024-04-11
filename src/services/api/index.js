import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: 'https://dev.spectrocloud.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    "ApiKey": "NGU5MTNhNjBhNzM4OWI1ZTc0N2M5ZmQ0NDI1ZTk4ZTc=",
  }
});

axiosRetry(api, {
  retries: 3,
  retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 1000),
  retryCondition(error) {
    console.log("error === ", error);
    switch (error.response.status) {
      case 500:
      case 501:
      case 429:
        return true;
      default:
        return false;
    }
  },
});


module.exports = api;
