---
sidebar_label: "Palette Go SDK"
title: "Palette Go SDK"
description: "Learn how to get started with the Palette Go SDK."
hide_table_of_contents: false
tags: ["palette-sdk"]
---

The [Palette Go Software Developer Toolkit (SDK)](https://github.com/spectrocloud/palette-sdk-go) provides Go developers
a user-friendly client for interacting with Palette APIs.

## Initialize Palette Client

The Go Palette client supports the following authentication methods.

- [JWT](https://github.com/spectrocloud/palette-sdk-go/blob/main/client/client.go#L56)
- [Palette API Key](https://github.com/spectrocloud/palette-sdk-go/blob/main/client/client.go#L49)
- [Username](https://github.com/spectrocloud/palette-sdk-go/blob/main/client/client.go#L63) and
  [password](https://github.com/spectrocloud/palette-sdk-go/blob/main/client/client.go#L70)

The snippet below showcases an example of how to initialize the Palette client using an API key. You must provide a
[Palette URI](https://github.com/spectrocloud/palette-sdk-go/blob/main/client/client.go#L77) for all authentication
methods.

```go
  pc := client.New(
      client.WithPaletteURI(host),
      client.WithAPIKey(apiKey),
    )
```

## Get Started

Check out the [List Clusters with Palette Go SDK](./list-clusters-sdk.md) example to learn how to install, configure,
and use the SDK. This guide provides instructions and sample code for listing the active clusters in your Palette
environment. Additionally, refer to the [client](https://github.com/spectrocloud/palette-sdk-go/blob/main/client) folder
for a complete list of client configuration options.

## Resources

- [Palette SDK Go](https://github.com/spectrocloud/palette-sdk-go) GitHub repository
- [List Clusters with Palette Go SDK](./list-clusters-sdk.md)
