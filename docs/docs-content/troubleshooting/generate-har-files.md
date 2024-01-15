---
sidebar_label: "Generate HAR Files"
title: "Generate and Sanitize HTTP Archive Files"
description: "Learn how to generate and sanitize HAR files to speed up issue resolution."
sidebar_position: 70
tags: ["troubleshooting", "har", "support"]
---

When you report issues with Palette to Spectro Cloud Support, we may ask you to generate an HTTP Archive (HAR) file to help us identify and resolve those issues.

:::caution
HAR files contain all network activity for a specific page, including sensitive and confidential information, such as API keys, secrets, cookies, passwords, and more. Before sending your HAR files to us, sanitize the sensitive data. We do not recommend using any third-party tools for HAR sanitization, as they can overlook some details.
:::

This guide explains how you can generate HAR files in Chrome, Safari, and Firefox and sanitize the sensitive data they contain.

## Prerequisites

- A browser of choice. For instance, you could use Chrome, Safari, or Firefox. If you're using Safari, make sure to [enable its web development features](https://developer.apple.com/documentation/safari-developer-tools/enabling-developer-features) first.
- A text editor of choice. For example, you could use [Visual Studio Code](https://code.visualstudio.com/) or [Sublime](https://www.sublimetext.com/).

## Generate and Sanitize HARs

### Generate HAR Files

<Tabs>
  <TabItem value="chrome" label="Chrome" default>
    1. Open the page with issues in Chrome.
    2. On your keyboard, open Developer Tools:
       - For Windows and Linux, press **F12** or **Ctrl + Shift + I**.
       - For Mac, press **Fn + F12** or **Cmd + Option + I**.

       For alternative methods to open Developer Tools, refer to [Open Chrome DevTools](https://developer.chrome.com/docs/devtools/open).
    3. In Developer Tools, select the **Network** tab, and, on the **Network** pane:
        1. If the leftmost icon displays a circle within a circle, click it to start recording network activity.
        2. Click the **Clear network log** icon that follows it to clear the current network log.
        3. Select the **Preserve log** and **Disable cache** checkboxes.

       ![View of the configured Chrome Developer Tools](/troubleshooting_generate-har-files_chrome-dev-tools-settings.png.png)

    4. On the page, reproduce the issues you've encountered.
    5. In the network log, right-click any item and select **Save all as HAR with content**.

  </TabItem>
  <TabItem value="safari" label="Safari">
    1. Open the page with issues in Safari.
    2. On your keyboard, press **⌥ + ⌘ + I** to open Web Inspector.
    3. Select the **Network** tab, and, in the **Network** tab menu:

       1. Press **⌘ + K** to clear the current network items.
       2. Next to the **All** drop-down menu, click the **Other filter options** icon > **Preserve Log**.
       3. Select the **Disable Caches** checkbox.

       ![View of the configured Safari Web Inspector](/troubleshooting_generate-har-files_safari-web-inspector.png)

    4. On the page, reproduce the issues you've encountered.
    5. In the **Network** tab menu, select **Export**.

  </TabItem>
  <TabItem value="firefox" label="Firefox">
    1. Open the page with issues in Firefox.
    2. On your keyboard, open DevTools:
       - For Windows and Linux, press **F12** or **Ctrl + Shift + I**.
       - For Mac, press **Fn + F12** or **Cmd + Option + I**.

       For alternative methods to open DevTools, refer to [Firefox DevTools User Docs](https://firefox-source-docs.mozilla.org/devtools-user/).

    3. In DevTools, select the **Network** tab and, in the **Network** tab menu:

       1. Click the trash can icon to clear the current network log.
       2. If the icon next to the **Filter URLs** field displays a play button, click it to start recording network activity.
       3. Click the **Network Settings** icon > **Persist Logs**.

       ![View of the configured Firefox DevTools](/troubleshooting_generate-har-files_firefox-devtools.png)

    4. On the page, reproduce the issues you've encountered.
    5. In the network log, right-click any item and select **Save All As HAR**.

  </TabItem>
</Tabs>

### Sanitize HAR Files

1. Open the generated HAR file in a text editor.
2. Carefully examine the file contents and either remove or redact sensitive information.

   :::tip
   If you're using a built-in search feature, ensure it's case-insensitive and check every instance of confidential data it highlights.
   :::

You can use the following keywords for reference.

<details>
<summary>Keywords for sanitization</summary>

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

</details>

Consider the following examples of how to approach redacting passwords, tokens, and cookies.

<Tabs>
  <TabItem value="passwords" label="Passwords" default>
    ```json
      "postData": {
        "mimeType": "application/json",
        // highlight-next-line
        "text": "{\"emailId\":\"REDACTED\",\"password\":\"REDACTED\",\"org\":\"spectro-cloud\"}"
      }
    ```
  </TabItem>
  <TabItem value="tokens" label="Tokens">
    ```json
      "queryString": [
        {
          "name": "access_token",
        // highlight-next-line
          "value": "REDACTED"
        }
      ],
    ```
  </TabItem>
  <TabItem value="cookies" label="Cookies">
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
  </TabItem>
</Tabs>

## Validate

Review the generated HAR file against the list of keywords we provided for reference, and make sure you've redacted every instance of sensitive information.

## Next Steps

After you've successfully generated and sanitized your HAR file, send it to the Support Specialist who asked you for this file.
