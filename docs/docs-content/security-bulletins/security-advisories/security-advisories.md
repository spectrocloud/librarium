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

<!-- Commenting out Archived Security Advisories as they don't exist in Version 4.7

Refer to the [Archived Security Advisories](./archived-security-advisories.md) page for a list of addressed security
advisories. -->

:::tip

Stay informed and <VersionedLink text="subscribe" url="/security-advisories.xml" /> to receive updates when new security
advisories are published.

:::

## Security Advisory 018 - Multiple Container Runtime Vulnerabilities

- **Release Date**: June 24, 2026
- **Last Updated**: June 24, 2026
- **CVEs**:
  - [CVE-2026-50195](#cve-2026-50195---improper-validation-during-container-restoration)
  - [CVE-2026-53488](#cve-2026-53488---improper-handling-of-container-image-metadata)
  - [CVE-2026-53492](#cve-2026-53492---improper-validation-of-restoration-metadata)
  - [CVE-2026-53489](#cve-2026-53489---arbitrary-host-file-read-via-symlinked-log-paths)
  - [CVE-2026-47262](#cve-2026-47262---resource-exhaustion-leading-to-service-disruption)

### Overview

Multiple vulnerabilities have been identified in [containerd](https://github.com/containerd/containerd) that could allow
attackers to achieve remote code execution, privilege escalation, information disclosure, denial of service, and bypass
Kubernetes security controls.

The vulnerabilities affect multiple container runtime components responsible for image management, container
restoration, resource access controls, logging, and workload lifecycle operations.

### CVE-2026-50195 - Improper Validation During Container Restoration

- **Severity**: HIGH
- **CVSS Score**: 8.8

A flaw in container restoration handling may allow a malicious actor with the ability to influence restoration
operations to affect other workloads on the same node. Under certain conditions, successful exploitation could result in
unauthorized code execution within other workloads.

#### Impact

- Cross-pod code execution
- Compromise of workloads sharing a node
- Potential lateral movement within a Kubernetes cluster

### CVE-2026-53488 - Improper Handling of Container Image Metadata

- **Severity**: HIGH
- **CVSS Score**: 8.3

A vulnerability in the processing of container image metadata could allow a specially crafted image to trigger
unintended actions on an affected host. Successful exploitation may result in elevated access on the node.

#### Impact

- Arbitrary host command execution
- Potential node compromise
- Escalation from image author to node-level access

None of the annotations required for exploitation are enabled by default on Palette deployments or workload clusters.

### CVE-2026-53492 - Improper Validation of Restoration Metadata

- **Severity**: MEDIUM
- **CVSS Score**: 6.8

A vulnerability affecting container restoration workflows may allow security controls governing device and resource
access to be bypassed. Under certain circumstances, an attacker could gain access to resources that would otherwise be
restricted.

#### Impact

- Unauthorized device access
- Host mount injection
- Bypass of Kubernetes device enforcement policies

### CVE-2026-53489 - Arbitrary Host File Read via Symlinked Log Paths

- **Severity**: MEDIUM
- **CVSS Score**: 6.5

A flaw in restoration-related file handling may allow unauthorized access to information stored on the host system.
Successful exploitation could result in exposure of sensitive data.

#### Impact

- Arbitrary host file read
- Exposure of sensitive configuration or credential data

### CVE-2026-47262 - Resource Exhaustion Leading to Service Disruption

- **Severity**: MEDIUM
- **CVSS Score**: 6.8

A vulnerability in image processing may allow an attacker to cause excessive resource consumption on an affected node.
Successful exploitation could disrupt container management services and impact workload availability.

#### Impact

- Node-level denial of service
- Container startup and management failures
- Potential disruption of all workloads on the affected node

### Affected Deployments

- Workload Clusters
  - Managed Kubernetes clusters (EKS, AKS, GKE)
  - PXK clusters managed through Palette
  - RKE2 and K3s clusters managed through Palette
  - Palette Enterprise and Palette VerteX deployments
- Palette Enterprise & Palette VerteX Deployments
  - SaaS deployments
  - Self hosted deployments

### Mitigation and Remediation

- SaaS deployments
  - Multi-tenant and dedicated SaaS clusters are being reviewed and patched as part of the standard update.
- Self-Hosted Palette Enterprise and Palette VerteX Deployments
  - Self-hosted installations deployed on managed Kubernetes clusters, such as EKS, should update the clusters with the
    fixes provided by the cloud vendor.
  - Deployments on customer infrastructure must upgrade to Kubernetes versions that include the patches.
  - Patched versions of the Palette Enterprise and Palette VerteX appliances downloaded from Artifact Studio will be
    available in an upcoming release.
- Workload Clusters
  - Managed Kubernetes clusters (AKS, EKS, GKE) managed by Palette or VerteX should be updated with patches from the
    cloud vendor as soon as they are available. This requires patching the OS on cluster nodes. For guidance on patching
    cluster nodes, refer to [OS Patching](../../clusters/cluster-management/os-patching.md).
  - Patched OS images for other clusters will be available in an upcoming release. We advise all customers to upgrade to
    the latest Kubernetes patch versions as soon as they are available.
  - Patches for Edge clusters will be available in an upcoming release. We advise all customers to upgrade the clusters
    to the patched versions as soon as possible.

Until you can deploy patches, consider the following mitigations:

- Restrict the use of checkpoint and restore functionality to trusted administrators.
- Disable checkpoint and restore if it is not required.
- Disable the Container Device Interface (CDI) where device injection capabilities are not needed.
- Enforce image provenance and only allow trusted container images from approved registries.
- Implement image signing and verification controls.
- Restrict node access and monitor for unexpected container restores.
- Audit Kubernetes workloads for unauthorized device assignments, host mounts, and privileged execution.
- Monitor containerd processes for abnormal memory consumption and unexpected restarts.

### References

- [GitHub Advisories](https://github.com/containerd/containerd/security/advisories?page=1)
- [AWS Advisory](https://aws.amazon.com/security/security-bulletins/2026-046-aws/)

## Security Advisory 017 - Improper Access Control for Debugging and Profiling Interface in Stylus

- **Release Date**: June 4, 2026
- **Last Updated**: June 15, 2026
- **Severity**: HIGH

### Summary

Spectro Cloud has identified an issue where the
[Go debugging and profiling interface (`debug/pprof`)](https://pkg.go.dev/net/http/pprof) may be accessible on certain
ports on Stylus (Palette Edge agent) deployments. The exposed interface is intended for application debugging and
performance analysis. If accessible, it can provide detailed runtime information about the process, including goroutine
stacks, heap information, memory allocations, thread information, and CPU profiling data.

Spectro Cloud is not aware of any evidence of active exploitation in customer environments at the time of publication.
Spectro Cloud has identified the root cause and is developing a fix.

### Affected Deployments

- [Centrally managed Edge clusters](../../clusters/edge/edge-native-lifecycle.md#central-clusters)
- [Locally managed Edge clusters](../../clusters/edge/edge-native-lifecycle.md#local-clusters)
- Self-hosted [Palette Management Appliance](../../enterprise-version/install-palette/palette-management-appliance.md)
  and [VerteX Management Appliance](../../vertex/install-palette-vertex/vertex-management-appliance.md) installations

### Impact

Successful access to the exposed `debug/pprof` endpoint may allow an authenticated or network-adjacent attacker to
obtain sensitive runtime information, including:

- Goroutine stack traces
- Memory allocation and heap information
- Thread creation statistics
- Process execution traces
- Command-line runtime parameters

While the interface does not directly provide remote code execution, exposed profiling information may assist attackers
in reconnaissance, vulnerability research, denial-of-service analysis, or chaining with other vulnerabilities. The risk
is limited to environments where the endpoint is reachable over the network.

### Recommended Actions

Customers are encouraged to take the following actions:

- Restrict network access to affected ports to required Kubernetes control-plane components only.
- Review firewall rules, security groups, and network policies to ensure the endpoint is not accessible from untrusted
  networks.
- Block direct user or workload access where possible.
- Apply network segmentation controls.
- Monitor for unexpected access attempts to `/debug/pprof/*` endpoints.
- Upgrade to a fixed release once remediation becomes available.

### Fix Availability

Palette and Palette VerteX version 4.7.45 has addressed this security advisory.

## Security Advisory 016 - Upload Service Authentication Bypass

- **Release Date**: June 4, 2026
- **Last Updated**: June 15, 2026
- **Severity**: CRITICAL

### Summary

Spectro Cloud has identified and remediated a vulnerability that could allow unauthenticated users to
[upload content bundles](../../clusters/edge/local-ui/cluster-management/upload-content-bundle.md) to Edge hosts under
certain conditions. The issue was corrected in Palette version 4.9.14.

The vulnerability resulted from an authentication validation logic error that could permit requests that did not provide
valid authentication credentials to bypass intended access controls for the upload endpoint.

### Affected Deployments

This issue affects all multi-tenant SaaS, dedicated SaaS, self-hosted, and appliance-based deployments earlier than
version 4.9.14.

### Impact

A successful exploitation of this vulnerability could have allowed an unauthenticated actor with network access to the
affected upload service endpoint to upload content bundles to the Edge host. Depending on the deployment configuration
and network exposure of the affected endpoint, an attacker may have been able to write files to locations used by the
content management service. This could result in unauthorized modification of content stored on the affected Edge
system.

Spectro Cloud has not identified evidence of active exploitation of this vulnerability in customer environments at the
time of this advisory.

### Fix Availability

This issue has been fully remediated in release 4.9.14 for the Spectro Cloud managed SaaS solution.

Additionally, Palette and Palette VerteX version 4.7.45 has addressed this security advisory.

### Recommended Actions

Customers are encouraged to take the following actions:

- Upgrade self-hosted deployments to 4.9.14 or a later as soon as possible.
- Upgrade both the Palette software and the Edge host components. Ensure that affected Edge hosts are upgraded to the
  corresponding Stylus Agent version (4.9.10) containing the fix.
- Review system and application logs for unexpected upload activity.

### References

- [CWE-287 - Improper Authentication](https://cwe.mitre.org/data/definitions/287.html)
- [CWE-306 - Missing Authentication for Critical Function](https://cwe.mitre.org/data/definitions/306.html)
- [OWASP Top 10 2021 A01 – Broken Access Control](https://owasp.org/Top10/2021/A01_2021-Broken_Access_Control/index.html)
- [OWASP Top 10 2021 A07 – Identification and Authentication Failures](https://owasp.org/Top10/2021/A07_2021-Identification_and_Authentication_Failures/index.html)

## Security Advisory 015 - Exposure of Cluster-Scoped Service Credentials Through Manifest Endpoints

- **Release Date**: June 3, 2026
- **Last Updated**: June 15, 2026
- **Severity**: HIGH

### Summary

Spectro Cloud has identified a security vulnerability affecting specific manifest-related API endpoints, which, under
certain conditions, may expose cluster-scoped service credentials.

The impact is architecturally isolated. Service credentials are restricted tokens that do not permit direct access to
any management plane APIs. The issue is confined to the affected cluster, with no evidence of cross-tenant exposure.
Spectro Cloud confirms that no administrative kubeconfig assets are exposed by this issue.

Spectro Cloud is actively developing and validating remediation measures to enhance protections around the affected
endpoints and their credential handling.

### Affected Deployments

All Palette Enterprise and Palette VerteX deployment methods (multi-tenant SaaS, dedicated SaaS, and self-hosted) are
affected, specifically:

- Clusters originally created outside of Palette and subsequently imported into or taken over by Palette
- Private Cloud Gateways (PCGs) created using the Palette CLI

All clusters created and continuously managed by Palette (workload clusters) are _not_ affected.

### Impact

Under specific conditions, the exposure of cluster-scoped service credentials could grant an attacker limited access to
a subset of cluster-associated services. Crucially, this vulnerability does not provide direct access to core management
functions or administrative assets.

Several existing, in-place controls significantly reduce the practical impact of this issue:

- Credentials are scoped and limited to a single cluster.
- Authorization enforcement prevents access outside the associated environment.
- Credentials are automatically invalidated upon deletion of the associated cluster or PCG.

### Fix Availability

Palette and Palette VerteX version 4.7.45 has addressed this security advisory. Self-hosted customers are advised to
upgrade their Palette version.

### Recommended Actions

Customers are encouraged to implement the following actions to further reduce potential exposure:

- Restrict network access to management interfaces and APIs.
- Limit access exclusively to trusted administrative networks.
- Actively monitor for unexpected or anomalous API activity.
- Adhere to standard credential and cluster lifecycle management best practices.

## Security Advisory 012 - Nginx Ingress Comment-Based Configuration Injection Vulnerability

- **Release Date**: March 23, 2026
- **Last Updated**: April 9, 2026
- **Severity**: HIGH (CVSS 8.8)
- **CVEs**: [CVE-2026-4342](https://github.com/kubernetes/kubernetes/issues/137893)

### Summary

A security issue was discovered in [`ingress-nginx`](https://github.com/kubernetes/ingress-NGINX), where certain
combinations of Ingress annotations can be used to inject configurations into Nginx. This can lead to arbitrary code
execution in the context of the `ingress-nginx` controller and the disclosure of Secrets accessible to the controller.
In the default `ingress-nginx` installation, the controller can access all Secrets cluster-wide.

#### Affected Versions

The following Nginx versions are affected by [CVE-2026-4342](https://github.com/kubernetes/kubernetes/issues/137893):

- v1.15.0
- v1.14.0 - v1.14.4
- v1.13.0 - v1.13.8

#### Affected Deployments

<!-- prettier-ignore-start -->

- **Palette Enterprise and Palette VerteX environments** - All multi-tenant SaaS, dedicated SaaS, self-hosted, and
  appliance-based deployments earlier than version 4.7.39.
- **Workload Clusters** - All workload clusters using the <VersionedLink text="Nginx" url="/integrations/packs/?pack=nginx" /> pack with an affected Nginx version.

<!-- prettier-ignore-end -->

### Impact

An attacker with the ability to create or modify Ingress resources can exploit this vulnerability to inject arbitrary
Nginx configurations, leading to remote code execution in the `ingress-nginx` controller and the potential exposure of
Kubernetes Secrets.

### Fix Availability

<!-- prettier-ignore-start -->

- **Multi-Tenant and Dedicated SaaS Deployments** - All SaaS environments have been patched as part of the standard update
  process. No action is required.
- **Self-Hosted Deployments** - Palette version 4.7.39 has the fixed version of the `ingress-nginx` controller. Users should update their environments to this version..
- **Workload Clusters** - Upgrade
  your workload clusters to use the latest version of the <VersionedLink text="Nginx" url="/integrations/packs/?pack=nginx" /> pack. If using vendor-managed ingress add-ons, follow your cloud provider's patch guidance.

<!-- prettier-ignore-end -->

### Mitigation

Restrict Ingress creation to trusted users, disable or block unsafe annotations (such as snippet directives), and
enforce admission policies to validate Ingress configurations. Additionally, minimize `ingress-nginx` controller
privileges, limit its access to Secrets, and monitor for suspicious Ingress changes.

## Resources

- [NIST](https://nvd.nist.gov/vuln/detail/CVE-2026-4342)
- [GitHub Security Advisory](https://github.com/kubernetes/kubernetes/issues/137893)

<!-- NOTE: Security Advisory 11 was not posted publicly and was communicated to affected customers only-->

## Security Advisory 010 - Nginx Ingress Configuration Injection Vulnerability

- **Release Date**: March 10, 2026
- **Last Updated**: April 9, 2026
- **Severity**: HIGH
- **CVEs**: [CVE-2026-3288](https://github.com/kubernetes/kubernetes/issues/137560)

### Summary

A vulnerability has been identified in the Kubernetes `ingress-nginx` controller where the
`nginx.ingress.kubernetes.io/rewrite-target` Ingress annotation can be exploited to inject arbitrary Nginx configuration
directives.

Successful exploitation may result in:

- Arbitrary code execution in the `ingress-nginx` controller context.
- Disclosure of Kubernetes Secrets accessible to the controller.
- Compromise of workloads exposed through the ingress controller.

This vulnerability only affects environments using the `ingress-nginx` controller.

### Affected Deployments

- All workload clusters using the Nginx pack.
- All Palette Enterprise and Palette VerteX deployment methods (multi-tenant SaaS, dedicated SaaS, and self-hosted).

### Impact

An attacker with the ability to create or modify an Ingress resource may be able to:

- Inject malicious configuration into Nginx.
- Execute arbitrary code within the ingress controller pod.
- Access or exfiltrate Kubernetes Secrets accessible to the controller (potentially cluster-wide).

The risk is higher in environments where:

- Users have Ingress write privileges.
- The ingress controller has broad RBAC permissions.
- Secrets are accessible across namespaces.

### Recommended Actions

#### Multi-tenant and Dedicated SaaS Deployments

Multi-tenant & managed Dedicated SaaS clusters have been patched as part of the standard update process to Palette
version 4.7.39.

#### Self-Hosted Palette Deployments

The Nginx ingress controller versions 1.13.8, 1.14.4, and 1.15.0 are now available.

#### Workload Clusters

Apply `ingress-nginx` updates as soon as patched images are available. If using vendor-managed ingress add-ons, follow
your cloud provider's patch guidance.

### Mitigation

- Apply a temporary policy to block `nginx.ingress.kubernetes.io/rewrite-target` via admission control until patched for
  workload clusters using the vulnerable version.
- Restrict Ingress creation permissions to trusted administrators.
- Reduce ingress controller RBAC permissions where feasible.

### Resources

- [CVE-2026-3288](https://github.com/kubernetes/kubernetes/issues/137560)
- [Ingress-Nginx Controller Upgrade](https://kubernetes.github.io/ingress-nginx/deploy/upgrade/)

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

Palette version 4.7.37 includes fixes for this vulnerability in both core images and third-party images, where
available. Refer to the [Release Notes](../../release-notes/release-notes.md) page for further details.

### Mitigations

Until a fix is available, customers may mitigate risk by monitoring and auditing controls to detect any unauthorized or
unexpected changes to root Certificate Authority (CA) or client CA bundles, including updates to Kubernetes Secrets and
ConfigMaps.

### Resources

- [CVE-2025-68121](https://nvd.nist.gov/vuln/detail/CVE-2025-68121)

## Security Advisory 008- Nginx ingress Vulnerabilities

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

Palette version 4.7.31 uses Nginx controller version 1.13.7. Refer to the
[release notes](../../release-notes/release-notes.md) for further information.

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

### References

For additional information, refer to the following GitHub Security Advisories:

- [CVE-2026-1580: ingress-nginx auth-method nginx configuration injection](https://github.com/kubernetes/kubernetes/issues/136677)
- [CVE-2026-24512: ingress-nginx rules.http.paths.path nginx configuration injection](https://github.com/kubernetes/kubernetes/issues/136678)
- [CVE-2026-24513: ingress-nginx auth-url protection bypass](https://github.com/kubernetes/kubernetes/issues/136679)
- [CVE-2026-24514: ingress-nginx Admission Controller denial of service](https://github.com/kubernetes/kubernetes/issues/136680)
- [CVE-2025-15566: ingress-nginx auth-proxy-set-headers nginx configuration injection](https://github.com/kubernetes/kubernetes/issues/136789)

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
[FIPS prerequisite](../../vertex/install-palette-vertex/install-on-kubernetes/install.md#prerequisites) as outlined in
our user documentation are not affected by this vulnerability.

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

- Refer to the [Palette Enterprise](../../enterprise-version/upgrade/upgrade.md) or
  [Palette VerteX](../../vertex/upgrade/upgrade.md) upgrade guides for guidance on upgrading the version for all
  connected and airgapped Palette Enterprise and Palette VerteX clusters.

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
  refer to the [Palette Enterprise](../../enterprise-version/upgrade/upgrade.md) or
  [VerteX](../../vertex/upgrade/upgrade.md) upgrade guide.

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
