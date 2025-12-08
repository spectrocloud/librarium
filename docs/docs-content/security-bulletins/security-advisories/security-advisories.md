---
sidebar_label: "Security Advisories"
title: "Security Advisories"
description: "Palette Security Advisories for Common Vulnerabilities and Exposures (CVEs)."
icon: ""
toc_max_heading_level: 4
hide_table_of_contents: false
tags: ["security", "cve", "advisories"]
---

Security advisories supplement <VersionedLink text="security bulletins" url="/security-bulletins/reports/" />, providing
additional details regarding vulnerabilities and offering remediation steps.

## Security Advisory 006.1 - Shai Hulud npm Supply Chain Attack - Supplemental Update

- **Release Date**: December 1, 2025
- **Last Updated**: December 2, 2025
- **Severity**: High

### Summary

Following our [initial advisory](#security-advisory-006---shai-hulud-npm-supply-chain-attack) regarding the Shai Hulud
2.0 supply-chain malware campaign on November 26, 2025, we are issuing the following supplemental update to provide
additional transparency into our internal findings and response actions.

As part of our comprehensive, end-to-end investigation, we have identified limited areas of impact within internal
development and operational systems. At this time, we have **no evidence that any Spectro Cloud customer environments,
products, or managed SaaS services have been compromised**. However, out of an abundance of caution, we are proceeding
with the same rigor applied to a confirmed incident to ensure the integrity of our entire ecosystem.

The activity observed is consistent with the broader industry-wide attack pattern associated with Shai Hulud 2.0,
specifically targeting development workflows and supply-chain trust pathways.

### Immediate Mitigation Actions Underway

Our teams are working diligently to implement a comprehensive set of precautionary and containment measures. This
includes rotating all credentials and secrets, reviewing our build and dependency processes, adding safeguards to
strengthen our CI/CD workflows, and enhancing monitoring across our development and production systems. These steps are
being taken out of an abundance of caution to ensure the continued security and integrity of our platform.

We will continue to monitor evolving intelligence from security researchers, collaborate with our partners, and expand
our internal investigations as new indicators of compromise are published. This advisory will be updated with additional
findings as the investigation progresses.

### References

- [Reversing Labs - Shai-hulud npm attack: What you need to know](https://www.reversinglabs.com/blog/shai-hulud-worm-npm)
- [Socket - Updated and Ongoing Supply Chain Attack Targets CrowdStrike npm Packages](https://socket.dev/blog/ongoing-supply-chain-attack-targets-crowdstrike-npm-packages)
- [Step Security - Shai-Hulud: Self-Replicating Worm Compromises 500+ NPM Packages](https://www.stepsecurity.io/blog/ctrl-tinycolor-and-40-npm-packages-compromised)
- [Wiz - Shai-Hulud: Ongoing Package Supply Chain Worm Delivering Data-Stealing Malware](https://www.wiz.io/blog/shai-hulud-npm-supply-chain-attack)

## Security Advisory 006 - Shai Hulud npm Supply Chain Attack

- **Release Date**: November 26, 2025
- **Last Updated**: November 26, 2025
- **Severity**: High

### Summary

On November 21, 2025, security researchers identified Shai Hulud 2.0, a newly uncovered strain of malware that has
compromised more than 25,000 GitHub repositories. This variant introduces an advanced self-replicating architecture,
enabling it to autonomously propagate across software projects and potentially embed itself within development
workflows. Early analysis indicates that the malware is specifically engineered to exploit supply-chain trust mechanisms
by modifying code artifacts at the repository level.

Spectro Cloud products are not dependent on any of the npm packages affected by the incident. However, because many
customers integrate external CI/CD toolchains with Spectro Cloud products, a compromise of those toolchains could allow
malicious changes to flow through automation. Customers should scan their applications and integrations to assess the
impact of this issue.

Our security posture incorporates continuous scanning, automated policy enforcement, and rigorous supply-chain
validation controls designed to detect and block malicious or tampered components before they enter our build or
delivery pipelines. As part of our response, we are actively conducting comprehensive, end-to-end scans across all
internal IT systems, developer environments, and managed SaaS deployments. These measures are ongoing, and we are
prioritizing both accuracy and completeness in our investigation.

We will continue to monitor evolving intelligence from security researchers, collaborate with our partners, and expand
our internal investigations as new indicators of compromise are published. This advisory will be updated with additional
findings as the investigation progresses.

### References

- [Reversing Labs - Shai-hulud npm attack: What you need to know](https://www.reversinglabs.com/blog/shai-hulud-worm-npm)
- [Socket - Updated and Ongoing Supply Chain Attack Targets CrowdStrike npm Packages](https://socket.dev/blog/ongoing-supply-chain-attack-targets-crowdstrike-npm-packages)
- [Step Security - Shai-Hulud: Self-Replicating Worm Compromises 500+ NPM Packages](https://www.stepsecurity.io/blog/ctrl-tinycolor-and-40-npm-packages-compromised)
- [Wiz - Shai-Hulud: Ongoing Package Supply Chain Worm Delivering Data-Stealing Malware](https://www.wiz.io/blog/shai-hulud-npm-supply-chain-attack)

## Security Advisory 005 - `runc` Container Vulnerabilities Affecting Kubernetes Cluster Runtimes

- **Release Date**: November 5, 2025
- **Last Update**: November 6, 2025
- **Severity**: High
- **Applicable Deployments**:
  - Workload Clusters:
    - cloud-managed clusters: EKS, GKE, and AKS
    - Kubernetes distributions: PXK, RKE2, and K3s
  - Palette deployments:
    - SaaS Palette
    - self-hosted Palette

### Related CVEs

- [CVE-2025-31133](https://nvd.nist.gov/vuln/detail/CVE-2025-31133)
- [CVE-2025-52565](https://nvd.nist.gov/vuln/detail/CVE-2025-52565)
- [CVE-2025-52881](https://nvd.nist.gov/vuln/detail/CVE-2025-52881)

### Timeline

- **November 5, 2025**: First notified of vulnerabilities.

### Summary

The recently disclosed vulnerabilities in the `runc` container runtime involve unsafe handling of `/proc` writes during
container initialization and mount operations. Attackers exploiting these vulnerabilities could cause `runc` to
misdirect writes within `/proc`, potentially allowing:

- Execution of privileged host actions (for example, triggering `/proc/sysrq-trigger` to crash or hang the host).
- Read or write access to sensitive host information that would normally be masked.
- Disabling of AppArmor or Security-Enhanced Linux (SELinux) confinement.
- Modification of kernel parameters (for example, `core_pattern`).

### Recommended Actions

#### Workload Clusters

- Update cloud-managed clusters (EKS, GKE, and AKS) integrated with Palette Enterprise or Palette VerteX with patches
  from their respective cloud providers as soon as they become available.
- Patched OS images for other clusters will be available in future releases. Upgrade to the latest Kubernetes patch
  versions as soon as they are available.
- A patch for Edge clusters will be available in future releases. Upgrade clusters to the patched versions as soon as
  they are available.

#### SaaS Palette Deployments

No customer action is required. Multi-tenant and dedicated SaaS environments are being reviewed and patched as part of
the standard update process. Continuous compliance scans are enabled to identify nodes with pending patches.

#### Self-Hosted Palette Deployments

- For Palette environments hosted on cloud-managed Kubernetes clusters (such as EKS), update the underlying clusters
  with patches provided by the respective cloud vendors.
- For Palette environments deployed on customer-managed infrastructure, patched versions of Palette will be available in
  future releases. Upgrade your Palette environments to the patched versions as soon as they are available.
- Patched Palette and VerteX appliance images downloaded from Artifact Studio will also be made available in future
  releases. Use the updated appliance images when deploying or upgrading Palette and VerteX instances.

#### Additional Recommended Workaround

- Avoid using untrusted or unverified container images.
- Use rootless containers where possible to reduce the impact of potential runtime exploits.
- Restrict container `sysctl` configurations and disable host access to `/proc/sysrq-trigger` and
  `/proc/sys/kernel/core_pattern` where feasible.
- Reinforce Linux Security Module (LSM) enforcement and verify that AppArmor or SELinux profiles are correctly applied
  after applying patches.
- For detailed guidance on this Advisory, refer to:
  - [Canonical Advisory](https://ubuntu.com/security/CVE-2025-31133)
  - [SUSE Advisory](https://www.suse.com/security/cve/CVE-2025-31133.html)
  - [Red Hat Advisory](https://access.redhat.com/security/cve/cve-2025-31133)
  - [GitHub Security Advisory: `runc` CVE-2025-31133, CVE-2025-52565, CVE-2025-52881](https://github.com/opencontainers/runc/security/advisories)

## Security Advisory 004 - MongoDB: FIPS Mode Cryptographic Algorithm Use from Non-FIPS Providers

- **Release Date**: September 11, 2025
- **Last Updated**: September 11, 2025
- **Severity**: High
- **Applicable Deployments**: Self-Hosted Palette VerteX

### Summary

On September 11, 2025, Spectro Cloud became aware of a recently disclosed vulnerability related to the use of MongoDB
servers configured for FIPS mode, in which MongoDB incorrectly allows the use of cryptographic algorithms from non-FIPS
providers. This may allow client TLS connections to agree to use (negotiate) non-FIPS-compliant cryptographic algorithms
even when FIPS mode is enabled on MongoDB. As a result, self-hosted Palette VerteX deployments running on a
non-FIPS-compliant OS or Kubernetes cluster may allow negotiation of non-FIPS cryptographic algorithms.

For additional information regarding this advisory, refer to
[MongoDB Jira issue SERVER-109268](https://jira.mongodb.org/browse/SERVER-109268).

### Applicable Deployments

By default, Spectro Cloud enforces FIPS-only mode on the MongoDB container. Self-hosted Palette VerteX deployments, only
when running on a non-FIPS-compliant OS or Kubernetes cluster, may allow negotiation of non-FIPS cryptographic
algorithms.

Self-hosted instances that meet the
[FIPS prerequisite](../../self-hosted-setup/vertex/supported-environments/kubernetes/install/non-airgap.md#prerequisites)
as outlined in our user documentation are not affected by this vulnerability.

### Recommended Actions

Customers should verify their Palette VerteX setup to ensure they are not affected. No additional action is required for
customers with Palette VerteX installed on a FIPS-compliant OS or Kubernetes cluster.

MongoDB will be upgraded to the latest version in the next Palette release. Affected customers should either take the
appropriate actions to secure their environment to meet the FIPS prerequisite or upgrade their Palette VerteX
installation following the next Palette release.

## Security Advisory 003 - Self-Deleting Nodes with OwnerReference

- **Release Date**: August 14, 2025
- **Last Updated**: August 14, 2025
- **Severity**: Medium (5.4)
- **Affected Versions**: v1.31.0 - v1.31.11, v1.32.0 - v1.32.7, and v1.33.0 - v1.33.3

### Summary

A recently disclosed vulnerability in the `NodeRestriction` admission controller allows node users to delete their own
`Node` object by patching it with an `OwnerReference` to a cluster-scoped resource.

Normally, node users are authorized to create and patch their own `Node` object but not delete it. However, the
`NodeRestriction` controller does not block patches that set `OwnerReferences`, enabling a compromised node to delete
and then recreate its own `Node` object.

This recreation can bypass the usual restrictions on modifying taints or labels, allowing an attacker to change node
scheduling behavior and control which pods run on the compromised node.

This vulnerability affects all clusters using an affected Kubernetes version across all Palette Enterprise and Palette
VerteX releases.

For additional information regarding this advisory, refer to the
[Kubernetes GitHub issue](https://github.com/kubernetes/kubernetes/issues/133471).

### Recommended Actions

:::info

- This workaround will result in a cluster [repave](../../glossary-all.md#repavement).
- This workaround is not applicable for cloud-managed clusters such as EKS, GKE, and AKS. Refer to your cloud provider
  for steps on patching cloud-managed clusters.

:::

In the Kubernetes layer of the [infrastructure cluster profile](../../profiles/profiles.md) for the affected cluster,
enable the `OwnerReferencesPermissionEnforcement` admission controller by adding it to the `enable-admission-plugins`
argument under the `apiServer` section. After saving your changes, make sure to
[update](../../clusters/cluster-management/cluster-updates.md) all affected clusters.

When enabled, this admission controller prevents any user or service account from modifying an object’s
`OwnerReferences` unless they have delete permission on the owner object (the object referenced in `OwnerReferences`).

### Roadmap

Patch releases for Kubernetes versions 1.31, 1.32, and 1.33 that address this vulnerability will be available in future
Palette Enterprise and Palette VerteX releases. No patches will be available for 1.30 and older versions.

## Security Advisory 002 - Kubernetes Race Condition

This advisory outlines security vulnerabilities related to the use of the `os.RemoveAll` function in Go, which affects
Kubernetes clusters compiled with vulnerable Go versions, as well as the recommended remediation actions.

- **Release Date**: June 18, 2025
- **Last Updated**: June 18, 2025
- **Severity**: High
- **Affected Versions**: Kubernetes versions that were compiled with Go versions earlier than 1.21.11 or 1.22.4
- **Fixed Versions**: v1.27.15+, v1.28.11+, v1.29.6+, and v1.30.2+

### Related CVEs

This advisory has not been assigned a CVE.

### Timeline

- **June 17, 2025**: First notified of vulnerabilities.

### Summary

The identified vulnerability affects Kubernetes versions that were compiled with Go versions earlier than 1.21.11 or
1.22.4. The issue relates to the use of the `os.RemoveAll` function in Go. It involves a symlink race condition that
allows local non-root users (such as a containerized process) with the same UID as the Pod user to delete arbitrary
directories on a host node with root privileges. This issue is especially relevant in environments running multi-tenant
or untrusted workloads, where a compromised workload may pose a broader threat to the host.

All the clusters using an affected Kubernetes version must be updated manually. Users must review their cluster
profiles, workload clusters, and instances of Palette Enterprise or Palette VerteX, and upgrade the Kubernetes version
to a fixed version. The following Kubernetes versions, available in Palette Enterprise or Palette VerteX deployments for
workload cluster provisioning, are vulnerable.

| Palette Version          | Kubernetes Versions                                                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Palette Enterprise 4.6.x | Kubernetes < 1.30.2<br />Kubernetes < 1.29.6<br />Kubernetes < 1.28.11<br />Kubernetes < 1.27.15                           |
| Palette Enterprise 4.5.x | Kubernetes < 1.30.2<br />Kubernetes < 1.29.6<br />Kubernetes < 1.28.11<br />Kubernetes < 1.27.15<br />Kubernetes < 1.26.15 |
| Palette Enterprise 4.4.x | Kubernetes < 1.30.2<br />Kubernetes < 1.29.6<br />Kubernetes < 1.28.11<br />Kubernetes < 1.27.15<br />Kubernetes < 1.26.15 |
| Palette Enterprise 4.3.x | Kubernetes < 1.29.6<br />Kubernetes < 1.28.11<br />Kubernetes < 1.27.15<br />Kubernetes < 1.26.15                          |
| Palette Enterprise 4.2.x | Kubernetes < 1.28.11<br />Kubernetes < 1.27.15<br />Kubernetes < 1.26.15                                                   |
| Palette Enterprise 4.1.x | Kubernetes < 1.28.11<br />Kubernetes < 1.27.15<br />Kubernetes < 1.26.15                                                   |
| Palette Enterprise 4.0.x | Kubernetes < 1.27.15<br />Kubernetes < 1.26.15                                                                             |

### Recommended Actions

This vulnerability affects both workload clusters and Palette deployments. If you have any workload clusters, Palette
Enterprise or Palette VerteX clusters using an affected Kubernetes version, you must update the cluster to use one of
the patched versions (v1.27.15, v1.28.11, v1.29.6, and v1.30.2) or newer.

- Refer to the
  [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
  for instructions on how to update a cluster profile and apply the updates to workload clusters.

- Refer to the [Palette Enterprise](../../self-hosted-setup/palette/palette.md) or
  [Palette VerteX](../../self-hosted-setup/vertex/vertex.md) upgrade guides for guidance on upgrading the version for
  all connected and airgapped Palette Enterprise and Palette VerteX clusters.

## Security Advisory 001 - Nginx Vulnerability

This advisory outlines security vulnerabilities related to [ingress-nginx](https://github.com/kubernetes/ingress-nginx)
and the recommended remediation actions.

- **Release Date**: March 27, 2025
- **Last Updated**: April 8, 2025
- **Severity**: 9.8
- **Affected Versions**: All versions prior to v1.11.0, v1.11.0 - v1.11.4, and v1.12.0
- **Fixed Versions**: v1.11.5 and v1.12.1

### Related CVEs

Refer to the [Security Bulletins](../reports/reports.mdx) page for detailed information about each CVE.

- [CVE-2025-1097](https://docs.spectrocloud.com/security-bulletins/reports/pc-cve-2025-1097/)
- [CVE-2025-1098](https://docs.spectrocloud.com/security-bulletins/reports/pc-cve-2025-1098/)
- [CVE-2025-1974](https://docs.spectrocloud.com/security-bulletins/reports/pc-cve-2025-1974/)
- [CVE-2025-24513](https://docs.spectrocloud.com/security-bulletins/reports/pc-cve-2025-24513/)
- [CVE-2025-24514](https://docs.spectrocloud.com/security-bulletins/reports/pc-cve-2025-24514/)

### Timeline

- **March 24, 2025**: First notified of vulnerabilities.
- **March 24, 2025**: CVE bulletin published.
- **March 26, 2025**: New Nginx pack published.
- **March 26, 2025, 11:30 PM PST - March 27, 2025, 12:43 AM PST**: All managed Palette instances patched.
- **March 27, 2025**: Manual patch procedure provided for connected and airgapped Palette Enterprise and VerteX
  installations.
- **March 28, 2025**: Affected Nginx packs deprecated.
- **March 28, 2025**: Connected Palette Enterprise and VerteX patches available for versions 4.5 and 4.6.
- **April 1, 2025**: Connected Palette Enterprise and VerteX patches available for version 4.4.
- **April 2, 2025**: Airgapped Palette Enterprise and VerteX patches available for versions 4.4 and 4.6.
- **April 4, 2025**: Airgapped Palette Enterprise and VerteX patches available for version 4.5.

### Summary

The identified CVEs affect all ingress-nginx controller deployments using the vulnerable image versions mentioned in
this advisory. When chained together, the vulnerabilities can enable unauthenticated users to execute arbitrary code and
download confidential information such as secrets available in the cluster. These vulnerable images are used in the
Palette and VerteX management planes. Additionally, Spectro Cloud also provides the Nginx pack to customers for their
workload clusters, which contains several vulnerable image versions.

As of April 4, 2025, all vulnerable Nginx packs have been deprecated, all managed Palette instances have been patched,
and patches are available for connected and airgapped Palette Enterprise and VerteX versions 4.4 - 4.6.

All workload clusters across all Palette and VerteX installations must be updated manually. All users should review
their cluster profiles and workload clusters and upgrade the Nginx pack to version `1.11.5`.

### Recommended Actions

This vulnerability affects both workload clusters and Palette deployments.

- If you have any workload clusters using the affected version of the Nginx pack, you must update the cluster profile to
  use version `1.11.5` of the Nginx pack. Refer to the
  [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
  for instructions on how to update a cluster profile and apply the updates to workload clusters.

- Connected and airgapped Palette Enterprise and VerteX versions 4.4 - 4.6 must apply the latest patch to automatically
  upgrade the `ingress-nginx-controller` DaemonSet to version `1.11.5`. For guidance on upgrading your Palette version,
  refer to the [Palette Enterprise](../../self-hosted-setup/palette/palette.md) or
  [VerteX](../../self-hosted-setup/vertex/vertex.md) upgrade guide.

  :::warning

  If you do not apply the patch, follow the steps described in the upcoming sections to manually upgrade the controller
  version.

  :::

#### Multi-Tenant and Dedicated SaaS Palette

As of March 26, 2025, the `ingress-nginx-controller` DaemonSet used for multi-tenant and dedicated SaaS Palette has been
upgraded to version `1.11.5`.

Workload clusters must be identified and updated manually to use version `1.11.5` of the Nginx pack. Follow the below
instructions to upgrade Nginx.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left main menu and select **Clusters**.

3. Select a workload cluster to review. Navigate to the cluster's **Profile** tab and note if the cluster profile being
   used contains Nginx.

4. Repeat step 3 for each cluster to ensure all cluster profiles using Nginx are identified.

5. Update all cluster profiles currently using the affected version of the Nginx pack to `1.11.5`. Refer to the
   [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
   for instructions on how to update a cluster profile.

6. Apply the profile updates to all affected clusters. Refer to the
   [Apply Profile Updates to Clusters](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#apply-profile-updates-to-clusters)
   guide to learn how to apply profile updates to clusters.

#### Palette Enterprise or VerteX Installed with Helm Charts

If you have any instances of Palette enterprise or VerteX installed via Helm Charts with the affected version of the
`ingress-nginx-controller` DaemonSet, you must update it to version `1.11.5`. Follow the steps below to download the
updated version of the component and update your instance.

1. Use the `kubeconfig` file and `kubectl` tool to access your Palette enterprise or VerteX cluster. Refer to the
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide for more information.

2. Check the image used by the `ingress-nginx-controller` DaemonSet in the `ingress-nginx` namespace.

   ```shell
   kubectl get daemonset ingress-nginx-controller --namespace ingress-nginx --output yaml | grep 'image:'
   ```

3. Once you identify the image, update its tag to `v1.11.5`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.2`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.2`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

#### Palette Enterprise or VerteX Installed with the Palette CLI

If you have any instances of Palette enterprise or VerteX installed via the Palette CLI with the affected version of the
`ingress-nginx-controller` DaemonSet, you must update it to version `1.11.5`. Follow the steps below to download the
updated version of the component and update your instance.

1. Use the `kubeconfig` file and `kubectl` tool to access your Palette enterprise or VerteX cluster. Refer to the
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide for more information.

2. Scale down the `palette-controller-manager` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment palette-controller-manager --replicas=0 --namespace cluster-mgmt-*
   ```

3. Scale down the `cluster-management-agent` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment cluster-management-agent --replicas=0 --namespace cluster-mgmt-*
   ```

4. Confirm that both deployments have been scaled down to zero replicas. Replace `*` with the suffix associated with
   your namespace.

   ```shell
   kubectl get deployments --namespace cluster-mgmt-*
   ```

5. Check the image used by the `ingress-nginx-controller` DaemonSet in the `ingress-nginx` namespace.

   ```shell
   kubectl get daemonset ingress-nginx-controller --namespace ingress-nginx --output yaml | grep 'image:'
   ```

6. Once you identify the image, update its tag to `v1.11.5`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.2`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.2`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

#### Airgap Palette Enterprise or VerteX

If you have any airgapped instances of Palette enterprise or VerteX using the affected version of the
`ingress-nginx-controller` DaemonSet, you must update it to version `1.11.5`. Follow the steps below to download the
updated version of the component and update your instance.

<Tabs>

<TabItem value="Palette Enterprise" label="Palette Enterprise">

1. Contact your Palette support representative to obtain the `airgap-palette-nginx` binary version `1.11.5`. Ensure the
   SHA of the binary is `8148734578378da043b918f893f3bbfcae9d421b9ac4426e10762d832734e1dd`. Once obtained, upload the
   `airgap-palette-nginx` binary to the registry. Follow the
   [Usage Instructions](../../downloads/self-hosted-palette/additional-packs.md) guide for detailed steps on downloading
   and installing the binary.

2. Log in to the Palette system console.

3. From the left **Main Menu**, select **Administration > Pack Registries**. Then, next to the packs registry, click the
   three-dot button > **Sync**. Wait for the registry synchronization to complete.

4. Use the `kubeconfig` file and `kubectl` tool to access your Palette enterprise cluster. Refer to the
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide for more information.

5. Scale down the `palette-controller-manager` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment palette-controller-manager --replicas=0 --namespace cluster-mgmt-*
   ```

6. Scale down the `cluster-management-agent` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment cluster-management-agent --replicas=0 --namespace cluster-mgmt-*
   ```

7. Confirm that both deployments have been scaled down to zero replicas. Replace `*` with the suffix associated with
   your namespace.

   ```shell
   kubectl get deployments --namespace cluster-mgmt-*
   ```

8. Check the image used by the `ingress-nginx-controller` DaemonSet in the `ingress-nginx` namespace.

   ```shell
   kubectl get daemonset ingress-nginx-controller --namespace ingress-nginx --output yaml | grep 'image:'
   ```

9. Once you identify the image, update its tag to `v1.11.5`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.2`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.2`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

</TabItem>

<TabItem value="Palette VerteX" label="Palette VerteX">

1. Contact your Palette support representative to obtain the `airgap-vertex-nginx` binary version `1.11.5`. Ensure the
   SHA of the binary is `846c1e92f32ddd9a8da7eebd5b6d05517c5626a11e64c34acdf093dacdcb7310`. Once obtained, upload the
   `airgap-vertex-nginx` binary to the registry. Follow the
   [Usage Instructions](../../downloads/palette-vertex/additional-packs.md) guide for detailed steps on downloading and
   installing the binary.

2. Log in to the Palette VerteX system console.

3. From the left **Main Menu**, select **Administration > Pack Registries**. Then, next to the packs registry, click the
   three-dot button > **Sync**. Wait for the registry synchronization to complete.

4. Use the `kubeconfig` file and `kubectl` tool to access your Palette enterprise cluster. Refer to the
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide for more information.

5. Scale down the `palette-controller-manager` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment palette-controller-manager --replicas=0 --namespace cluster-mgmt-*
   ```

6. Scale down the `cluster-management-agent` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment cluster-management-agent --replicas=0 --namespace cluster-mgmt-*
   ```

7. Confirm that both deployments have been scaled down to zero replicas. Replace `*` with the suffix associated with
   your namespace.

   ```shell
   kubectl get deployments --namespace cluster-mgmt-*
   ```

8. Check the image used by the `ingress-nginx-controller` DaemonSet in the `ingress-nginx` namespace.

   ```shell
   kubectl get daemonset ingress-nginx-controller --namespace ingress-nginx --output yaml | grep 'image:'
   ```

9. Once you identify the image, update its tag to `v1.11.5`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.2`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.2`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

</TabItem>

</Tabs>

#### Airgap Workload Clusters Using the Nginx Pack

If you have any airgap workload clusters using the affected version of the Nginx pack, you must update the cluster
profile to version `1.11.5` of the Nginx pack. Follow the steps below to download the updated pack and modify your
cluster profile.

<Tabs>

<TabItem value="Palette Enterprise" label="Palette Enterprise">

1. Contact your Palette support representative to obtain the `airgap-pack-nginx` binary version `1.11.5`. Ensure the SHA
   of the binary is `f526bdf9fba8031d50846e503ea8011d67ffdc23b9331a62ebe644ae49c06fb1`. Once obtained, upload the
   `airgap-pack-nginx` binary to the registry. Follow the
   [Usage Instructions](../../downloads/self-hosted-palette/additional-packs.md) guide for detailed steps on downloading
   and installing the binary.

2. Log in to the Palette system console.

3. From the left main menu, select **Administration > Pack Registries**. Then, next to the packs registry, click the
   three-dot button > **Sync**. Wait for the registry synchronization to complete.

4. Log in to the Palette console.

5. Update all cluster profiles currently using the affected version of the Nginx pack. Refer to the
   [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
   for instructions on how to update a cluster profile.

6. Apply the profile updates to all affected clusters. Refer to the
   [Apply Profile Updates to Clusters](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#apply-profile-updates-to-clusters)
   guide to learn how to apply profile updates to clusters.

</TabItem>

<TabItem value="Palette VerteX" label="Palette VerteX">

1. Contact your Palette support representative to obtain the `airgap-pack-nginx` binary version `1.11.5`. Ensure the SHA
   of the binary is `f526bdf9fba8031d50846e503ea8011d67ffdc23b9331a62ebe644ae49c06fb1`. Once obtained, upload the
   `airgap-pack-nginx` binary to the registry. Follow the
   [Usage Instructions](../../downloads/palette-vertex/additional-packs.md) guide for detailed steps on downloading and
   installing the binary.

2. Log in to the Palette VerteX system console.

3. From the left main menu, select **Administration > Pack Registries**. Then, next to the packs registry, click the
   three-dot button > **Sync**. Wait for the registry synchronization to complete.

4. Log in to the Palette VerteX console.

5. Update all cluster profiles currently using the affected version of the Nginx pack. Refer to the
   [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
   for instructions on how to update a cluster profile.

6. Apply the profile updates to all affected clusters. Refer to the
   [Apply Profile Updates to Clusters](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#apply-profile-updates-to-clusters)
   guide to learn how to apply profile updates to clusters.

</TabItem>

</Tabs>
