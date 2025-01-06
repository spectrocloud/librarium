const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const { pRateLimit } = require("p-ratelimit");
require("dotenv").config();

const SECURITY_BULLETIN_URL = "https://dso.teams.spectrocloud.com";

// Ensure that the authentication token is available in the environment
const authToken = process.env.DSO_AUTH_TOKEN;
const DISABLE_SECURITY_INTEGRATIONS = process.env.DISABLE_SECURITY_INTEGRATIONS.toLocaleLowerCase();

// If the required environment variable is not set, throw an error
if (!authToken && DISABLE_SECURITY_INTEGRATIONS !== "true") {
  throw new Error("DSO_AUTH_TOKEN must be set in the environment to use this plugin.");
}

const api = axios.create({
  baseURL: SECURITY_BULLETIN_URL,
  timeout: 120000, // 2 minutes timeout
  headers: {
    "Content-Type": "application/json",
    Authorization: "Basic " + authToken, // Use the environment variable for auth token
  },
});

// Set up rate limiting using pRateLimit
const limit = pRateLimit({
  interval: 2000, // 2 seconds
  rate: 10, // 10 API calls per interval
  concurrency: 1, // no more than 1 running at once
});

axiosRetry(api, {
  retries: 3, // Retry up to 3 times
  retryDelay: axiosRetry.exponentialDelay, // Exponential backoff starting with 1 second
  retryCondition(error) {
    // Retry based on status codes
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

// Function to handle API calls with rate limiting
function callRateLimitAPI(delayedApiCall) {
  return limit(delayedApiCall);
}

module.exports = { api, callRateLimitAPI };
