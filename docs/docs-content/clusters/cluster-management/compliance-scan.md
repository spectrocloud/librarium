---
sidebar_label: "Compliance Scan"
title: "Compliance Scan"
description: "Learn how to apply compliance scans on your clusters."
hide_table_of_contents: false
sidebar_position: 50
tags: ["clusters", "cluster management"]
---

Palette provides a way to run compliance, security, conformance, and software bill of materials (SBOM) scans on tenant
clusters. These scans ensure cluster adherence to specific compliance and security standards. The scans also detect
potential vulnerabilities by performing penetration tests.

Palette supports four types of scans. Each scan generates reports with details specific to the type of scan. You can
initiate multiple scans of each type over time. In addition, Palette keeps a history of previous scans for comparison
purposes. To learn more about each scan type, refer to the following sections.

:::info

Scans may not work as expected when a node is in maintenance mode. Before scheduling a scan, we recommend you turn off
maintenance mode if enabled. To verify if a node is in maintenance mode, navigate to **Clusters** > **Nodes** and check
the **Health** column for a **Maintenance mode** icon. To turn off maintenance mode, click on the **three-dot Menu** in
the row of the node you want to scan, and select **Turn off maintenance mode**.

:::

## Configuration Security

This scan examines the compliance of deployed Kubernetes security features against the CIS Kubernetes Benchmarks. CIS
Kubernetes Benchmarks are consensus-driven security guidelines for the Kubernetes. Different releases of the CIS
benchmark cover different releases of Kubernetes. By default, Kubernetes configuration security will determine the test
set based on the Kubernetes version running on the cluster being scanned. Internally, Palette leverages an open-source
tool called KubeBench from Aqua Security to perform this scan. Scans are run against control plane and worker nodes of
the Kubernetes cluster, and a combined report is made available on the UI. Users can filter the report to view only the
control plane or worker results if required.

All the tests in the report are marked as Scored or Not Scored. The ones marked Not Scored cannot be automatically run,
and it is suggested to be tested manually.

![kcs.webp](/kcs.webp)

## Penetration Testing

Kubernetes penetration testing scans Kubernetes-related open-ports for any configuration issues that can leave the
tenant clusters exposed to attackers. It hunts for security issues in your Kubernetes clusters and increases awareness
and visibility of the security controls in Kubernetes environments. The scan gives a full report on the cluster security
concerns. Internally Palette leverages an open-source tool called KubeHunter from Aqua Security to perform this scan.
Scans are run in 2 modes, Internal and External. In the internal mode, tests are run against the internal endpoint of
the API server, whereas, in external mode, the external public-facing endpoint is used for testing. A combined report of
vulnerabilities found in both modes is shown on the Palette UI. Users can filter the report to view just the internal or
external report if required.

![kpt.webp](/kpt.webp)

## Conformance Testing

Kubernetes conformance testing is about validating your Kubernetes configuration to ensure that they are conformant to
the CNCF specifications. Palette leverages an open-source tool called Sonobuoy to perform this scan. Automatically
select a subset of relevant tests for execution based on the type of cloud (public, private) and the type of deployment
infrastructure (IaaS, managed cloud service). Each test can take up to 2 hours to complete. If a cluster has a single
worker node, a few tests may fail due to resources. For accurate assessment of conformance for distribution of
Kubernetes, set up a cluster with at least two worker nodes. These tests are not destructive. However, they do launch
several workloads in test namespaces as part of the tests. As a result, the consumption of cluster resources during the
test run duration increases and may impact other workloads running on the cluster.

The scan summary of total passed and failed tests are displayed while the test is in progress. In addition, a complete
overview of the tests that were run is displayed after the completion of the report.

![conformance.webp](/conformance.webp)

## SBOM: Dependencies & Vulnerabilities

## What is an SBOM?

An SBOM is a comprehensive list of the components, libraries, and other assets that make up a software application. It
details the various third-party components and dependencies used in the software and helps to manage security and
compliance risks associated with those components.

The SBOM provides metadata about each component such as version, origin, license, and more. Reviewing the SBOM enables
organizations to track vulnerabilities, perform regular software maintenance, and ensure compliance with regulatory
requirements such as the European Union's General Data Protection Regulation (GDPR) and the Payment Card Industry Data
Security Standard (PCI DSS).

![sbom_scan.webp](/sbom_scan.webp)

## Configure an SBOM Scan

To initiate an SBOM scan, navigate to **Clusters** and select the cluster to scan. On the **Cluster Overview** page,
click the **Scans** tab, and expand the **Software Bill of Materials (SBOM)** drop-down menu. Select **Configure Scan**
and choose the desired SBOM format, scan scope, and an optional backup location. Confirm your changes.

Palette will identify every unique container image within your chosen scope and generate an SBOM for that image. Palette
also runs the SBOM through a vulnerability scanner to flag any Common Vulnerabilities and Exposures (CVEs). Palette
leverages two open-source tools from Anchore: [Syft](https://github.com/anchore/syft) for SBOM generation and
[Grype](https://github.com/anchore/grype) for vulnerability detection.

Suppose you specify a [backup location](backup-restore/backup-restore.md). In that case, the SBOM for each image will be
uploaded to your backup location, and you can subsequently download the SBOMs with the click of a button or using the
Palette API.

If a backup location is not provided, Palette will preserve all of the identified dependencies and vulnerabilities, but
the raw SBOMs will not be available for download. The report results are available for review regardless of their backup
location setting.

<br />

#### SBOM Scan Format

- [SPDX](https://github.com/spdx/spdx-spec/blob/v2.2/schemas/spdx-schema.json): A standard SBOM format widely used by
  organizations and governments. The SPDX format has been around longer than any other SBOM format.

- [CycloneDX](https://cyclonedx.org/specification/overview/): An open-source XML-based SBOM format that provides a
  standard representation of software components and their metadata.

- Syft JSON: Syft's custom SBOM format. The Syft SBOM format contains the most metadata compared to the other SBOM
  formats.

#### SBOM Scan Scopes

- Cluster: Scans all the images in your Kubernetes cluster.

- Namespace: Scans all images in a particular Kubernetes namespace.

- Label Selector: Scans all images used by all the Pods matching a label selector within a particular Kubernetes
  namespace.

- Pod: Scans all images used by a single Pod.

## Review SBOM Results

To review a completed scan, expand the **Software Bill of Materials (SBOM)** row. The expanded row displays the
completed report containing detailed information about every scanned image. The context column indicates every unique
use of each image, broken out by container name, namespace, and pod name. Each image may be used by various containers
within a given scope. The vulnerability summary column provides a condensed view of the vulnerability report, which can
be viewed in greater detail by clicking on any row in the scan report.

![sbom_results.webp](/sbom_results.webp)

Each identified image has its own detailed results page containing dependency and vulnerability reports. To review an
image's result page, select the **>** button. Regardless of the selected SBOM format, each dependency’s name, version,
and type is displayed, and each vulnerability's name, severity, code, impacted version, and fixed version is displayed.

Additional metadata will be included in the SBOM. Exactly what additional metadata is included depends on the selected
SBOM format.

![sbom_dependencies.webp](/sbom_dependencies.webp)

For each identified vulnerability, you can view the name, severity level, vulnerability code, installed or impacted
version, and the fix version (if a fix is available). Any CVEs documented in the
[NIST National Vulnerability Database](https://nvd.nist.gov/vuln) (NVD) will render as a hyperlink to the NVD detail
page for that particular vulnerability.

![sbom_vulnerabilities.webp](/sbom_vulnerabilities.webp)

## Scan Options

The following options are available for running cluster scans:

## On Demand

A cluster scan of any type can be started by navigating to the **Scans** tab of a cluster in Palette. Scan progress
displays as 'Initiated' and transitions to 'Completed' when the scan is complete.

| **On Demand Scan**                                         |
| ---------------------------------------------------------- |
| Select the cluster to scan -> Scan(top panel) -> Run Scan. |

## Scheduled

You can set a schedule for each scan type when you deploy the cluster, and you can change the schedule at a later time.

| **During Cluster Deployment**                                                       |
| ----------------------------------------------------------------------------------- |
| Add New Cluster -> Settings -> Schedule scans -> Enable and schedule desired scans. |

| **Running Cluster**                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------ |
| Select the cluster to scan -> Settings -> Cluster Settings -> Scan Policies -> Enable and schedule scans of your choice. |

### Schedule Options Available

This operation can be performed on all cluster types across all clouds. Schedule your compliance scan for month, day,
hour, or minute. The following options are available:

- Every week on Sunday at midnight.
- Every two weeks at midnight.
- Every month on the first day of the month at midnight.
- Every two months on the first day of the month at midnight
