---
title: "Kubectl"
metaTitle: "Web kubectl CLI on Palette"
metaDescription: "Web kubectl CLI on Palette for cluster access"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Overview

Palette leverages Kubectl through an in-built command line interface for the users to communicate with their workload clusters. This enables our users to deploy applications, inspect and manage cluster resources, and view logs using the Palette terminal without an external terminal. 

# Usage Scenarios

* Cluster Access
* Cluster access with OIDC Authentication enabled
* Cluster access with Spectro Proxy  
* CLI-Based Cluster Access

## Cluster Access

For general scenario, a user can connect to the cluster directly as below:

<br/>

1. Launch a cluster from the `Project Admin` Console.


2. Go the the `Cluster Details` page 


3. Click the `Connect` button available at the `Kubernetes Config File.` 


4. Wait for the terminal to be launched and start communicating to the cluster using the `kubectl` commands.


## Cluster Access with OIDC Authentication Enabled

The cluster access with OIDC authentication enables the clients to verify the end user's identity before establishing cluster connectivity. The user needs to establish an OIDC-based authentication to the cluster through an Identity provider of their choice. To establish cluster access with OIDC authentication, follow the steps below:

<br/>

**Note:** For OIDC based cluster access a callback/redirect url configuration need to be provided to the Identity Provider.
  
  Example `https://console.spectrocloud.com/v1/shelly/`

1. Launch a cluster from the ‘Project Administrator’ Console and enable cluster OIDC.

	**Note:** To enable OIDC, the user can use the Spectro RBAC Add-on or the Kubernetes YAML file.


2. Go the the `Cluster Details` page. 


3. Click the `Connect` button at the `Kubernetes Config File.`


4. Wait for the terminal to be launched.


 
5. Once the terminal is launched, give a kubectl command to obtain the console endpoint.


6. Copy the endpoint on the terminal, open a browser window, and provide your OIDC credentials.


7. After successful login to the page, get back to the terminal and start communicating to the cluster using the `kubectl` commands.

## Cluster Access with Spectro Proxy  
  
Palette users can attach [Spectro Proxy](/integrations/frp/) pack to the cluster profile while profile creation. This installs the FRP client to the workload clusters and configures it with an FRP server to establish external connectivity for private clusters. To establish cluster access with Spectro Proxy (Forward Reverse Proxy), follow the steps below:

<br/>

1. Launch a cluster from the ‘Project Admin’ Console.
**Note:** The cluster profile must have an attached Spectro Proxy add-on pack.


2. Go the the `Cluster Details` page. 


3. Click the ‘Connect’ button at the ‘Kubernetes Config File.’ 


4. Wait for the terminal to be launched.


5. Once the terminal launch, give the following command:

```
kubectl config set-cluster <CLUSTER_NAME> --insecure-skip-tls-verify=true
```


6. This establishes the connectivity between the workload cluster and external API. Now the user can start communicating to the cluster using the ‘kubectl’ commands.

<InfoBox>

While creating EKS clusters with a **Private** endpoint, adding a proxy pack is mandatory for establishing Palette Web kubectl connectivity.

</InfoBox>


## CLI-Based Cluster Access

The users can establish connectivity for public clusters via the public cloud CLI. To establish the CLI-based cluster access, follow the steps below:

<br />

1. Launch a cluster from the `Project Administrator` Console.


2. Go the the `Cluster Details` page.


3. Click the `Connect` button available at the `Kubernetes Config File.` 


4. Wait for the terminal to be launched. Once the terminal is launched, configure the `Public Cloud CLI`.

 **Example:**
For AWS clusters, the CLI can be configured using the below command and authenticate using the AWS console credentials like Access key and Secret key.

<br />

  ```
  		aws configure
  ```


5. Once the configuration is done, start communicating to the cluster using the ‘kubectl’ commands.




