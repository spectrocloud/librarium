import axios from 'axios';
import axiosRetry from 'axios-retry';
import { pRateLimit } from 'p-ratelimit';

const api = axios.create({
  baseURL: 'https://console.spectrocloud.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    "ApiKey": process.env.API_KEY,
  }
});

const limit = pRateLimit({
  interval: 2000,             // 1000 ms == 1 second
  rate: 10,                   // 10 API calls per interval
  concurrency: 10,            // no more than 10 running at once
});

axiosRetry(api, {
  retries: 3,
  retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 1000),
  retryCondition(error) {
    switch (error.response?.status) {
      case 500:
      case 404:
      case 501:
      case 429:
        return true;
      default:
        return false;
    }
  },
});


function callRateLimitAPI(delayedApiCall) {
  return limit(delayedApiCall)
}

module.exports = { api, callRateLimitAPI };
