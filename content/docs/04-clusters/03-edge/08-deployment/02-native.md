---
title: "Register and Manage Edge Native Clusters"
metaTitle: "Edge Native"
metaDescription: "Learn about Edge Native and how to deploy an edge device with Palette."
hideToC: false
fullWidth: false
hiddenFromNav: true
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';



# Overview

Palette’s Edge Native solution provides a way for Spectro Cloud’s Palette Edge Distribution, a security-hardened, immutable operating system with embedded Kubernetes components, to be installed at edge sites on typically small form factor devices. Thousands of such sites can be provisioned and centrally managed from Palette’s management console, reducing the overhead and complexity required to upgrade and configure sites in bulk. [Cluster profiles](/cluster-profiles) with specifications of the desired infrastructure settings (OS type and version; Kubernetes type and version; CNI), as well as desired applications such as Point of Sales, etc., are used as a blueprint for provisioning edge sites.

At the site, Palette provides a plug-n-play experience to the operator. First, edge hosts are bootstrapped with an initial installer image connecting to the management console to retrieve desired settings from the associated cluster profile. Then, the appropriate Palette Edge Distribution is downloaded, installed, and configured to provision the edge host and operationalize the site.

To get started with Palette Edge Native, use the following instructions.

<br />

<InfoBox>

Check out the [Deployment Lifecycle](/clusters/edge/edge-native-lifecycle) to better understand the deployment life cycle.

</InfoBox>



# Deploy Edge Cluster


## Prerequisites

* One or more bare metal or virtual devices on X86 architecture to serve as edge hosts for the site.


* Minimum hardware requirements for the edge devices:
   * Memory: 4 Gb
   * CPU: 2
   * Storage: 50Gb


* Outgoing internet connectivity either direct or via proxy.


* Whitelist the sites and repositories listed in the [proxy whitelist](/clusters#proxywhitelists) guide.



* To install the Palette Edge Distribution Installer image on bare metal edge hosts, use a bootable USB drive or [Palette eXtended Kubernetes Edge](/glossary-all#paletteextendedkubernetesedge(pxk-e)) preboot execution environment (PXE) that is set up to boot devices.


<InfoBox>

The community resource, Painting with Palette has a great Edge Native [tutorial](https://www.paintingwithpalette.com/tutorials/basic/edge_native/) available.

</InfoBox>

## Setup Device

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Profiles**.



3. Create a cluster profile of type **infrastructure** or **full** with **Edge Native** as the cloud type by providing the following layers. To learn more about creating a cluster profile, refer to the [Create Cluster Profile](/cluster-profiles/task-define-profile) document.

   - Optionally, consider creating additional profiles with out-of-the-box packs for monitoring, security, authentication, or other capabilities. If remote access to the cluster is desired, consider adding the [Spectro Proxy](/integrations/frp) pack to one of the add-on profiles.


   -  Optionally, add additional Helm or OCI registries and include applications hosted in those registries in add-on profiles. Check out the guide for adding a [Helm](/registries-and-packs/helm-charts) or [OCI](/registries-and-packs/oci-registry) registry to learn more.



4. Create a configuration file for the Edge device. The configuration file is composed of three sections; `site`, `reboot`, `stages`, and `install`. Review the following parameters to better understand each section. 

<InfoBox>

To learn more about cloud-init stages and how they can be used to customize the installation process, check out the [Cloud Init Stages](/clusters/edge/cloud-init) resource. You should also review the [Edge Install Configuration](/clusters/edge/stylus-reference) resource to review all user-data parameters.


</InfoBox>

<br />


  ```yaml
    stylus:
      site:
        paletteEndpoint: api.spectrocloud.com
        registrationURL: https://edge-registration.vercel.app 
        projectUid: yourProjectIdHere
        edgeHostToken: yourEdgeRegistrationTokenHere
        tags:
          myTag: myValue
          myOtherTag: myOtherValue
      reboot: false

    stages:
      initramfs:
        - users:
            palette:
              groups:
                - sudo
              passwd: palette
    install:
      poweroff: true
  ```


#### Site

|Parameter| Description| Required|
|------------------|------------|----------|
|paletteEndPoint   |Palette Management Server endpoint.|Yes|
|name|Unique Identifier for the device. This should be globally unique across in  the Palette Management System. If not provided, the id is generated using the serial number of the edge host.|No|
|registrationURL| Endpoint to the restoration app that can be used for QR code-based automated registration. |No|
|projectUid| The id of the project that will use this Edge device. |No|
|edgeHostToken| The tenant registration token. Registration tokens allow you to install an Edge device automatically without using the registration URL. |No|
|tags| Assign any tags you wish to apply to the node. |No|

#### Reboot

|Parameter| Description| Required|
|------------------|------------|----------|
|reboot   |Reboot the node after installation is complete. Default value is true. |No|


#### Stages
|Parameter| Description| Required|
|------------------|------------|----------|
|Stages:initramfs|Create OS users, add them to groups, or add additional files/folders using this setting. Example below| No|

#### Install

|Parameter| Description| Required|
|------------------|------------|----------|
|poweroff|Power off the node after installation is complete. This parameter takes precedence over the reboot parameter. Default value is false.| No |





5. Create the installer image. Select the target environment appropriate for your device. Review the steps for creating an [install image](/clusters/edge/installer-image). You can choose between [bare metal](/clusters/edge/installer-image) or [VMware](/clusters/edge/installer-image). 



6. Install the image onto the device. Installation procedures vary depending on the environment. During installation, you may need to supply site-specific properties to the edge hosts. The properties available for site customization are described in the following table.



|Site Setting Name|Description|Mandatory|
|-----------------|-----------|---------|
|network: type|Network type may be `dhcp` or `static`.|Yes|

|network: httpProxy|Proxy is specified and is used for http and https traffic.|No|

|network: nameserver|Configures the default Nameserver for the system.|No|

|network: gateway|Required if static network type is configured. This is the default gateway for all outbound traffic.|Conditional is required if the network type is static.|

|network: ipAddress|required if static network type is configured, this is the IP address the default interface will be configured|Conditional - required  if network type is static|
|network: mask|required if a static network type is configured, defines the prefix length for addressable network.|Conditional - required  if network type is static|


7. Register the device. Registration involves adding your edge hosts to Palette and defining a cluster that uses the edge devices to make up a node pool. Once the registration is complete in Palette, the edge host agent comes out of the wait cycle and proceeds to install the cluster. Registration can be performed using one of the following methods.


<Tabs identifier="registration">

<Tabs.TabPane tab="Registration Token" key="registration-token">

You can automate the registration process by using tenant registration tokens. This method requires providing the registration token and project id to the configuration YAML file.

<br />

```yaml
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    registrationURL: https://edge-registration-app.vercel.app/
    projectUid: 63ec28d16b39cf0000d4732e
    edgeHostToken: yourEdgeRegistrationTokenHere
```

To create a registration token, use the following steps.

1. Log into [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Switch to the tenant scope.


3. Navigate to the left **Main Menu** and select **Settings**.


4. Select **Registration Tokens** in the **Tenant Settings Menu**.



5. Click **Add New Registration Token**.



6. Fill out the input fields and **Confirm** your changes. 


7. Save the **Token** value.

Use the generated token value in the configuration YAML file you will provide to the installer image.

</Tabs.TabPane>

<Tabs.TabPane tab="Using QR Code" key="qr-code">

### Automate Using QR Code

You can provide a QR case-based automated registration to simplify the process. A QR code is displayed on the edge host UI upon boot up if enabled during the installation phase. Site operators can scan the QR code to visit the registration page. This web page pre-populates the edge host’s unique ID in the web app and provides a list of edge sites they can associate with this edge host. Site operators can select a site and submit it. The web application automatically creates the edge host entry in Palette and defines a cluster with that edge host. This causes the Palette edge host agent to come out of the wait cycle and proceed with cluster installation. Using this flow, edge hosts can also be added to existing clusters to scale the cluster into a multi-node cluster.


Palette provides a sample serverless application (Palette Edge Registration App) built and deployed using the [Vercel](https://vercel.com/) platform. This application needs to be cloned and customized.

The following steps are required to facilitate this flow:

1.  Contact our sales team at [sales@spectrocloud.com](mailto:sales@spectrocloud.com) to access the GitHub repository that hosts the code for this application and set up automated deployments into the Vercel platform.


2. Clone the repository and change the company name, logo, and theme.


3. Update the sample sites provided with your site names and locations. Make the required changes in the **pages/index.js** file.


4. Map infrastructure and add-on cluster profiles to be used with each site.


5. Provide site-specific Virtual IP (VIP) addresses of DNS mapping to be used for the Kubernetes API server for each side.



6. Compile and test the code locally.


7. Create GitHub pull request towards your main branch to automatically trigger the Netlify build process and deploy the app.


8. Enter the link to this app deployment as `registrationURL` during the staging phase.



Specific details about the files to be changed and instructions on how to build and test the application locally are provided in the readme file in the GitHub repository.


</Tabs.TabPane>

<Tabs.TabPane tab="Palette UI" key="ui">

### Register through Palette Management Console UI

Take note of the unique edge host id displayed on the device console when the edge host boots up. Unless you customized the name parameter of the configuration YAML, the host id is generated using the serial number of the edge host. You will need the host id to register the device in Palette, so you may want to copy it. 

The following steps guide you in registering the device.


1. Log in to [Palette](https://console.spectrocloud.com).


2. Switch to the tenant scope.


3. Navigate to the left **Main Menu** and select **Clusters**.


4.  In the **Edge Hosts** tab, click **Add Edge Hosts****.



5. Enter the Edge Host id that you copied when the edge host booted up. 



6. You can provide one or more tags in the form of `tagName:value`. 


7. Confirm your changes.

<InfoBox>


The tag value `name` allows you to set a readable name for the edge host. If provided, this readable name is displayed in the Palette console.



</InfoBox>


</Tabs.TabPane>

</Tabs>

<br />

### Create Cluster

8. Click the **Clusters** tab and select **+ Add New Cluster**.



9. Select **Edge Native** as the environment and choose the cluster profile created during the modeling phase. Add additional add-ons to deploy applications inside the cluster. If you need remote access, use an add-on layer with the [Spectro Proxy](/integrations/frp) pack. This establishes a route through the Palette console to access the cluster remotely.



10. Configure cluster properties such as Virtual IP address (VIP) for the edge site and inject SSH keys.



11. Configure node pools by adding your edge hosts to the master or worker pools. Successfully registered edge devices are displayed in the *drop-down Menu*.



12. Review and save the cluster configuration.


After creating the cluster, the Palette Edge Host agent will start the installation by constantly polling Palette for information. You can track installation progress in Palette. The cluster overview page shows a summary of the progress. The *Events* tab displays detailed orchestration logs.



## Validation 


You can validate your cluster is up and running by reviewing the cluster details page. Navigate to the left **Main Menu** and click **Clusters**. The **Clusters** page contains a list of all available clusters managed by Palette. Select the cluster to review its details page. Ensure the **Cluster Status** field displays **Running**.



# Delete an Edge Native Cluster

Deleting an Edge Native cluster removes all instances and associated resources created for the cluster. Use the following steps to delete a cluster. 



1. Ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click **Clusters**



3. Click on the cluster that you want to remove.


4. Click the **Settings drop-down Menu**.



5. Click **Delete Cluster**.



6. Type the name of the cluster and click **OK**


The cluster status is updated to **Deleting** while cluster resources are being deleted. When all resources are successfully deleted, the cluster status is updated to **Deleted** and the cluster is removed from the list. The delete operation returns the edge hosts to the **Ready** state. All the artifacts related to the Kubernetes distribution are removed. After the delete process, the edge hosts are available for deployment to a new cluster.

