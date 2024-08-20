import axios from "axios";
import axiosRetry from "axios-retry";
import { pRateLimit } from "p-ratelimit";
import { SECURITY_BULLETIN_URL } from "../../../static/scripts/constants";

const authToken = process.env.DSO_AUTH_TOKEN;
if (!authToken) {
  throw new Error("DSO_USERNAME and DSO_PASSWORD must be set in the environment to use this plugin.");
}

const api = axios.create({
  baseURL: SECURITY_BULLETIN_URL,
  timeout: 120000, // 2 minutes
  headers: {
    "Content-Type": "application/json",
    Authorization: "Basic " + process.env.DSO_AUTH_TOKEN,
  },
});

const limit = pRateLimit({
  interval: 2000, // 1000 ms == 1 second
  rate: 10, // 10 API calls per interval
  concurrency: 1, // no more than 1 running at once
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
  return limit(delayedApiCall);
}

module.exports = { api, callRateLimitAPI };
