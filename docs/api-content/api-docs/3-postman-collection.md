---
title: "Postman Collection"
sidebar_label: "Postman Collection"
description: "Palette API Postman Collection"
icon: ""
hide_table_of_contents: true

hiddenFromNav: false
---

Spectro Cloud provides a Postman collection for your convenience to help you interact with the Spectro Cloud API.

## Prerequisites

To interact with the API, you will need the following:

- [Postman application](https://www.postman.com/downloads/) v10.2.2 or greater.

- A base URL for the Palette API. The default Palette API endpoint is `api.spectrocloud.com`, but the base URL will be
  different for self-hosted Palette installation. Contact your system administrator to find your base URL.

- An authentication credential.

## Authentication

Two forms of authentication are available to interact with the Spectro Cloud API:

- An Authentication header with a token value.  
  or
- An API Key with an ApiKey value.

Learn more about [authentication methods](/user-management/authentication/api-key) in Palette documentation.

## Import the Postman Collection

Right-click the following URL and select **Save Link as** (in Safari, select **Download Linked Files As ...**) to
download the Postman collection to your local machine.

<Tabs>

<TabItem label="Palette API V1" value="palette">

<FullUrlLink path="/apis/v1/palette-apis.json" />

</TabItem>

<TabItem label="Edge Management API V1" value="edge">

<FullUrlLink path="/apis/edge-v1/emc-api.json" />

</TabItem>

</Tabs>

1. Navigate to Postman on your computer and open the **Import** dialog.

2. Select the downloaded API specification file and click the **Continue** button.

3. Click on the **Import** button.

Postman imports your collection and lists it under Import Complete. <br />

![Copy/paste the URL in the **Import** dialog as a link.](/URL-as-a-link.webp)

Find details about importing in Postman's
[import/export](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/) tutorial.
