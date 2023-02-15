---
title: "Register and Manage Edge Native Clusters"
metaTitle: "Edge Native"
metaDescription: "Learn about Edge Native and how to deploy an edge device with Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';



# Overview

Palette’s Edge Native solution provides a way for Spectro Cloud’s Palette Edge Distribution, a security-hardened, immutable operating system with embedded Kubernetes components, to be installed at edge sites on typically small form factor devices. Thousands of such sites can be provisioned and centrally managed from Palette’s management console, reducing the overhead and complexity required to upgrade and configure sites in bulk. [Cluster profiles](/cluster-profiles) with specifications of the desired infrastructure settings (OS type and version; K8s type and version; CNI), as well as desired applications such as Point of Sales, etc., are used as a blueprint for provisioning edge sites.

At the site, Palette provides a plug-n-play experience to the operator. First, appliances are bootstrapped with an initial installer image connecting to the management console to retrieve desired settings from the associated cluster profile. Then, the appropriate Palette Edge Distribution is downloaded, installed, and configured to provision the edge appliance and operationalize the site.

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


* Whitelist the sites and repositories mentioned in the [proxy whitelist](/clusters#proxywhitelists) document.


* For bare metal edge hosts, a bootable USB drive or [Palette eXtended Kubernetes Edge](/glossary-all#paletteextendedkubernetesedge(pxk-e)) preboot execution environment (PXE) setup to boot devices using the Palette Edge Distribution Installer image.

<InfoBox>

The community resource, Painting with Palette has a great Edge Native [tutorial](https://www.paintingwithpalette.com/tutorials/basic/edge_native/) available.

</InfoBox>

## Setup Device

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to left **Main Menu** and select **Profiles**.


3. Create a cluster profile of the type **infrastructure** or **full** with **Edge Native** as the cloud type by providing the following layers. To learn more about creating a cluster profile, refer to the [Create Cluster Profile](/cluster-profiles/task-define-profile) documentation.
   - Optionally, consider creating additional profiles with out-of-the-box packs for monitoring, security, authentication, or other capabilities as desired. If remote access to the cluster is desired, consider adding the [Spectro Proxy](/integrations/frp) pack to one of the add-on profiles.

   -  Optionally, add additional Helm or OCI registries and include applications hosted in those registries into add-on profiles. Check out the guide for adding a [Helm](/registries-and-packs/helm-charts) or [OCI](/registries-and-packs/oci-registry) registry to learn more.


4. Create a configuration file for the Edge device. The configuration file is composed of three sections; `site`, `reboot`, `stages`, and `install`. Review the following parameters to better understand each section.

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
|name|Unique Identifier for the device. This should be globally unique across in  the Palette Management System. If not provided, the id is generated using the serial number of the appliance.|No|
|registrationURL| End point to the restoration app that can be used for QR code based automated registration. |No|
|projectUid| The id of the project that will use this Edge device. |No|
|edgeHostToken| The tenant registration token. Registration tokens allow you to install an Edge device automatically without using the registration URL. |No|
|tags| Assign any tags you wish to apply to the node. |No|

#### Reboot

|Parameter| Description| Required|
|------------------|------------|----------|
|reboot   |Reboot the node after the install is complete. Default value is true. |No|

#### Stages
|Parameter| Description| Required|
|------------------|------------|----------|
|Stages:initramfs|Create OS users, add them to groups, or add additional files/folders using this setting. Example below| No|

#### Install

|Parameter| Description| Required|
|------------------|------------|----------|
|poweroff|Power off the node after the install is complete. Takes precedence over the reboot parameter. Default value is false.| No |




5. Create the installer image. Select the target environment appropriate for your device. Review the steps for creating an [install image](#create-install-image). You can choose between [bare metal](#staging-environment?environment=bare-metal#bare-metal) or [VMware](#staging-environment?environment=vmware#vmware). 



6. Install the image onto the device. Installation procedures vary depending on the environment. During installation, site-specific properties may need to be supplied to the edge hosts. The properties available for site customization are described in the table below.


|Site Setting Name|Description|Mandatory|
|-----------------|-----------|---------|
|network: type|network type may either be `dhcp` or `static`|Yes|
|network: httpProxy|proxy is specified it will be used for http and https traffic|No|
|network: nameserver|configures the default nameserver for the system|No|
|network: gateway|required if static network type is configured, this is the default gateway for all outbound traffic|Conditional - required  if network type is static|
|network: ipAddress|required if static network type is configured, this is the ip address the default interface will be configured|Conditional - required  if network type is static|
|network: mask|required if a static network type is configured, defines the prefix length for addressable network.|Conditional - required  if network type is static|


7. Register the device. Registration involves adding your edge hosts to Palette and defining a cluster with those edge hosts. Once the registration is complete in Palette, the edge host agent comes out of the wait cycle and proceeds to install the cluster. Registration can be performed using one of the following methods.


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
    edgeHostToken: a4P5DzeJfeo6Un0X81dUyxaq491y05GL
```

To create a registration token, use the following steps.

1. Log into [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Switch to the tenant scope.


3. Navigate to left **Main Menu** and select **Settings**.


4. Next, click on **Registration Tokens** in the tenant settings menu.


5. Select **Add New Registration Token**.


6. Fill out the input fields and **Confirm** your changes. 


7. Save the **Token** value.

Use the generated token value in the configuration YAML file you will provide to the installer image.

</Tabs.TabPane>

<Tabs.TabPane tab="Using QR Code" key="qr-code">

### Automate Using QR Code

You can provide a QR case-based automated registration to simplify the process. A QR code is displayed on the edge host UI upon boot up if enabled during the installation phase. Site operators can scan this QR code to visit the registration page. This web page pre-populates the edge host’s unique ID in the web app and provides a list of edge sites that they can associate with this edge host. Site operators can select a site and submit it. The web application automatically creates the edge host entry in Palette and defines a cluster with that edge host. This results in the Palette edge host agent coming out of the wait cycle and proceeding to install the cluster end to end. Using this flow, edge hosts can also be added to existing clusters to scale the cluster into a multi-node cluster.

Palette provides a sample serverless application (Palette Edge Registration App) built and deployed using the [Vercel](https://vercel.com/) platform. This application needs to be cloned and customized.

The following steps are required to facilitate this flow:

1.  Contact our sales team at [sales@spectrocloud.com](mailto:sales@spectrocloud.com) to access the GitHub repository that hosts the code for this application and set up automated deployments into the Vercel platform.


2. Clone the repository and change the company name, logo, and theme.


3. Update the sample sites provided with your site names and locations. Make the required changes in the **pages/index.js** file.


4. Map infrastructure and add-on cluster profiles to be used with each site.


5. Provide site-specific Virtual IP Addresses of DNS mapping to be used for the Kubernetes API server for each side.


6. Compile and test the code locally.


7. Create GitHub pull request towards your main branch to automatically trigger the Netlify build process and deploy the app.


8. The link to this app deployment needs to be entered as `registrationURL` during the staging phase.


Specific details about the files to be changed and instructions on how to build and test the application locally are provided in the readme file present in the GitHub repository.

</Tabs.TabPane>

<Tabs.TabPane tab="Palette UI" key="ui">

### Register through Palette Management Console UI

You need to note down the unique edge host id displayed on the device console when the edge host is booted up. Unless you customized the name parameter of the configuration YAML, the id is generated using the serial number of the edge host. To register the device through Palette, use the following instructions.

1. Log in to [Palette](https://console.spectrocloud.com).


2. Switch to the tenant scope.


3. Navigate to the left **Main Menu** and select **Clusters**.


4.  Click on the **Edge Hosts** tab and select **Add Edge Hosts****.


5. Enter the Edge Host id and press the enter key. 


6. You can provide one or more tags in the form of `tagName:value`. 


7. Confirm your changes.

<InfoBox>


The tag value `name` allows you to set a readable name for the edge host. If provided, this readable name is displayed across the Palette Management Console.


</InfoBox>


</Tabs.TabPane>

</Tabs>

<br />

### Create Cluster

8. Click on the **Clusters** tab and select **+ Add New Cluster**.


9. Select **Edge Native** as the environment and choose the cluster profile created during the modeling phase. Add additional add-ons to deploy applications inside the cluster. If you need remote access, we recommend adding an add-on layer with the [Spectro Proxy](/integrations/frp) pack. This establishes a route through the Palette Management Console to access the cluster remotely.


10. Configure cluster properties such as Virtual IP address (VIP) for the edge site, inject SSH keys, etc.


11. Configure node pools by adding your edge hosts to the master or worker pools. Successfully registered edge devices will be available in the drop-down menu.


12. Review and save the cluster configuration.


After creating the cluster, the Palette Edge Host agent will start the installation by constantly polling the management console for information. You can track the progress of the installation in the Palette Management Console. The cluster overview page shows a summary of the progress, while the events tab displays detailed orchestration logs.


## Validation 


You can validate your cluster is up and running by reviewing the cluster details page. Navigate to the left **Main Menu** and click on **Clusters**. The **Clusters** page contains a list of all available clusters managed by Palette. Click on the row for the cluster you wish to review its details page. Ensure the **Cluster Status** field contains the value **Running**.


# Delete an Edge Native Cluster

The deletion of an Edge Native cluster results in the removal of all instances and associated resources created for the cluster. To perform a cluster deletion, use the following steps. 


1. Ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click on **Clusters**


3. Click on the cluster that you want to remove.


4. Click on the **Settings** drop-down menu.


5. Click on **Delete Cluster**


6. Type in the name of the cluster and click on **OK**

The cluster status is updated to **Deleting** while cluster resources are being deleted. Once all resources are successfully deleted, the cluster status is updated to **Deleted** and is removed from the list of clusters. The delete operation returns the edge hosts to the **Ready** state. All the artifacts related to the Kubernetes distribution are removed. After the delete process, the edge hosts are available for deployment to a new cluster.



# Create Install Image

<Tabs identifier="environment">

<Tabs.TabPane tab="Bare Metal" key="bare-metal">

## Bare Metal

For bare metal edge hosts, creating the palette edge installer variant involves generating an installer image which is derived by customizing the default Palette Edge Installer. Site-specific settings described above are baked into this image. The customization is performed by using the Palette Edge Installer Container.

The following are steps to customize *site settings* and build an *installer image*:

<br />

1. Checkout the following [Git Repo](https://github.com/spectrocloud/pxke-samples) on your local machine or server where you intend to invoke the customization procedure.

   ```
     git clone https://github.com/spectrocloud/pxke-samples
   ```

2. A file called .installer.env.template serves as a template file for  settings that can be customized. Make a copy of this file to .installer.env.

   ```
     cp .installer.env.template .installer.env
   ```

3. Update contents of this file to customize:
   * Installer name

   * Base Palette installer version
   * Location of the Docker registry where the installation container image should be uploaded to (optional)
   * Location of the user data.yaml file where the customized installer settings are stored

      -  Name of the ISO image to be generated - (Optional - defaults to pxe-installer if not specified)

         ```shell
         ISO_IMAGE="pxe-installer-custom"
         ```

      -  The version of the Palette Edge installer agent - (Optional) Defaults to the latest release)

         ```shell
         INSTALLER_VERSION="latest"
         ```

      - Target Docker image for the installer to generate

         ```shell
         IMAGE_NAME="gcr.io/my-repo/palette-edge-installer"
         ```

      - Path to user the data file  (Optional - Defaults to "user-data" in the current directory. Change the value below and uncomment the line if the file is different).

         ```shell
         USER_DATA_FILE="my-user-data.yaml”
         ```


4. The default user-data file is named `user-data` in the home directory. Create the file or file named as specified in USER_DATA_FILE in the `.installer.env`

	**Example:**  “my-user-data.yaml” above. The user data settings are as described in the [site settings](/clusters/edge/native#staging) section above.


5. Build the custom ISO - A custom ISO should be built with the name specified in the settings and the user data file baked inside the ISO.

```shell
./build-installer.sh
```


6. Mount this Palette Edge Installer ISO using a [bootable USB drive](http://tbd), [PXE server](http://tbd), or any other means to the bare metal appliances' primary drive (USB or CDROM). The installer will be flashed to the edge host hard disk, and the host will be shut down. The bare-metal edge host appliance is ready to be shipped to the edge location.

</Tabs.TabPane>

<Tabs.TabPane tab="VMware Environment" key="vmware">

## VMware


We will create an OVA file from the base Palette Edge Installer ISO for VMware environments by injecting customized settings (user data) via a secondary drive. Following are the detailed steps to generate the Palette Edge Installer variant in  OVA format.

1. Prepare cloud-init ISO with org settings. The steps to do this can vary from platform to platform. The instructions below describe the procedure to build the cloud-init ISO on macOS.


2. Create a YAML file called ‘user-data’  with the contents from the template in the [Site Settings section](/clusters/edge/native#staging). Customize various properties as necessary.


3. Create an empty meta-data file:

```
 touch meta-data
```

4. Create a cloud init iso using the following command:

```
mkisofs -output ci.iso -volid cidata -joliet -rock user-data meta-data
```

You may need cdrtools to interact with other devices.

```
brew install cdrtools
```

This will generate an ISO file called ci.iso in the current directory.

<br />

1. Upload the ci.iso file generated in the previous step to a datastore in vSphere using the vCenter console.


2. Download the default Palette Edge Installer image (ISO) from the clusters/edge hosts page on the Palette Management Console.


3. Upload this ISO to a datastore in vSphere using the vCenter console.


4. Create a new VM using the vCenter console. Add 2 CD drives to this VM and select the Palette Edge installer for one of them and the ci.iso 4. file for the other.


5. Select other settings, such as Network, Datastore, Folder, etc., as appropriate for your environment, if.


6. Power on the VM.


7. Monitor the VM console for log messages. The installer and user data will be copied to the hard disk, and the VM will shut down.


8. Power off the VM


9. Edit VM settings and delete the two CD drives previously attached.


10. Export VM as an OVF template.


The OVA file is ready to ship to various edge locations for installation.

</Tabs.TabPane>

</Tabs>