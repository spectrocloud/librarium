---
title: "Manage Clusters"
metaTitle: "Managing Cluster Update Events on Spectro Cloud"
metaDescription: "Events and Notifications on Cluster Updates"
icon: "envelope-open-text"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';





# Manage Clusters

Spectro Cloud brings forth a lot of cluster management activities for our tenant clusters to escalate the availability as well as to troubleshoot.This includes:

* [Scaling](/clusters/cluster-management/scaling) the resources of the running cluster



We provides several options to manage Kubernetes clusters on an ongoing basis. These include options to scale up/down the cluster by adding/reducing the number of nodes in a node pool, add additional worker pools, resize nodes in a node pool by modifying the instance type, and add additional fault domains such as availability zones to a node pool.

* [Cluster Updates](/clusters/cluster-management/cluster-updates)

In Spectro Cloud, majority of the updates are rolled out through Cluster Profiles. Updates such as addition of a new layer, changes to the pack version, removal of an existing layer, changes to the layer settings or attached manifests, etc. result in update notifications on all the clusters that were instantiated from that cluster profile.  Users can check, confirm and incorporate the updates to their running clusters at an appropriate time.

* Cluster activities for updates and troubleshooting.

	* [Compliance Scans](/clusters/cluster-management/compliance-scan)
	* [OS Patching](/clusters/cluster-management/os-patching)
	* [BackUp and Restore](/clusters/cluster-management/backup-restore)
 
These cluster activities provide various cluster management and governance operations that can be performed to keep clusters up-to-date, conformant and secure. These operations can be performed on a scheduled basis or on-demand as required. These includes OS patching, compliance scans and back up and restore. 

