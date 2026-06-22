const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const { pRateLimit } = require("p-ratelimit");
require("dotenv").config();

const PACK_CVES_URL = "https://dso.teams.spectrocloud.com";

// Ensure that the authentication token is available in the environment
const authToken = process.env.DSO_AUTH_TOKEN;
const DISABLE_SECURITY_INTEGRATIONS = process.env.DISABLE_SECURITY_INTEGRATIONS || "";

// If the required environment variable is not set, throw an error
if (!authToken && DISABLE_SECURITY_INTEGRATIONS.toLowerCase() !== "true") {
  throw new Error("DSO_AUTH_TOKEN must be set in the environment to use this plugin.");
}

const api = axios.create({
  baseURL: PACK_CVES_URL,
  timeout: 120000, // 2 minutes timeout
  headers: {
    "Content-Type": "application/json",
    Authorization: "Basic " + authToken, // Use the environment variable for auth token
  },
});

// Set up rate limiting using pRateLimit
const limit = pRateLimit({
  interval: 2000, // 2 seconds
  rate: 20, // 20 API calls per interval
  concurrency: 20, // no more than 20 running at once
});

axiosRetry(api, {
  retries: 3, // Retry up to 3 times
  retryDelay(retryCount, error) {
    // Honor the server's Retry-After header on 429 responses when present.
    const retryAfter = error.response?.headers?.["retry-after"];

    if (retryAfter) {
      const seconds = Number(retryAfter);

      if (!Number.isNaN(seconds)) {
        return seconds * 1000;
      }

      const dateMs = Date.parse(retryAfter);

      if (!Number.isNaN(dateMs)) {
        return Math.max(0, dateMs - Date.now());
      }
    }

    // Otherwise fall back to exponential backoff starting with 1 second.
    return axiosRetry.exponentialDelay(retryCount, error);
  },
  retryCondition(error) {
    // Retry on transient network errors and timeouts (POST requests are not
    // retried on these by default).
    if (axiosRetry.isNetworkError(error) || error.code === "ECONNABORTED") {
      return true;
    }

    // Retry on transient server-side and rate-limit status codes.
    return [500, 501, 502, 503, 504, 429].includes(error.response?.status);
  },
});

// Function to handle API calls with rate limiting
function callRateLimitAPI(delayedApiCall) {
  return limit(delayedApiCall);
}

module.exports = { api, callRateLimitAPI };
