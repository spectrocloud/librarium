---
sidebar_label: "Delete API Key"
title: "Delete API Key"
description: "Delete an existing API Key in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
tags: ["user-management", "authentication", "api-key"]
---

You can delete an API key from Palette. A tenant admin can also delete an API key created by another user within the
tenant. Use the following steps to delete an API key.

The following sections provide information on how to delete an API key in Palette through the UI, API, and SDK.

## UI

Tenant administrators can delete an API key on behalf of any user within the tenant. Select the Tenant tab below to
learn more about deleting an API key as a tenant admin.

### Prerequisites

<Tabs groupId="scope">
<TabItem label="User" value="user">

- You must have a Palette account, and you must be logged in.

- You must have an API key created. Refer to the [Create API Key](create-api-key.md) section for more information.

</TabItem>
<TabItem label="Tenant" value="tenant">

- You must have a Palette account, and you must be logged in.

- Tenant administrator access.

- An existing API key must be available.

</TabItem>
</Tabs>

### Delete API Key in Palette UI

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

3. Identify your API key in the table, and click on the **three-dot Menu**.

4. Click on **Delete**.

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Identify the API key in the table you want to remove, and click on the **three-dot Menu**.

6. Click on **Delete**.

</TabItem>
</Tabs>

### Validate

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

3. Verify your API key is not listed in the table.

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Verify the API key is not listed in the table.

</TabItem>
</Tabs>

## API

You can use the Palette API with the `https://api.spectrocloud.com/v1/apiKeys/:uid`
[endpoint](https://docs.spectrocloud.com/api/v1/v-1-api-keys-uid-delete) and the API key's unique identifier to delete
an API key programmatically.

Use the following steps to learn how to delete an API key.

### Prerequisites

- You must have a valid Palette API key. Refer to the [Create API Key](create-api-key.md) section for more information.

- A terminal or command prompt to execute the `curl` command. Alternatively, you can use a REST client like
  [Postman](https://www.postman.com/).

### Delete API Key with API

1. Open a terminal or command prompt.

2. Issue the following command to retrieve your API key's unique identifier. Replace `API_KEY_VALUE` with your API key.

   ```shell
   curl --location 'https://api.spectrocloud.com/v1/apiKeys' \
   --header 'Accept: application/json' \
   --header 'apiKey: API_KEY_VALUE'
   ```

   ```json {17} hideClipboard
   {
     "items": [
       {
         "metadata": {
           "annotations": {
             "description": "",
             "ownerUid": "****************",
             "permissions": "apiKey.create,apiKey.delete,apiKey.get,apiKey.list,apiKey.update,tag.update",
             "scope": "tenant",
             "scopeVisibility": "20",
             "tenantUid": "*************************"
           },
           "creationTimestamp": "2024-09-16T14:46:28.677Z",
           "deletionTimestamp": "0001-01-01T00:00:00.000Z",
           "lastModifiedTimestamp": "2024-09-16T14:46:29.079Z",
           "name": "remove-me-test",
           "uid": "66e844c44bab2337f20c7471"
         },
         "spec": {
           "expiry": "2024-09-23T14:46:28.164Z",
           "user": {
             "firstName": "example",
             "lastName": "example",
             "uid": "*****************"
           }
         },
         "status": {
           "isActive": true
         }
       }
     ]
   }
   ```

3. Once you have the API key's unique identifier, issue the following command to delete the API key. Replace `uid` with
   the API key's unique identifier. Specify a valid API key in the `ApiKey` header.

   ```shell
   curl -L -X DELETE 'https://api.spectrocloud.com/v1/apiKeys/:uid' \
   -H 'ApiKey: <API_KEY_VALUE>'
   ```

4. No output is expected if the API key is successfully deleted.

### Validate

1. Verify the API key is no longer available in Palette by issuing the following command. Replace `API_KEY_VALUE` with
   your API key.

   ```shell
   curl --location 'https://api.spectrocloud.com/v1/apiKeys' \
   --header 'Accept: application/json' \
   --header 'apiKey: API_KEY_VALUE'
   ```

2. The API key should not be listed in the response. If the API key is still available, verify the API key's unique
   identifier and reissue the delete command. You can also validate the deletion by checking the Palette UI.

## SDK

You can use the [Palette SDK](../../../automation/palette-sdk/palette-sdk.md) to delete an API key programmatically.

### Prerequisites

- You must have a valid Palette API key. Refer to the [Create API Key](create-api-key.md) section for more information.

- [Go version](https://go.dev/doc/install) 1.22 or later.

- A text editor or an IDE to write and execute the Go code.

- A valid Palette API key to delete. In this example, the fictional API key named `delete-test-key` is used.

- An internet connection to download the Palette SDK and its dependencies.

### Delete API Key With Go SDK

1. Create a new directory for your Go project and navigate to the directory.

   ```shell
   mkdir delete-api-key && cd delete-api-key
   ```

2. Create a new Go file, for example, **main.go**.

   ```shell
   touch main.go
   ```

3. Initialize the Go module. Use the following command to initialize the Go module.

   ```shell
   go mod init example/delete-api-key
   ```

4. Open the **main.go** file in your text editor or IDE.

5. Copy and paste the following code snippet into the **main.go** file. Replace the variable `keyName` with the key name
   you want to delete.

   ```go {17}
    package main

    import (
      "fmt"
      "log"
      "log/slog"
      "os"

      "github.com/spectrocloud/palette-sdk-go/client"
    )

    func main() {

      host := os.Getenv("PALETTE_HOST") // "api.spectrocloud.com"
      apiKey := os.Getenv("PALETTE_API_KEY") // "your api key"

      if host == "" || apiKey == "" {
        log.Fatal("Please set PALETTE_HOST and PALETTE_API_KEY environment variables")
      }

      keyName := "delete-test-key" // "name of the key to delete. Replace as needed"

      pc := client.New(
        client.WithPaletteURI(host),
        client.WithAPIKey(apiKey),
      )

      keys, err := pc.GetAPIKeys()
      if err != nil {
        log.Fatal("Error getting API keys: ", err)
      }

      for _, key := range keys.Items {
        if key.Metadata.Name == keyName {
          slog.Info(fmt.Sprintf("API key found. Deleting API key: %s", key.Metadata.Name))
          err := pc.DeleteAPIKey(key.Metadata.UID)
          if err != nil {
            log.Fatal("Error deleting API key: ", err)
          }
          slog.Info("API key deleted successfully")
        }

      }
    }
   ```

6. Set the environment variables for the Palette host and API key. Replace `api.spectrocloud.com` with your Palette host
   URL if you are using a self-hosted Palette or VerteX instance.

   ```shell
   export PALETTE_HOST="api.spectrocloud.com"
   export PALETTE_API_KEY="your api key"
   ```

7. Start the Go program.

   ```shell
   go get ./... && go run .
   ```

   ```shell
   2024/09/16 08:27:12 INFO API key found. Deleting API key: delete-test-key
   2024/09/16 08:27:12 INFO API key deleted successfully
   ```

### Validate

You can validate the deletion by checking the Palette UI or by querying the API with the `GetAPIKeys()` method to list
the API keys again and verifying the API key is no longer available.

1. Create a function to list the API keys and verify the API key is no longer available. Use the following code snippet
   to validate the deletion.

   ```go
   // validateKeyIsRemoved checks if the key is removed
   // returns true if the key is removed, false otherwise
   func validateKeyIsRemoved(keyName string, pc *client.V1Client) (bool, error) {

     keys, err := pc.GetAPIKeys()
     if err != nil {
       log.Fatal("Error getting API keys: ", err)
     }

     for _, key := range keys.Items {
       if key.Metadata.Name == keyName {
         return false, nil
       }
     }

     return true, nil

   }
   ```

2. Replace the entire content of the **main.go** file with the following code snippet to include the validation check.

   ```go
    package main

    import (
      "fmt"
      "log"
      "log/slog"
      "os"

      "github.com/spectrocloud/palette-sdk-go/client"
    )

    func main() {

      host := os.Getenv("PALETTE_HOST") // "api.spectrocloud.com"
      apiKey := os.Getenv("PALETTE_API_KEY") // "your api key"

      if host == "" || apiKey == "" {
        log.Fatal("Please set PALETTE_HOST and PALETTE_API_KEY environment variables")
      }

      keyName := "delete-test-key" // "name of the key to delete"

      pc := client.New(
        client.WithPaletteURI(host),
        client.WithAPIKey(apiKey),
      )

      keys, err := pc.GetAPIKeys()
      if err != nil {
        log.Fatal("Error getting API keys: ", err)
      }

      for _, key := range keys.Items {
        if key.Metadata.Name == keyName {
          slog.Info(fmt.Sprintf("API key found. Deleting API key: %s", key.Metadata.Name))
          err := pc.DeleteAPIKey(key.Metadata.UID)
          if err != nil {
            log.Fatal("Error deleting API key: ", err)
          }
          slog.Info("API key deleted successfully")
        }

      }

      ok, err := validateKeyIsRemoved(keyName, pc)
      if err != nil {
        log.Fatal("Error validating key is removed: ", err)
      }

      if !ok {
        log.Fatal("API key is not removed")
      }

      slog.Info("Validation ensured the key is removed successfully")

    }

    // validateKeyIsRemoved checks if the key is removed
    // returns true if the key is removed, false otherwise
    func validateKeyIsRemoved(keyName string, pc *client.V1Client) (bool, error) {

      keys, err := pc.GetAPIKeys()
      if err != nil {
        log.Fatal("Error getting API keys: ", err)
      }

      for _, key := range keys.Items {
        if key.Metadata.Name == keyName {
          return false, nil
        }
      }

      return true, nil

    }
   ```

3. Start the Go program.

   ```shell
   go get ./... && go run .
   ```

   ```shell
   2024/09/16 08:35:07 INFO Validation ensured the API key is removed successfully
   ```

4. The output confirms the API key is successfully deleted.
