---
sidebar_label: "List Clusters with Palette Go SDK"
title: "List Clusters with Palette Go SDK"
description: "Learn how to use the Palette GO SDK to list your Palette host clusters."
hide_table_of_contents: false
sidebar_position: 10
tags: ["palette-sdk", "go"]
---

The Palette Go Software Developer Toolkit (SDK) enables Go developers to interact with Palette services. This guide
explains how to install and use the SDK to list the active host clusters in your Palette environment.

## Prerequisites

- [Go](https://go.dev/doc/install) version 1.22.5 or later.

- A Palette account with [Tenant Admin](../../tenant-settings/tenant-settings.md) access.

- A Palette API key. Refer to the [Create API Key](../../user-management/authentication/api-key/create-api-key.md) page
  for instructions on how to create an API key.

## List Palette Clusters

1.  Open a terminal window and create a folder for you Go repository.

    ```bash
    mkdir sdk-example
    ```

2.  Navigate to the created folder.

    ```bash
    cd sdk-example
    ```

3.  Initialize your Go module and enable dependency tracking for your code by issuing the following command. This will
    create a `go.mod` file in the current folder.

    ```bash
    go mod init example/list-clusters
    ```

4.  Download the required Palette SDK modules. The command below retrieves the modules and records their dependencies in
    the `go.mod` file.

    ```bash
    go get github.com/spectrocloud/palette-sdk-go/api/models
    go get github.com/spectrocloud/palette-sdk-go/client
    ```

5.  Create a source file named `main.go`.

    ```bash
    touch main.go
    ```

6.  Open the `main.go` file in a text editor of your choice and paste the content below.

    ```go
    package main

    import (
        "fmt"
        "os"

        "github.com/spectrocloud/palette-sdk-go/api/models"
        "github.com/spectrocloud/palette-sdk-go/client"
    )

    func main() {

        // Read environment variables

        host := os.Getenv("host")
        apiKey := os.Getenv("apiKey")
        projectUid := os.Getenv("projectUid")
        scope := "tenant"

        if host == "" || apiKey == "" {
            fmt.Println("Please specify a host and apiKey as environment variables")
            os.Exit(1)
        }
        if projectUid != "" {
            scope = "project"
        }

        // Initialize a Palette client

        pc := client.New(
            client.WithPaletteURI(host),
            client.WithAPIKey(apiKey),
        )
        if projectUid != "" {
            client.WithScopeProject(projectUid)(pc)
        } else {
            client.WithScopeTenant()(pc)
        }

        // Search for clusters

        fmt.Printf("Searching for Palette clusters with %s scope...\n", scope)

        clusters, err := pc.SearchClusterSummaries(&models.V1SearchFilterSpec{}, []*models.V1SearchFilterSortSpec{})
        if err != nil {
            panic(err)
        }

        // Display the results

        if len(clusters) == 0 {
            fmt.Println("\nNo clusters found.")
            return
        }

        fmt.Printf("\nFound %d cluster(s):\n", len(clusters))
        for _, cluster := range clusters {
            fmt.Printf("\nName: %s\n", cluster.Metadata.Name)
            fmt.Printf("  Cloud Type: %s\n", cluster.SpecSummary.CloudConfig.CloudType)
            fmt.Printf("  Project: %s\n", cluster.SpecSummary.ProjectMeta.Name)
        }
    }
    ```

    This application performs the following tasks:

    - Imports the required packages.

    - Reads the environment variables provided by the user to configure the client and define the search scope. If the
      user provides a project UID, the application sets the scope to project-specific and lists the active clusters
      within that project. If no project UID is given, the scope is set to tenant-wide, listing active clusters across
      all projects.

    - Initializes a Palette client using the provided host URL and Palette API key.

    - Searches for Palette clusters within the specified scope (tenant-wide or project-specific).

    - Displays the active clusters with details such as name, cloud type, and associated project.

    After pasting the content, save and exit the file.

7.  Export your Palette host URL and API key as environment variables. Replace `<your-palette-host-url>` with your
    Palette URL, such as `console.spectrocloud.com`, and `<your-palette-api-key>` with your API key.

    ```bash
    export apiKey=<your-palette-api-key>
    export host=<your-palette-host-url>
    ```

8.  Issue the following command to execute the application.

    ```bash
    go run .
    ```

    :::tip

    Optionally, instead of exporting the variables in a separate command, you can use the `go run` command with
    command-scoped environment variables.

        ```bash
        apiKey=<your-palette-api-key> host=<your-palette-host-url> go run .
        ```

    :::

    The application will print the active clusters in your Palette environment.

    ```text hideClipboard
    Searching for Palette clusters with tenant scope...

    Found 1 cluster(s):

    Name: aws-cluster
    Cloud Type: aws
    Project: Default
    ```

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, click **Clusters**.

3. Verify that the clusters printed by the Go client application are also visible in the Palette UI.
