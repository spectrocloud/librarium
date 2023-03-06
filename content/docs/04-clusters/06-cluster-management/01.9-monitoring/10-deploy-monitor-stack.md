---
title: 'Deploy Monitoring Stack'
metaTitle: 'Deploy Monitoring Stack'
metaDescription: 'Learn how to setup deploy a monitoring stack in your Palette environment.'
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

The monitoring stack you will deploy uses the open-source tool, [Prometheus](https://prometheus.io/docs/introduction/overview/), to support your environment's monitoring requirements. The monitoring stack is a centralized server or aggregation spot to which all other clusters will forward metrics. The monitoring stack is a dedicated Kubernetes cluster for monitoring and metrics aggregation in your Palette environment. 

The monitoring stack uses a server-client architecture. The monitoring stack uses the [Prometheus Operator](/integrations/prometheus-operator) pack to deploy all the dependencies the Prometheus server requires. The server will expose an API endpoint for all other clients to forward metrics. The clients are Kubernetes clusters with the [Prometheus Agent](/integrations/prometheus-agent) pack installed and configured.

Use the following steps to deploy a monitoring stack, and learn how to configure a host cluster to forward metrics to the monitoring stack.

<br />

<WarningBox>

We recommend you avoid installing applications in your monitoring stack. The monitoring stack will require all the allocated resources to support Prometheus and incoming metrics from all other clusters.

</WarningBox>

# Deploy a Monitoring Stack

The steps below will deploy a new host cluster with the Prometheus Operator pack. You can add the Prometheus Operator pack to an existing cluster if you already have a host cluster deployed in your environment.

## Prerequisites

* None

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Profiles**.


3. Click on **Add Cluster Profile** to create a new cluster profile.


4. Provide the cluster profile a name and select the type **Full**. Click on **Next**.


5. Select the infrastructure provider and continue.


6. Go ahead and select the desired operating system, Kubernetes distribution, container network interface (CNI), and container storage interface (CSI). Click on **Next Layer** after each selection until you get to the end and you are presented with the **Confirm** button. Confirm your changes to continue.


7. In the following screen, select **Add New Pack**.


8. Use the following information to find the Prometheus Operator pack.
    - **Pack Type**: monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Prometheus Grafana
    - **Pack Version**: 44.3.X or newer.


9. Review the YAML configuration on the right. Navigate down the file until you find the parameter `adminPassword`. Input the password value for the admin user. The default admin user name is `admin`.


10. Next, click on the **Presets** button to expand the options drawer.


11. There are several options you can enable to expand the functionality of the monitoring stack. Review the [Prometheus Operator](/integrations/prometheus-operator) pack documentation to learn more about the available options. Scroll down the presets option menu and enable **Remote Monitoring**. Confirm your changes by selecting **Confirm & Create**.

# Configure a Host Cluster with Prometheus Agent