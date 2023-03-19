---
title: "Enable Spectro VM Dashboard"
metaTitle: "Enable Spectro VM Dashboard"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Enable the VM Dashboard on your MAAS cluster by applying the profile with the Spectro VM Dashboard add-on pack to it. 


# Prerequisites

- A cluster profile with the Spectro VM Dashboard add-on configured.


- Users or groups must be mapped to a Kubernetes RBAC role, either a Role or a ClusterRole. You can create a custom role through a manifest and use Palette's roleBinding feature to associate the users or groups with the role. Refer to the [Create a Role Binding](/clusters/cluster-management/cluster-rbac#createrolebindings) guide to learn more.

# Enablement

1. From the left **Main Menu**, click **Clusters** and select your MAAS cluster. 


2. Go to the **Profiles** tab and click **+** next to **Addon Layers**, then select the profile you created.


3. Click **Confirm** to update the cluster.
	
The cluster status displays as **Upgrading** on the cluster overview page. Updating can take 10-20 minutes depending on your environment. You can track events from the **Events** tab.

When the cluster is finished upgrading, its status displays as **Running** and a new tab labeled **Virtual Machines** appears on the Clusters page. 
	
