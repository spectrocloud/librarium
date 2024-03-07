---
sidebar_label: "FIPS Validate"
title: "FIPS Validate"
description: "Learn how to validate the FIPS compliance of your Palette clusters."
hide_table_of_contents: false
sidebar_position: 15
tags: ["palette-cli"]
---

The `fips-validate` command checks the
[Federal Information Processing Standards](https://www.nist.gov/standardsgov/compliance-faqs-federal-information-processing-standards-fips)
(FIPS) compliance of your Kubernetes clusters. You can use the command to ensure that your clusters are FIPS-compliant
by scanning the images and exposed service endpoints in your clusters.

The `fips-validate` command exposes the following subcommands:

- [`images`](#images): Validate the FIPS compliance of the images in your clusters.

- [`services`](#services): Validate the FIPS compliance of the service endpoints in your clusters.

- [`clean`](#clean): Remove the FIPS validation resources from your clusters.

## Prerequisites

The `fips-validate` command requires the following prerequisites:

- Ensure you have access to the kubeconfig file for the cluster that you want to validate. The file needs to be
  accessible from the machine where you issue the `fips-validate` command. Refer to the
  [Set up Kubectl](../../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli) guide to learn how to
  get the kubeconfig file for your cluster.

- Sufficient permissions to create a new namespace and deploy resources in the namespace. We recommend using an elevated
  clusterRole such as [_cluster-admin_](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)
  to ensure that the command can create the necessary resources.

## Images

The `images` subcommand validates the FIPS compliance of the images in your clusters. The command scans all the iamages
of active containers. The image is unpacked through [Luet](https://luet.io/docs/) and all files that are Executable and
Linkable Format binaries are scanned. The scan checks if the binaries are compiled with FIPS compliant cryptographic
libraries.

To enable the scan, the command deploys resources into a Kubernetes namespace named `vertex-ns`, unless otherwise
specified, in the target cluster. Upon completion of the scan, the command prints the results of the scan to the
terminal and cleans up the resources from the cluster.

The `images` subcommand accepts the following flags:

| **Short Flag** | **Long Flag** | **Description**                                                                                        | **Type** |
| -------------- | ------------- | ------------------------------------------------------------------------------------------------------ | -------- |
| `-n`           | `--namespace` | The namespace in which to deploy the resources for the FIPS scan. The default namespace is `vertex-ns` | string   |
| `-f`           | `--out`       | The output file path to save the scan results. The default output is the terminal.                     | string   |
| `-h`           | `--help`      | Display the help message for the `images` subcommand.                                                  | boolean  |

### Examples

Validate the FIPS compliance of the images in your cluster.

```shell
palette fips-validate images
```

Validate the FIPS compliance of the images in your cluster and save the results to a file.

```shell
palette fips-validate images --out /path/to/fips-scan-results.txt
```

Validate the FIPS compliance of the images in your cluster and deploy the resources in a custom namespace.

```shell
palette fips-validate images --namespace my-scan-ns
```

### Review Results

The report

```text
---------------------------------------------------------------
image: gcr.io/spectro-images-public/release-fips/cluster-api-aws/cluster-api-aws-controller:v1.5.2-spectro-4.3.0
┌─────┬─────────┬────────┬──────────┬──────────┬────────┬────────┐
│ NO. │ BINARY  │ ARCH   │ PATH     │ VERSION  │ EXE    │ CRYPTO │
├─────┼─────────┼────────┼──────────┼──────────┼────────┼────────┤
│   1 │ manager │ x86-64 │ /manager │ go1.21.6 │ static │ boring │
└─────┴─────────┴────────┴──────────┴──────────┴────────┴────────┘
```
