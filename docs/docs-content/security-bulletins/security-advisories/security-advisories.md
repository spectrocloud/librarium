---
sidebar_label: "Security Advisories"
title: "Security Advisories"
description: "Palette Security Advisories for Common Vulnerabilities and Exposures (CVEs)."
icon: ""
hide_table_of_contents: false
tags: ["security", "cve", "advisories"]
---

Security advisories supplement <VersionedLink text="security bulletins" url="/security-bulletins/reports/" />, providing
additional details regarding vulnerabilities and offering remediation steps.

Refer to the [Archived Security Advisories](./archived-security-advisories.md) for a list of addressed security
advisories.

## Security Advisory 009 - crypto/tls TLS Session Resumption

- **Release Date**: February 5, 2026
- **Last Updated**: February 18, 2026
- **Severity**: CRITICAL
- **CVEs**: [CVE-2025-68121](https://nvd.nist.gov/vuln/detail/CVE-2025-68121)

### Summary

CVE-2025-68121 is a critical security vulnerability in the Go standard library (`crypto/tls`) that may allow unintended
TLS session resumption when certificate validation configuration changes between connections. Under specific conditions,
an attacker may resume a previously established TLS session even when updated certificate validation settings should
cause the connection to fail.

### Affected Deployments

- All Palette Enterprise and Palette VerteX deployment methods (multi-tenant SaaS, dedicated SaaS, and self-hosted)
- All workload clusters

### Impact

Successful exploitation may allow:

- Bypassing updated certificate validation policies
- Resuming unauthorized TLS sessions
- Compromising the confidentiality and integrity of session data

This can affect service-to-service communication and API traffic, depending on how the services use `crypto/tls` and
resume sessions.

### Fix Availability

An updated release containing a patched Go runtime is in development. This advisory will be updated when fixed versions
become available.

### Mitigations

Until a fix is available, customers may mitigate risk by monitoring and auditing controls to detect any unauthorized or
unexpected changes to root Certificate Authority (CA) or client CA bundles, including updates to Kubernetes Secrets and
ConfigMaps.

### Resources

- [CVE-2025-68121](https://nvd.nist.gov/vuln/detail/CVE-2025-68121)

## Security Advisory 008 - Nginx ingress Vulnerabilities

- **Release Date**: February 3, 2026
- **Last Updated**: February 3, 2026
- **Severity**: HIGH
- **CVEs**: [CVE-2026-1580](https://github.com/kubernetes/kubernetes/issues/136677),
  [CVE-2026-24512](https://github.com/kubernetes/kubernetes/issues/136678),
  [CVE-2026-24513](https://github.com/kubernetes/kubernetes/issues/136679),
  [CVE-2026-24514](https://github.com/kubernetes/kubernetes/issues/136680),
  [CVE-2025-15566](https://github.com/kubernetes/kubernetes/issues/136789)

### Summary

On February 3, 2026, Spectro Cloud became aware of and is tracking the coordinated disclosure of multiple
vulnerabilities recently disclosed in the Nginx ingress controller versions 1.13.0–1.13.6 and 1.14.0–1.14.2. These
vulnerabilities were fixed in versions 1.13.7 and 1.14.3.

The following vulnerabilities _do not_ affect our products, as we do not use these annotations:

- CVE-2026-1580 - (`auth-method` annotation)
- CVE-2026-24512 - (`rules.http.paths.path`)
- CVE-2026-24513 - (`auth-url` protection)
- CVE-2025-15566 (`auth-proxy-set-headers`)

The following vulnerability _does_ impact Palette Enterprise and Palette VerteX deployments:

- CVE-2026-24514 - Admission Controller denial of service

Nginx controller has been deprecated by the upstream provider, and we are in the process of migrating to Traefik ingress
controller. Until the migration to Traefik ingress is complete, we will be upgrading Nginx controller to version 1.13.7,
which will remediate this vulnerability.

Palette version 4.8.27 uses Nginx controller version 1.13.7. Refer to the
[release notes](../../release-notes/release-notes.md#february-5-2026---release-4827) for further information.

### Affected Deployments

<!-- prettier-ignore-start -->

1. **Workload Clusters**

   - All clusters using the <VersionedLink text="Nginx" url="/integrations/packs/?pack=nginx" /> pack.

2. **Palette Enterprise and Palette VerteX deployments**

   - CVE-2026-24514 affects all Palette Enterprise and Palette VerteX deployment methods (multi-tenant SaaS, dedicated SaaS, and self-hosted), as well as all workload clusters using the Nginx pack.

<!-- prettier-ignore-end -->

### Recommended Actions

<!-- prettier-ignore-start -->

We recommend taking the following actions to remediate CVE-2026-2451.

#### Multi-tenant and Dedicated SaaS Deployments

No action necessary. Deployments will be patched as part of the standard update process.

#### Palette Enterprise or VerteX Installed with Helm Charts

If you have any instances of Palette enterprise or VerteX installed via Helm Charts with the affected version of the
`ingress-nginx-controller` DaemonSet, you must update it to version `1.13.7`. Follow the steps below to download the
updated version of the component and update your instance.

1. Use the `kubeconfig` file and `kubectl` tool to access your Palette enterprise or VerteX cluster. Refer to the
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide for more information.

2. Check the image used by the `ingress-nginx-controller` DaemonSet in the `ingress-nginx` namespace.

   ```shell
   kubectl get daemonset ingress-nginx-controller --namespace ingress-nginx --output yaml | grep 'image:'
   ```

3. Once you identify the image, update its tag to `v1.13.7`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.3`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.7`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.7 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.3`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.7`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.7 --namespace ingress-nginx
  ```

#### Palette Enterprise or VerteX Installed with the Palette CLI

If you have any instances of Palette enterprise or VerteX installed via the Palette CLI with the affected version of the
`ingress-nginx-controller` DaemonSet, you must update it to version `1.13.7`. Follow the steps below to download the
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

6. Once you identify the image, update its tag to `v1.13.7`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.3`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.7`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.7 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.3`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.7`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.7 --namespace ingress-nginx
  ```

#### Airgap Palette Enterprise or VerteX

If you have any airgapped instances of Palette enterprise or VerteX using the affected version of the
`ingress-nginx-controller` DaemonSet, you must update it to version `1.13.7`. Follow the steps below to download the
updated version of the component and update your instance.

<Tabs>

<TabItem value="Palette Enterprise" label="Palette Enterprise">

1. Contact your Palette support representative to obtain the `airgap-palette-nginx` binary version `1.13.7`. Ensure the
   SHA of the binary is `ea6d7f28a24e100998ea382ab2d206f81dc33776ac98091815e794fb35b215ce`. Once obtained, upload the
   `airgap-palette-nginx` binary to the registry. Follow the
   [Usage Instructions](../../downloads/self-hosted-palette/additional-packs.md) guide for detailed steps on downloading
   and installing the binary.

2. Log in to the Palette system console.

3. From the left **Main Menu**, select **Administration > Pack Registries**. Then, next to the registry, click the
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

9. Once you identify the image, update its tag to `v1.13.7`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.3`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.7`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.7 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.3`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.7`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.7 --namespace ingress-nginx
  ```

</TabItem>

<TabItem value="Palette VerteX" label="Palette VerteX">

1. Contact your Palette support representative to obtain the `airgap-vertex-nginx` binary version `1.13.7`. Ensure the
   SHA of the binary is `ea6d7f28a24e100998ea382ab2d206f81dc33776ac98091815e794fb35b215ce`. Once obtained, upload the
   `airgap-vertex-nginx` binary to the registry. Follow the
   [Usage Instructions](../../downloads/palette-vertex/additional-packs.md) guide for detailed steps on downloading and
   installing the binary.

2. Log in to the Palette VerteX system console.

3. From the left **Main Menu**, select **Administration > Pack Registries**. Then, next to the registry, click the
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

9. Once you identify the image, update its tag to `v1.13.7`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.3`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.7`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.13.7 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.3`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.7`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.13.7 --namespace ingress-nginx
  ```

</TabItem>

</Tabs>

#### Airgap Workload Clusters Using the Nginx Pack

If you have any airgap workload clusters using the affected version of the Nginx pack, you must update the cluster
profile to version `1.13.7` of the Nginx pack. Follow the steps below to download the updated pack and modify your
cluster profile.

<Tabs>

<TabItem value="Palette Enterprise" label="Palette Enterprise">

1. Contact your Palette support representative to obtain the `airgap-pack-nginx` binary version `1.13.7`. Once obtained,
   upload the `airgap-pack-nginx` binary to the registry. Follow the
   [Usage Instructions](../../downloads/self-hosted-palette/additional-packs.md) guide for detailed steps on downloading
   and installing the binary.

2. Log in to the Palette system console.

3. From the left main menu, select **Administration > Pack Registries**. Then, next to the registry, click the three-dot
   button > **Sync**. Wait for the registry synchronization to complete.

4. Log in to the Palette console.

5. Update all cluster profiles currently using the affected version of the Nginx pack. Refer to the
   [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
   for instructions on how to update a cluster profile.

6. Apply the profile updates to all affected clusters. Refer to the
   [Apply Profile Updates to Clusters](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#apply-profile-updates-to-clusters)
   guide to learn how to apply profile updates to clusters.

</TabItem>

<TabItem value="Palette VerteX" label="Palette VerteX">

1. Contact your Palette support representative to obtain the `airgap-pack-nginx` binary version `1.13.7`. Follow the
   [Usage Instructions](../../downloads/palette-vertex/additional-packs.md) guide for detailed steps on downloading and
   installing the binary.

2. Log in to the Palette VerteX system console.

3. From the left main menu, select **Administration > Pack Registries**. Then, next to the registry, click the three-dot
   button > **Sync**. Wait for the registry synchronization to complete.

4. Log in to the Palette VerteX console.

5. Update all cluster profiles currently using the affected version of the Nginx pack. Refer to the
   [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
   for instructions on how to update a cluster profile.

6. Apply the profile updates to all affected clusters. Refer to the
   [Apply Profile Updates to Clusters](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#apply-profile-updates-to-clusters)
   guide to learn how to apply profile updates to clusters.

</TabItem>

</Tabs>

### Resources

For additional information, refer to the following GitHub Security Advisories:

- [CVE-2026-1580: ingress-nginx auth-method nginx configuration injection](https://github.com/kubernetes/kubernetes/issues/136677)
- [CVE-2026-24512: ingress-nginx rules.http.paths.path nginx configuration injection](https://github.com/kubernetes/kubernetes/issues/136678)
- [CVE-2026-24513: ingress-nginx auth-url protection bypass](https://github.com/kubernetes/kubernetes/issues/136679)
- [CVE-2026-24514: ingress-nginx Admission Controller denial of service](https://github.com/kubernetes/kubernetes/issues/136680)
- [CVE-2025-15566: ingress-nginx auth-proxy-set-headers nginx configuration injection](https://github.com/kubernetes/kubernetes/issues/136789)

## Security Advisory 007- MongoDB zlib Compression Memory

- **Release Date**: December 26, 2025
- **Last Updated**: December 29, 2025
- **Severity**: Critical
- **CVEs**: [CVE-2025-14847](https://nvd.nist.gov/vuln/detail/CVE-2025-14847)

### Summary

A critical unauthenticated vulnerability (CVE-2025-14847) was discovered in MongoDB Server’s handling of zlib-compressed
network traffic. Under certain conditions, a remote attacker can cause the server to include uninitialized heap memory
in its responses. Because this memory is drawn directly from the MongoDB process, the exposed data may contain fragments
of previously processed requests, internal state, or other sensitive information.

Exploitation requires no authentication. Any attacker with network access to a MongoDB instance that has compression
enabled can potentially trigger the issue. As a result, internal process memory becomes observable to an external
attacker, leading to unintended information disclosure.

#### Affected Versions

The following MongoDB Server versions are affected by CVE-2025-14847 when network compression is enabled:

- 3.6.x
- 4.0.x
- 4.2.x
- 4.4.0 - 4.4.29
- 5.0.0 - 5.0.31
- 6.0.0 - 6.0.26
- 7.0.0 - 7.0.26
- 8.0.0 - 8.0.16
- 8.2.0 - 8.2.2

#### Resolved Versions

The vulnerability is resolved in the following MongoDB Server releases:

- 4.4.30
- 5.0.32
- 6.0.27
- 7.0.28
- 8.0.17
- 8.2.3

### Mitigation

Network-level isolation of MongoDB instances and restricting access to trusted internal components reduces exposure.
Disabling network compression may further mitigate risk where feasible.

### Impact for Spectro Cloud

MongoDB is not directly exposed to the public internet in Palette Enterprise and Palette VerteX deployments.
Consequently, this vulnerability is not exploitable under normal operating conditions. Exploitation would require a
prior compromise that grants an attacker network-level access to the underlying infrastructure or cluster hosting the
deployment.

While MongoDB has rated this vulnerability as _critical_, Spectro Cloud’s deployment architecture significantly limits
the exploitation surface, resulting in a _low_ practical risk to Palette Enterprise and VerteX customers.

#### Implementation Plan

- All managed SaaS instances have been upgraded to a version that includes the fix for this vulnerability. No further
  action is required for these environments.
- All self-hosted Palette and VerteX deployments running the latest release currently use MongoDB 7.0.26 and will be
  upgraded to version 7.0.28.

This advisory will be updated to reflect availability of the fixes described above.

### Resources

- [Common Vulnerabilities and Exposures (CVE) - CVE-2025-14847](https://www.cve.org/CVERecord?id=CVE-2025-14847)
- [MongoDB Community Hub - Important MongoDB patch available](https://www.mongodb.com/community/forums/t/important-mongodb-patch-available/332977)
- [NIST: National Vulnerability Database - CVE-2025-14847 Detail](https://nvd.nist.gov/vuln/detail/CVE-2025-14847)
- [Upwind - CVE-2025-14847: MongoDB zlib Compression Memory Disclosure](https://www.upwind.io/feed/cve-2025-14847-mongodb-zlib-memory-disclosure)

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

### Resources

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

### Resources

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
