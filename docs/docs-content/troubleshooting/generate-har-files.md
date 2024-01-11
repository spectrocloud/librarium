---
sidebar_label: "Generate a HAR File"
title: "Generate HTTP Archive Files for Troubleshooting"
description: "Learn how to generate and sanitize HAR files to speed up issue resolution."
sidebar_position: 70
tags: ["troubleshooting", "har", "support"]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleStop, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faBan, faPause, faPlay, faGear } from '@fortawesome/free-solid-svg-icons';
import RecordNetworkLog from '/src/components/CustomIcons/RecordNetworkLog';

When you encounter page performance or rendering issues in Palette, we may ask you to generate an HTTP Archive (HAR) file to help us identify and resolve those issues.

:::caution
HAR files contain all network activity for a specific page, including sensitive and confidential information, such as API keys, secrets, cookies, passwords, and more. Before sending your HAR files to us, sanitize the sensitive data. We do not recommend using any third-party tools for HAR sanitization, as they can overlook some details.
:::

This guide explains how you can generate HAR files in Chrome, Safari, and Firefox and sanitize the sensitive data they contain.

## Generate HAR Files

<Tabs>
  <TabItem value="chrome" label="Chrome" default>
    1. Open the page with issues in Chrome.
    2. On your keyboard, open Developer Tools:
       - For Windows and Linux, press **F12** or **Ctrl + Shift + I**.
       - For Mac, press **Fn + F12** or **Cmd + Option + I**.

       For alternative methods to open Developer Tools, refer to [Open Chrome DevTools](https://developer.chrome.com/docs/devtools/open).
    3. In Developer Tools, select the **Network** tab. Then, on the **Network** pane:
       - Toggle <RecordNetworkLog /> to <FontAwesomeIcon icon={faCircleStop} color={"#E46962"} /> to start recording network activity.
       - Click <FontAwesomeIcon icon={faBan} rotation={270} /> to clear the current network log.
       - Select the **Preserve log** and **Disable cache** checkboxes.

       ![](/assets/docs/images/troubleshooting/generate-har-files/chrome-dev-tools-settings.png)
    4. On the page, reproduce the issues you've encountered.
    5. In the network log, right-click any item and select **Save all as HAR with content**.
  </TabItem>
  <TabItem value="safari" label="Safari">
    1. If you haven't yet, [enable the web development features in Safari](https://developer.apple.com/documentation/safari-developer-tools/enabling-developer-features).
    2. Open the page with issues.
    3. On your keyboard, press **⌥ + ⌘ + I** to open Web Inspector.
    4. Select the **Network** tab, and, in the **Network** tab menu:
       - Press **⌘ + K** to clear the current network items.
       - Next to the **All** drop-down menu, click the **Other filter options** icon > **Preserve Log**. 
       - Select the **Disable Caches** checkbox.

       ![](/assets/docs/images/troubleshooting/generate-har-files/safari-web-inspector.png)
    5. On the page, reproduce the issues you've encountered.
    6. In the **Network** tab menu, select **Export**.
  </TabItem>
  <TabItem value="firefox" label="Firefox">
    1. Open the page with issues in Firefox.
    2. On your keyboard, open Developer Tools:
       - For Windows and Linux, press **F12** or **Ctrl + Shift + I**.
       - For Mac, press **Fn + F12** or **Cmd + Option + I**.

       For alternative methods to open Developer Tools, refer to [Firefox DevTools User Docs](https://firefox-source-docs.mozilla.org/devtools-user/).
    3. In Developer Tools, select the **Network** tab and, in the **Network** tab menu:
       - Select <FontAwesomeIcon icon={faTrashCan} /> to clear the current network log.
       - Toggle <FontAwesomeIcon icon={faPlay} color={"#007AFF"} /> to <FontAwesomeIcon icon={faPause} /> to start recording network activity.
       - Select <FontAwesomeIcon icon={faGear} /> > **Persist Logs**. 

       ![](/assets/docs/images/troubleshooting/generate-har-files/firefox-devtools.png)
    4. On the page, reproduce the issues you've encountered.
    5. In the network log, right-click any item and select **Save All As HAR**.
  </TabItem>
</Tabs>

## Sanitize HAR Files

1. Open the generated HAR file in a text editor.
2. Carefully examine the file contents and either remove or redact sensitive information.
   
   You can use the following keywords for reference:
   
    :::caution
    This list is not exhaustive. You should also check for data that is considered sensitive or confidential within your organization.
    :::

   - **state**
   - **shdf**
   - **usg**
   - **password**
   - **code**
   - **code_verifier**
   - **client_secret**
   - **token**
   - **Access_token**
   - **refresh_token**
   - **authenticity_token**
   - **Id_token**
   - **SAMLResponse**
   - **SAML Request**
   - **appID**
   - **challenge**
   - **facetID**
   - **assertion**
   - **fcParams**
   - **serverData**
   - **Authorization**
   - **auth**
   - **key**
   - **pem**
   - **rsa**
   - **dsa**
   - **ecdsa**
   - **signature**
   - **passkey**

Consider the following examples of how to approach redacting passwords, tokens, and cookies.

### Password Example

```json
  "postData": {
    "mimeType": "application/json",
    // highlight-next-line
    "text": "{\"emailId\":\"REDACTED\",\"password\":\"REDACTED\",\"org\":\"spectro-cloud\"}"
  }
```

### Token Example

```json
  "queryString": [
    {
      "name": "access_token",
    // highlight-next-line
      "value": "REDACTED"
    }
  ],
```

### Cookie Example

```json
  "cookies": [
    {
      "name": "__stripe_mid",
      // highlight-next-line
      "value": "REDACTED",
      "path": "/",
      "domain": "console.spectrocloud.com",
      "expires": "2025-01-10T20:51:03.000Z",
      "httpOnly": false,
      "secure": true,
      "sameSite": "Strict"
    },
  ]
```