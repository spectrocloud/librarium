---
title: "Getting Started"
metaTitle: "Getting Started"
metaDescription: "Spectro Cloud Getting Started"
icon: "overview"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Getting Started

## Overview
This quick start guide will take you through setting up an out-of-the-box Tenant in the Spectro Cloud Palette console. 

## Prerequisites 
To use Spectro Cloud Palette, you must have the following prerequisites:
- Spectro Cloud Palette account:
  - [Try Palette](https://www.spectrocloud.com/free-trial/) and request and free account.  
  - Enter your email and name to start a Free Trial. You will receive a code via this email.
- Cloud Account - Google Cloud, AWS, Azure among a few others provide a 30-day free account.
- Kubernetes installed
## Set up Palette for your organization

With Palette, you will be able to do the following:

  1. 
  2. 
  3. 


## Login to Palette
1.  Navigate to `console.spectrocloud.com` and activate the account with the authentication code, provided to you via email.  
2.  Sign on to Palette and change your password. 
**Note**: This link has an expiration date.


# Creating the first cluster

Spectro Cloud requires the creation of a Cluster profile before a Workload cluster can be created. This is because the <Tooltip trigger={<u>cluster profiles</u>}><a href="/cluster-profiles">Cluster Profiles</a> are instantiated templates that are created with pre-configured layers or components needed for cluster deployments.

<!-- </Tooltip> contain the configurations required for your cluster. -->


The cluster profile helps you prepare a ready-made configuration of——the OS, the Kubernetes layer, the network layer, and the storage layers. These four are the mandatory layers without
which a Cluster profile cannot be created. There are a host of other layers and components available to add in the Cluster profile (load balancers, authentication, monitoring, and logging, etc.) which are detailed in the cluster profile section. Spectro Cloud provides several cluster profiles out-of-the-box.



