---
sidebar_label: "Security Advisory"
title: "Security Advisory"
description: "Palette Security Advisories for Common Vulnerabilities and Exposures (CVEs)."
icon: ""
toc_max_heading_level: 4
hide_table_of_contents: false
tags: ["security", "cve", "advisories"]
---

Security advisories supplement <VersionedLink text="security bulletins" url="/security-bulletins/reports/" />, providing
additional details regarding vulnerabilities and offering remediation steps.

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
