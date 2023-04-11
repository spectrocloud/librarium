---
title: "Air Gap Mode "
metaTitle: "Air Gap Mode"
metaDescription: "Learn how to install Palette into an air gap environment."
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview


You can install a self-hosted version of Palette into a VMware environment without direct internet access. This type of installation is referred to as an airgap installation.   

During a standard Palette installation, the following artifacts are, by default, downloaded.

* Platform manifests from a publicly hosted artifact repository.


* Container images for core platform components and 3rd party dependencies from various public repositories.


* Packs from the public pack registry.


* VMWare Worker images for various Kubernetes versions.

To address the internet connectivity limitation, we provide an OVA image containing three required installation artifacts mentioned earlier. 

Due to the large size of VMWare worker images,  they are not included in the installer OVA image. Any VMware worker image you may need will require you to download the image from an Amazon S3 bucket and upload the worker images to vCenter before the installation. 




# Prerequisites

* The following minimum resources are required for deploying Palette.
    * 2 vCPU
    * 4 GB of Memory
    * 100 GB of Storage. Storage sizing depends on your intended update frequency and data retention model. <br /> <br />

* Ensure the following ports allow inbound network traffic. 
    * 80
    * 443
    * 5000
    * 8000


* Request the Palette Self-hosted installer image. To request the installer image, please contact our support team by sending an email to support@spectrocloud.com. Kindly provide the following information in your email:

    - Your full name
    - Organization name (if applicable)
    - Email address
    - Phone number (optional)
    - A brief description of your intended use for the Palette Self-host installer image.

Our dedicated support team will promptly get in touch with you to provide the necessary assistance and share the installer image. 

If you have any questions or concerns, please feel free to contact support@spectrocloud.com.

<br />


# Deploy Air-Gapped Appliance


1. Log in to vCenter Server by using the vSphere Client.


2. Navigate to the Datacenter and select the cluster you want to use for the installation. Right-click on the cluster and select **Deploy OVF Template**.


3. Select the OVA installer image you downloaded after receiving guidance from our support team.


4. Select the folder of where you want to install the virtual machine and assign a name to the virtual machine.


5. Next, select the compute resource.


6. Review the details page. You may get a certificate is not trusted warning, you can ignore this message and select **Next**.


7. Select your storage device and storage policy. Click on **Next** to proceed.


8. Fill out input fields the wizard presents.
    * **Name**: The name to identify the air-gapped appliance
    * *Select* a location for the VM: Select desired folder
    * Select the desired Datacenter, Storage, and Network for the air gap repo as you proceed through the following steps.
    * Customize the template as follows:
    * SSH Public Keys: Create a new SSH key pair (or pick an existing one). Enter the public key in this field. This public key will be installed in the appliance and can be used to gain SSH access, as the user ubuntu for troubleshooting.
    * Finish the OVF deployment wizard and wait for the template creation. This will take a few minutes.
    * Power on the VM.
# Initialize Air-Gapped Appliance

Power on the air-gapped VM to obtain the IP address (repo-IP).

* SSH to the air-gapped VM using the SSH public key (installed in the air gap repo) as an ubuntu user.
* As root user execute: `airgap-setup.sh <repo-ip>`
* Execution of the above script provides the following details:

|Spectro Cloud Palette Repository Details|
|---|
|URL to the repository|
|Username for repository login|
|Password for repository login|

|Pack Registry Details|
|---|
|URL to the pack registry access|
|Username for the pack registry login|
|Password for the pack registry login|

|Registry Certificate|
|--|
|Certificate for air gap environment encoded in base 64|

<InfoBox>
Please make a note of the Palette Repository Details, Pack Registry Details, and Registry Certificate. These will be used while deploying the platform.
</InfoBox>

* Download and execute a binary specific to the version of Palette you need to install. Contact the support team for version-specific binary. E.g.:

`curl --user <user>:<password> https://repo.console.spectrocloud.com/airgap/packs/airgap-v1.14.24.bin -o airgap-v1.14.24.bin`

`chmod 755 ./airgap-v1.14.24.bin`

`./airgap-v1.14.24.bin`

* Download the desired worker images (OVAs) from the Palette Public Image repository and upload them to your vCenter. These images should be copied in a folder called 'spectro-templates'. The images should be copied with the prefix 'r_.' For, e.g., to support provisioning of Kubernetes version 1.21.3, with Ubuntu 18.0.4 operating system, the image should be renamed to "r_u-1804-0-k-1213-0.ova". The platform itself uses version 1.20.9; therefore, the worker image for that is mandatory. It should be downloaded to the 'spectro-templates' folder and renamed to "r_u-1804-0-k-1209-0.ova".

# Deploy Platform Installer
Once the air-gapped appliance is set up, deploy the platform using the steps described [here](/enterprise-version/deploying-the-platform-installer/#deployplatforminstaller). While deploying the platform installer for "Spectro Cloud Repository settings", use the Spectro Cloud Palette Repository Details and for the "Artifact repo certificate" field, use the
 Registry Certificate displayed during initialization.


# Upgrade
To upgrade the Palette version, the binaries for that version need to be installed in the air-gapped appliance. Contact Palette sales team to get a link to the Palette binary for the desired version. Download the binary to the appliance and execute it. For, e.g.:

`curl --user <user>:<password> https://repo.console.spectrocloud.com/airgap/packs/airgap-v1.14.24.bin -o airgap-v1.14.24.bin`

`chmod 755 ./airgap-v1.14.24.bin`

`./airgap-v1.14.24.bin`

After this, the new version will be available in the system console for an upgrade.
