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

:::info

If you have the environment variable `KUBECONFIG` set, the `fips-validate` will automatically use the kubeconfig file
and skip prompting you for the kubeconfig file path.

:::

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

- The Kubernetes cluster must be accessible from the machine where you issue the `fips-validate` command. Ensure that
  the kubeconfig file is correctly configured to access the cluster.

- The Kuberntes cluster must have internet access to download the images when using the `images` subcommand. Private
  image registries are not supported.

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

### Limitations

- Images hosted in private registries are not supported.
- Only Go binaries are supported. Images with binaries compiled in other languages are marked as `unknown` in the
  report.

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
service endpoints and conducts a handshake with each endpoint thorugh [testssl](https://testssl.sh/). The handshake is
used to verify if the service endpoind is using FIPS compliant TLS versions and cryptographic ciphers. The service
endpoint's certificate is also verified if it's within a valid timeframe by verifying its start and expiration dates.

The following flags are available for the `services` subcommand:

| **Short Flag** | **Long Flag** | **Description**                                                                                        | **Type** |
| -------------- | ------------- | ------------------------------------------------------------------------------------------------------ | -------- |
| `-n`           | `--namespace` | The namespace in which to deploy the resources for the FIPS scan. The default namespace is `vertex-ns` | string   |
| `-f`           | `--out`       | The output file path to save the scan results. The default output is the terminal.                     | string   |
| `-h`           | `--help`      | Display the help message for the `images` subcommand.                                                  | boolean  |

### Checks

The following is a list of checks is performed by the `services` subcommand:

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

### Limitations

- Only services exposing port `443` are supported.
- Only HTTP and HTTPS services are supported.

### Examples

Validate the FIPS compliance of the service endpoints in your cluster.

```shell
palette fips-validate services
```

Validate the FIPS compliance of the service endpoints in your cluster and save the results to a file.

```shell
palette fips-validate services --out /path/to/fips-scan-results.txt
```

Validate the FIPS compliance of the service endpoints in your cluster and deploy the resources in a custom namespace.

```shell
palette fips-validate services --namespace my-scan-ns
```

### Review Results

The report contains a list of service endpoints and the FIPS compliance status of the service endpoints. Each row in the
report contains the following columns:

| **Column** | **Description**                                                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NO.`      | The number of the service endpoint in the order of the scan.                                                                                                                       |
| `ID`       | The finding identifier.                                                                                                                                                            |
| `FINDING`  | The description of the finding. Depending on the finding, you may receive a technical finding. Refer to the [Findings](#findings) section in case you receive a technical finding. |
| `SEVERITY` | The severity of the finding.                                                                                                                                                       |
| `STATUS`   | The status of the finding. Allowed values are `PASSED` or `FAILED`.                                                                                                                |

```text
endpoint: oldrelease-vc1.cluster-65ea4b3b9fe382461d51fbb3
┌─────┬────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬────────┐
│ NO. │ ID                     │ FINDING                                                                                                                           │ SEVERITY │ STATUS │
├─────┼────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────┤
│   1 │ cipherlist_OBSOLETED   │ offered                                                                                                                           │ CRITICAL │ FAILED │
│   2 │ cipher-tls1_2_xcca9    │ TLSv1.2   xcca9   ECDHE-ECDSA-CHACHA20-POLY1305     ECDH 521   ChaCha20    256      TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256 │ HIGH     │ FAILED │
│   3 │ cipher-tls1_3_x1303    │ TLSv1.3   x1303   TLS_CHACHA20_POLY1305_SHA256      ECDH 253   ChaCha20    256      TLS_CHACHA20_POLY1305_SHA256                  │ HIGH     │ FAILED │
│   4 │ Cache-Control_multiple │ Multiple Cache-Control headers. Using first header: no-cache, private                                                             │ MEDIUM   │ FAILED │
│   5 │ LUCKY13                │ potentially vulnerable, uses TLS CBC ciphers                                                                                      │ LOW      │ FAILED │
└─────┴────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴────────┘
```

#### Findings

A finding is a result of a failed check. The `FINDING` column may contain technical details of the finding. The
technical finding contains the following information:

- The TLS version

- The cipher suite HEX code.

- The name of the cipher suite.

- The key exchange algorithm.

- The encryption algorithm.

- The encryption key length.

- The authentication algorithm.

To help you better understand technical findings values, use the following example.

```text
TLSv1.3   x1303   TLS_CHACHA20_POLY1305_SHA256      ECDH 253   ChaCha20    256      TLS_CHACHA20_POLY1305_SHA256
```

The table below explains the example finding value and what each value represents. The values are separated by a space.

| **Value**                      | **Explanation**               |
| ------------------------------ | ----------------------------- |
| `TLSv1.3`                      | The TLS version.              |
| `x1303`                        | The cipher suite HEX code.    |
| `TLS_CHACHA20_POLY1305_SHA256` | The name of the cipher suite. |
| `ECDH 253`                     | The key exchange algorithm.   |
| `ChaCha20`                     | The encryption algorithm.     |
| `256`                          | The encryption key length.    |
| `TLS_CHACHA20_POLY1305_SHA256` | The authentication algorithm. |

The service endpoint is using the `TLSv1.3` version with `TLS_CHACHA20_POLY1305_SHA256` cipher suit. The TLS version and
the cipher suite is not considered FIPS compliant and the status is marked as `FAILED`.

A successful check will not have a finding identifier. The following is an example of a successful check.

```text
---------------------------------------------------------------
endpoint: palette-webhook-service.palette-system
note: all validations passed
---------------------------------------------------------------
```

The end of the report contains a summary of the scan results. The summary includes all the service endpoints scanned and
the status of each endpoint. Below is an example of the summary section.

```text
┌────────────────────────────────────────────────────────────────┬────────┐
│ ENDPOINT                                                       │ STATUS │
├────────────────────────────────────────────────────────────────┼────────┤
│ capa-webhook-service.capi-webhook-system                       │ passed │
│ capi-kubeadm-bootstrap-webhook-service.capi-webhook-system     │ passed │
│ capi-kubeadm-control-plane-webhook-service.capi-webhook-system │ passed │
│ capi-webhook-service.capi-webhook-system                       │ passed │
│ capvc-webhook-service.capi-webhook-system                      │ failed │
│ cert-manager-webhook.cert-manager                              │ passed │
│ metrics-server.cluster-65e4cb59cbfc84ea5877af4c                │ passed │
│ oldrelease-vc1.cluster-65ea4b3b9fe382461d51fbb3                │ failed │
│ oldrelease-vc1-headless.cluster-65ea4b3b9fe382461d51fbb3       │ failed │
│ oldrelease-vc1-lb.cluster-65ea4b3b9fe382461d51fbb3             │ failed │
│ kubernetes.default                                             │ passed │
│ palette-webhook-service.palette-system                         │ passed │
│ 10-0-3-97.kubernetes.default:2380                              │ failed │
│ 10-0-3-97.kubernetes.default:10250                             │ passed │
└────────────────────────────────────────────────────────────────┴────────┘
```
