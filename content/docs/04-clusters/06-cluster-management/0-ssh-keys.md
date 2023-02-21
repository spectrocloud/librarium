---
title: "SSH Keys"
metaTitle: "Create and Manage SSH Keys"
metaDescription: "Create and Manage SSH keys for a Spectro User Account
"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview
Palette supports SSH (Secure Shell) to establish, administer, and communicate with remote clusters. This section describes creating and managing SSH Keys in the Palette Management Console.

## Scope of SSH Key
Palette groups clusters for logical separation into [Projects](/projects). Users and teams can be assigned roles within a project for granular control over permissions within the project scope. SSH key authentication is scoped to a project. Multiple users can be given access to a single project. To gain access to a cluster with SSH, you need to have a public SSH key registered in Palette.

# Upload SSH Key

Before you begin, generate an SSH key pair. We recommend using the RSA (Rivest-Shamir-Adleman) public-key cryptographic system” to initiate a secure handshake between remote clusters for every cloud, data center, and edge environment supported by Palette.

The following steps guide you on how to upload your SSH key in Palette.
1. Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the left **Main Menu** and select **Project Settings**. Next, select the **SSH Keys** tab.
3. Open the **Add New SSH Key** tab to complete the **Add Key** form as below:
	* **Name**: Provide a unique name for the SSH key.
	* **SSH Key**: Paste in the SSH public key contents from the key pair generated earlier.
4. Click **Confirm** to complete the wizard.

<br />

<InfoBox>

SSH keys can be edited and deleted later by using the **three-dot Menu** to the right of each key.

</InfoBox>

# Use SSH Key


SSH keys loaded into the project can be used by associating them with clusters during cluster creation. Users can associate multiple SSH keys to a single project, however only one SSH key can be applied to a single cluster.

