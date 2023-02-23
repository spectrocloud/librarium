---
title: "MAAS"
metaTitle: "Configure MAAS and create MAAS clusters in Palette"
metaDescription: "Learn how to configure MAAS and create MAAS clusters in Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Palette supports integration with Canonical MAAS to give a cloud-like experience to deploying, running, and managing Kubernetes clusters directly on top of bare metal servers. 

# Prerequisite

- Canonical MAAS installed, set up, and available in your environment.

The following steps outline the overall process to install a Private Cloud Gateway (PCG), which is used to manage a MAAS bare metal cloud. The PCG facilitates communication between Palette and MAAS. This is necessary because the MAAS control plane is typically not exposed directly to the internet. 

For detailed steps to install the MAAS PCG, refer to [Install and Manage MAAS Gateway](/clusters/data-center/maas/install-manage-maas-pcg).

<br />

1. You obtain a pairing code in Palette that you will provide when you run the installer.

2. You run a configuration script using a docker image. The script creates a PCG configuration file that the installer will use.

3. You run the installer using the open-source Kind tool. 

4. The installer uses the configuration file to build a cluster that will host the PCG.

    The installer needs access to your Palette account and one machine from your MAAS cluster if you do not want High Availability (HA), or three machines from your MAAS cluster if you want HA.

    The machines in your MAAS must have internet access and be in a ready state.
    <br />

    <InfoBox>

    For production environments, we recommend setting up three nodes. If you initially set up the gateway with one node, you can resize it to three nodes at a later time. 

    </InfoBox>

5. The installer installs one machine (for non-HA) or three machines (for HA) from your MAAS cluster to build a new cluster that will host the PCG.



# Resources

- [MAAS Bare-Metal Architecture](/clusters/data-center/maas/architecture)
- [Install and Manage MAAS Gateway](/clusters/data-center/maas/install-manage-maas-pcg)
- [Register and Manage MAAS Cloud Accounts](/clusters/data-center/maas/register-manage-maas-cloud-accounts)
- [Create and Manage MAAS Cluster](/clusters/data-center/maas/create-manage-maas-cluster)


<br />
<br />
