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

### Supported Languages

The `fips-validate` currently only supports Go binaries. Images with binaries compiled in other languages are marked as
`unknown` in the report.

## Subcommands

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

The `images` subcommand validates the FIPS compliance of the images in your clusters. The command scans all the images
of active containers. The image is downloaded from the source and unpacked through [Luet](https://luet.io/docs/) and all
files that are Executable and Linkable Format binaries are scanned. The scan checks if the binaries are compiled with
FIPS compliant cryptographic libraries.

To enable the scan, the command deploys resources into a Kubernetes namespace named `vertex-ns`, unless otherwise
specified, in the target cluster. Upon completion of the scan, the command prints the results of the scan to the
terminal and cleans up the resources from the cluster.

The `images` subcommand accepts the following flags:

| **Short Flag** | **Long Flag** | **Description**                                                                                        | **Type** |
| -------------- | ------------- | ------------------------------------------------------------------------------------------------------ | -------- |
| `-n`           | `--namespace` | The namespace in which to deploy the resources for the FIPS scan. The default namespace is `vertex-ns` | string   |
| `-f`           | `--out`       | The output file path to save the scan results. The default output is the terminal.                     | string   |
| `-h`           | `--help`      | Display the help message for the `images` subcommand.                                                  | boolean  |

:::warning

Images hosted in private registries are not supported. The `fips-validate` command only supports images hosted in public
registries.

:::

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

The report contains a list of images and the FIPS compliance status of the binaries in the images. Each row in the
report contains the following columns:

| **Column** | **Description**                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `NO.`      | The number of the image in the order of the scan.                                                                                         |
| `BINARY`   | The name of the executable binary.                                                                                                        |
| `ARCH`     | The architecture of the binary.                                                                                                           |
| `PATH`     | The path of the binary in the image.                                                                                                      |
| `VERSION`  | The version of the programming language used to create the binary. Go is the only supported language from a version detection capability. |
| `EXE`      | How the binary was compiled, either statically or dynamically.                                                                            |
| `CRYPTO`   | The cryptographic library used to compile the binary.                                                                                     |

The following is an example of the FIPS compliance report. The following image is FIPS compliant as the binary is
compiled with the BoringSSL cryptographic library.

```text
---------------------------------------------------------------
image: gcr.io/spectro-images-public/release-fips/cluster-api-aws/cluster-api-aws-controller:v1.5.2-spectro-4.3.0
┌─────┬─────────┬────────┬──────────┬──────────┬────────┬────────┐
│ NO. │ BINARY  │ ARCH   │ PATH     │ VERSION  │ EXE    │ CRYPTO │
├─────┼─────────┼────────┼──────────┼──────────┼────────┼────────┤
│   1 │ manager │ x86-64 │ /manager │ go1.21.6 │ static │ boring │
└─────┴─────────┴────────┴──────────┴──────────┴────────┴────────┘
```

If the scan is not able to determine the FIPS compliance status of a binary, the status is marked as `unknown` in the
summary section. The individual row will contain a note stating the reason for the unknown status.

```text
image: ghcr.io/spectrocloud/hello-universe:1.1.1
note: binaries are not using boring crypto and/or not statically linked
┌─────┬──────────────────┬────────┬─────────────────────────────────┬─────────┬────────┬─────────┐
│ NO. │ BINARY           │ ARCH   │ PATH                            │ VERSION │ EXE    │ CRYPTO  │
├─────┼──────────────────┼────────┼─────────────────────────────────┼─────────┼────────┼─────────┤
│   1 │ legacy.so        │ x86-64 │ /usr/lib/ossl-modules/legacy.so │ unknown │ static │ openssl │
│   2 │ padlock.so       │ x86-64 │ /usr/lib/engines-3/padlock.so   │ unknown │ static │ openssl │
│   3 │ libcurl.so.4.8.0 │ x86-64 │ /usr/lib/libcurl.so.4.8.0       │ unknown │ static │ openssl │
│   4 │ node             │ x86-64 │ /usr/local/bin/node             │ unknown │ static │ openssl │
│   5 │ libcrypto.so.3   │ x86-64 │ /lib/libcrypto.so.3             │ unknown │ static │ openssl │
└─────┴──────────────────┴────────┴─────────────────────────────────┴─────────┴────────┴─────────┘
```

The end of the report contains a summary of the scan results. The summary includes all the images scanned and the status
of each image.

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬─────────┐
│ IMAGE                                                                                                           │ STATUS  │
|---------------------------------------------------------------------------------------------------------------------------|
│ gcr.io/spectro-dev-public/vishu/spectro-drive:latest                                                            │ unknown │
│ gcr.io/spectro-images-public/release/kube-rbac-proxy:spectro-v0.14.0-20230508                                   │ failed  │
│ gcr.io/spectro-images-public/release-fips/system-upgrade-controller:v0.11.4_spectro                             │ passed  │
│ us-east1-docker.pkg.dev/spectro-palette-images/public/daily-fips/upgrade:20240305.0000                          │ passed  │
│ gcr.io/spectro-images-fips/kube-scheduler:v1.28.5                                                               │ passed  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴─────────┘
```

## Services

The `services` subcommand validates the FIPS compliance of the service endpoints in your clusters. The command scans the
service endpoints and checks if the service endpoind is using FIPS compliant cryptographic libraries and TLS 1.2 or
higher. The scan also checks if the service endpoint's certificate is within its valid timeframe by verifying its start
and expiration dates.

| Check                      | Description                                                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cipher-tls1*2*             | Verifies TLS 1.2 cipher suites.                                                                                                                                                             |
| cipher-tls1*3*             | Verifies TLS 1.3 cipher suites.                                                                                                                                                             |
| SSLv2, SSLv3, TLS1, TLS1_1 | Checks for the presence of deprecated SSL/TLS versions.                                                                                                                                     |
| cipherlist_NULL            | Checks for the presence of NULL encryption cipher suites.                                                                                                                                   |
| cipherlist_aNULL           | Checks for the presence of aNULL encryption cipher suites.                                                                                                                                  |
| cipherlist_EXPORT          | Checks for the presence of EXPORT encryption cipher suites.                                                                                                                                 |
| cipherlist_3DES_IDEA       | Checks for the presence of 3DES and IDEA encryption cipher suites.                                                                                                                          |
| cipherlist_OBSOLETED       | Checks for the presence of obsoleted encryption cipher suites.                                                                                                                              |
| cipherlist_LOW             | Checks for the presence of LOW encryption cipher suites.                                                                                                                                    |
| cert_notBefore             | Validates the start date of the certificate.                                                                                                                                                |
| cert_notAfter              | Validates the expiration date of the certificate.                                                                                                                                           |
| FS_TLS12_sig_algs          | Verifies the supported signature algorithms for TLS 1.2.                                                                                                                                    |
| HSTS                       | Validates the presence of HTTP Strict Transport Security (HSTS) headers.                                                                                                                    |
| DNS_CAArecord              | Confirms the presence of DNS Certification Authority Authorization (CAA) records.                                                                                                           |
| security_headers           | Checks for the presence of recommended security headers. Refer to [testssl.sh](https://testssl.sh/doc/testssl.1.html) documentation for more context. Seach for the `--header` description. |
| overall_grade              | Assesses the overall security grade of the configuration.                                                                                                                                   |
| cert\_                     | Ensures certificate-related configurations meet requirements, excluding specific cases.                                                                                                     |
