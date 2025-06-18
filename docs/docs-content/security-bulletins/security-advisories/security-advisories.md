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
profiles, workload clusters, and instances of Palette, and upgrade the Kubernetes version to a fixed version. The
following Kubernetes versions, available in Palette or VerteX deployments for workload cluster provisioning, are
vulnerable.

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
Enterprise or VerteX clusters using an affected Kubernetes version, you must update the cluster to use one of the
patched versions (v1.27.15, v1.28.11, v1.29.6, and v1.30.2) or newer.

- Refer to the
  [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
  for instructions on how to update a cluster profile and apply the updates to workload clusters.

- Refer to the [Palette Enterprise](../../enterprise-version/upgrade/upgrade.md) or
  [VerteX](../../vertex/upgrade/upgrade.md) upgrade guides for guidance on upgrading your Palette version for all
  connected and airgapped Palette Enterprise and VerteX clusters.
