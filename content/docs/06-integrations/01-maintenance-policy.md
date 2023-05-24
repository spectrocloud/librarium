---
title: "Maintenance Policy"
metaTitle: "Packs Maintenance Policy"
metaDescription: "Learn about Palette pack update and deprecation schedules."
icon: ""
hideToC: false
fullWidth: true
hideToCSidebar: false
---

import {Content} from "shared/layouts/Default";
import Tabs from "shared/components/ui/Tabs";
import Packs from "shared/components/common/Integrations/Packs"
import AppTiers from "shared/components/common/Integrations/AppTiers"
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';



# Overview

Palette supports two pack categories: *Core* and *Add-on*. Core packs, which we often source from third parties, are infrastructure related or have prominence in container-based environments. They create the layers in Palette profiles. Core packs are grouped as follows:

- Kubernetes

- Operating System (OS)

- Container Network Interface (CNI)

- Container Storage Interface (CSI)


Add-on packs provide additional functionality that you can add to your cluster profile and are grouped as follows:

- Load Balancer

- Ingress

- Logging

- Monitoring

- Security

- Authenticaiton

- System Apps


Check out the [Packs List](/integrations) document, where you can use the filter buttons to display a list of Palette packs in each category and learn about the individual packs.

<br />

## Pack Updates

Packs undergo rigorous vulnerability scans and penetration testing before they become available in Palette. The following sections describe our update schedule for each core pack category. 

<br />

### Kubernetes Packs

We provide Cloud Native Computing Foundation (CNCF) Kubernetes updates as follows:

<br />

- **Major versions**: Assessed based on the extent of changes.


- **Minor versions**: Provided within eight weeks of a new Kubernetes release.


- **Patch versions**: Provided within four weeks of a new Kubernetes release.



### OS Packs

We provide Ubuntu LTS and CentOS updates for IaaS clusters as follows:

<br />

- **Major versions** - Added within 8 weeks of release.


- **Patch and Minor versions**:  Updated at runtime using Palette’s on-demand or scheduled OS upgrades and patch-on-boot capabilities.


### CNI Packs

We provide CNI pack updates as follows:

<br />

- **Major versions**: Assessed based on the extent of changes.


- **Minor version**: Added within 6 weeks of release.


- **Patch versions**: Added within 4 weeks of release.


### CSI Packs

We provide CSI pack updates as follows:

<br />

- **Major versions**: Assessed based on the extent of changes.


- **Minor version**: Added within 6 weeks of release.


- **Patch versions**: Added within 4 weeks of release.


### Add-on Packs

We provide add-on pack updates as follows:

<br />

- **Major versions**: Assessed based on the extent of changes.


- **Minor version**: Added within 6 weeks of release.


- **Patch versions**: Added within 4 weeks of release.


## Packs Deprecation


We deprecate and remove packs when a more stable version of the pack is available or when the underlying technology becomes obsolete.
Below are the stages of deprecation we adhere to.

<br />

- **Deprecated**: When a pack is deprecated, Palette displays a warning. You will still be able to create new cluster profiles using the pack and launch clusters using existing profiles that contain the pack.

    <br />

    The pack remains in *Deprecated* state for three months before it moves to *Disabled* state.

    <br />

- **Disabled**: When a pack is disabled, you will no longer be allowed to create new cluster profiles using the pack. Palette displays a message informing you to use a newer version of the pack. However, you can still deploy new clusters using existing profiles that contain the pack.


    

- **Deleted**: When a pack is deleted, you will not be able to create new cluster profiles that use it or launch new clusters with existing profiles that contain the pack. Palette displays a message informing you to use a newer version of the pack. Existing clusters are not disturbed and will continue to be functional.

<InfoBox>

For important guidelines on updating pack versions, review [Update the Pack Version](/cluster-profiles/task-update-profile#updatethepackversion).

</InfoBox>

### Kubernetes Packs

A minor Kubernetes version is deprecated in Palette when the Kubernetes community announces the version is entering End of Life (EOL). 

<br />

### CNI / CSI / Add-on Packs

Palette supports a minor version of CNI, CSI, and add-on packs until two newer versions are available. At that time, packs in these categories are deprecated.


<br />

<br />

<br />

<br />

