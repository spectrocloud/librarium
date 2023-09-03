/* eslint-disable no-prototype-builtins */
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}

// set „denied" as default for both ad and analytics storage,
gtag("consent", "default", {
  ad_storage: "denied",
  analytics_storage: "denied",
  wait_for_update: 2000, // milliseconds to wait for update
});

// Enable ads data redaction by default [optional]
gtag("set", "ads_data_redaction", true);

(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != "dataLayer" ? "&l=" + l : "";
  j.async = true;
  j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "GTM-T2F9ZMS");

// Please replace 'ucEvent' with the event you have just created
window.addEventListener("ucEvent", function (e) {
  if (e.detail && e.detail.event == "consent_status") {
    // Please replace the analytics service name here with the customized service
    var ucAnalyticsService = "Google Analytics";
    // Please replace the ad service name here with the customized service
    var ucAdService = "Google Ads Remarketing";

    if (e.detail.hasOwnProperty(ucAnalyticsService) && e.detail.hasOwnProperty(ucAdService)) {
      gtag("consent", "update", {
        ad_storage: e.detail[ucAdService] ? "granted" : "denied",
        analytics_storage: e.detail[ucAnalyticsService] ? "granted" : "denied",
      });
    } else {
      if (e.detail.hasOwnProperty(ucAdService)) {
        gtag("consent", "update", {
          ad_storage: e.detail[ucAdService] ? "granted" : "denied",
        });
      }
      if (e.detail.hasOwnProperty(ucAnalyticsService)) {
        gtag("consent", "update", {
          analytics_storage: e.detail[ucAnalyticsService] ? "granted" : "denied",
        });
      }
    }
  }
});
