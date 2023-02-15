---
title: "Compliance Scan"
metaTitle: "Managing Cluster Update Events on Palette"
metaDescription: "Events and Notifications on Cluster Updates"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

 # Overview

Palette provides a way to run compliance, security, conformance, and software bill of materials (SBOM) scans on tenant clusters. These scans ensure cluster adherence to specific compliance and security standards. The scans also detect potential vulnerabilities by performing penetration tests.

Palette supports four types of scans. Each scan generates reports with details specific to the type of scan. You can initiate multiple scans of each type over time. In addition, Palette keeps a history of previous scans for comparison purposes. To learn more about each scan type, refer to the following sections.

# Configuration Security

This scan examines the compliance of deployed Kubernetes security features against the CIS Kubernetes Benchmarks. CIS Kubernetes Benchmarks are consensus-driven security guidelines for the Kubernetes. Different releases of the CIS benchmark cover different releases of Kubernetes. By default, Kubernetes configuration security will determine the test set based on the Kubernetes version running on the cluster being scanned. Internally, Palette leverages an open-source tool called KubeBench from Aqua Security to perform this scan. Scans are run against master and worker nodes of the Kubernetes cluster, and a combined report is made available on the UI. Users can filter the report to view only the master or worker results if required.

All the tests in the report are marked as Scored or Not Scored. The ones marked Not Scored cannot be automatically run, and it is suggested to be tested manually.

![kcs.png](/kcs.png)

# Penetration Testing

Kubernetes penetration testing scans Kubernetes-related open-ports for any configuration issues that can leave the tenant clusters exposed to attackers. It hunts for security issues in your Kubernetes clusters and increases awareness and visibility of the security controls in Kubernetes environments. The scan gives a full report on the cluster security concerns. Internally Palette leverages an open-source tool called KubeHunter from Aqua Security to perform this scan. Scans are run in 2 modes, Internal and External. In the internal mode, tests are run against the internal endpoint of the API server, whereas, in external mode, the external public-facing endpoint is used for testing. A combined report of vulnerabilities found in both modes is shown on the Palette UI. Users can filter the report to view just the internal or external report if required.

![kpt.png](/kpt.png)

# Conformance Testing

Kubernetes conformance testing is about validating your Kubernetes configuration to ensure that they are conformant to the CNCF specifications. Palette leverages an open-source tool called Sonobuoy to perform this scan.  Automatically select a subset of relevant tests for execution based on the type of cloud (public, private) and the type of deployment infrastructure (IaaS, managed cloud service). Each test can take up to 2 hours to complete. If a cluster has a single worker node, a few tests may fail due to resources. For accurate assessment of conformance for distribution of Kubernetes, set up a cluster with at least two worker nodes. These tests are not destructive. However, they do launch several workloads in test namespaces as part of the tests. As a result, the consumption of cluster resources during the test run duration increases and may impact other workloads running on the cluster.

The scan summary of total passed and failed tests are displayed while the test is in progress. In addition, a complete overview of the tests that were run is displayed after the completion of the report.

![conformance.png](/conformance.png)

# SBOM: Dependencies & Vulnerabilities

## What is an SBOM?
An SBOM is a comprehensive list of the components, libraries, and other assets that make up a software application. It details the various third-party components and dependencies used in the software and helps in managing security and compliance risks associated with those components.

The SBOM provides metadata about each component, such as version, origin, license, and more. Reviewing the SBOM enables organizations to track vulnerabilities, perform regular software maintenance, and ensure compliance with regulatory requirements such as the European Union's General Data Protection Regulation (GDPR) and the Payment Card Industry Data Security Standard (PCI DSS).

![sbom_scan.png](/sbom_scan.png)

## Configuring an SBOM scan
All you have to do is click “Configure Scan”, select your desired SBOM format, scan scope, and an optional backup location, and click “Confirm”.

Palette will identify every unique container image within your chosen scope and not only generate an SBOM for that image, but also run the SBOM through a vulnerability scanner that will flag CVEs. Palette leverages two open source tools from Anchore for this purpose: [Syft](https://github.com/anchore/syft) for SBOM generation and [Grype](https://github.com/anchore/grype) for vulnerability detection.

If a [backup location](/clusters/cluster-management/backup-restore) is provided, the SBOM for each image will be uploaded to your backup location and can subsequently be downloaded with the click of a button or using the Palette API. If a backup location is not provided, Palette will still preserve all of the dependencies and vulnerabilities that were identified, but the raw SBOMs will not be available for download. All the results and metadata pictured in the screenshots below will be included even without a backup location configured, except when using the **github-json** format, in which case a backup location must be provided.

<br />

<WarningBox>
A Backup Location is <b>mandatory</b> when configuring an SBOM scan using the <b>github-json</b> format.
</WarningBox>

<br />

#### SBOM scan formats
* [SPDX](https://github.com/spdx/spdx-spec/blob/v2.2/schemas/spdx-schema.json)
  * A standardized format for representing Software Bill of Materials that is widely used by organizations and governments. It has been around longer than any other SBOM format.
* [CycloneDX](https://cyclonedx.org/specification/overview/)
  * An open-source XML format that provides a standard representation of software components and their metadata.
* GitHub's [dependency submission format](https://docs.github.com/en/rest/dependency-graph/dependency-submission?apiVersion=2022-11-28)
  * Can be used to power a [dependency review workflow](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review).
* Syft JSON
  * Syft's custom SBOM format. Contains the most complete metadata out of the four options.

#### SBOM scan scopes
* Cluster
  * Scan **all** images in your K8s cluster
* Namespace
  * Scan all images in a particular **Namespace**
* Label Selector
  * Scan all images used by all of the Pods matching a **label selector** within a particular Namespace
* Pod
  * Scan all images used by a single **Pod**

## Viewing SBOM scan results
You can click into a completed scan to view a scan report containing additional detail for every image that was scanned. The context column indicates every unique usage of each image, broken out by container name, namespace, and pod name, as each image may be in use by various containers within a given scope. The vulnerability summary column provides a condensed view of the vulnerability report, which can be viewed in greater detail by clicking on any row in the scan report.

![sbom_results.png](/sbom_results.png)

Each image details page within the scan report provides a list of dependencies and vulnerabilities. These tables are condensed highlights of the metadata contained in the SBOM that was generated for a particular image. Each dependency’s version and type is displayed, but additional metadata will be included in the SBOM. Exactly what additional metadata is included will depend on the selected SBOM format.

![sbom_dependencies.png](/sbom_dependencies.png)

For each vulnerability, you can view the name, severity level, vulnerability code, installed or impacted version, and the fix version (if a fix is available). Any CVEs documented in the [NIST National Vulnerability Database](https://nvd.nist.gov/vuln) (NVD) will render as a hyperlink to the NVD detail page for that particular vulnerability.

![sbom_vulnerabilities.png](/sbom_vulnerabilities.png)

# Scan Options

The following options are available for running cluster scans:
   
## On Demand
A cluster scan of any type can be started by navigating to the scans tab of a cluster on the UI. The scan shows up as 'initiated' and transitions to 'Completed' when the scan is complete.

|__On Demand Scan__|
|------------------|
|Select the cluster to scan -> Scan(top panel) -> Run Scan|

## Scheduled
A schedule can be set for each type of scan at the time of deploying the cluster initially. The schedule can also be (re)set at a later point.

|__During Cluster Deployment__|
|-----------------------------|
|Add New Cluster -> Cluster Policies -> Scan Policies -> Enable and schedule desired scans|

|__Running Cluster__|
|----------------------|
|Select the cluster to scan -> Settings -> Cluster Settings -> Scan Policies -> Enable and schedule scans of your choice|

### Schedule Options Available

* Schedule your compliance scan for an exact month, day, hour, and minute
* E.g.:
  * Every week on Sunday at midnight
  * Every two weeks at midnight
  * Every month on the 1st at midnight
  * Every two months on the 1st at midnight

<InfoBox>
    This operation can be performed on all cluster types across all clouds
</InfoBox>
