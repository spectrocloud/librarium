---
title: "Air Gapped "
metaTitle: "Air Gap Repo"
metaDescription: "Air Gap Repo"
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from '@librarium/shared/src/components/InfoBox';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# Overview

Spectro Cloud fully supports installation of its management platform on VMware environments that have no direct or indirect connectivity to the outside world. The following 4 kinds of artifacts are typically downloaded over the internet during a typical installation and subsequent tenant cluster deployments.

* Spectro Cloud platform manifests from publicly hosted artifact repository.
* Container images for core Spectro Cloud platform components as well as 3rd party dependencies from various container image repositories such as gcr.io, docker.io, quay.io etc
* Spectro Cloud packs from publicly hosted pack registry.
* VMWare Worker images (OVAs) for various K8s versions publicly hosted in Amazon S3.

In order to enable installation into an air-gapped environment, Spectro Cloud provides an air-gapped appliance which contains the first 3 of the 4 artifacts mentioned above. Due to the size of woker images (OVAs), these are not directly available in the air-gapped appliance. The desired worker images need to be downloaded from Amazon S3 and uploaded to vCenter prior to installation as a pre-requisite.

# Pre-Requisites

* Minimum specifications for the air-gapped appliance.
	* 2 (v)CPU
	* 4 GB RAM
	* 100 GB Storage

* Incoming access into the air-gapped appliance at following ports:
	* 80 
	* 443 
	* 5000 
	* 8000

	
<InfoBox>
Storage sizing depends on your intended update frequency and data retention model.
</InfoBox>

# Deploy Air-Gapped Appliance

* Download Spectro Cloud's air-gapped appliance (OVA) to your local machine or jump host. Please contact Spectro Cloud support for download location.
* Navigate to the Datacenter and folder you would like to use for the installation. Right-click on the folder and invoke the VM creation wizard by selecting the option to Deploy OVF Template. Choose the location of the downloaded appliance when asked to select the OVF template.
* Complete all the steps of the OVF deployment wizard. Provide values for various fields as follows.
  * Name: The name to identify the air-gapped appliance
  * Select a location for the VM: Select desired folder
  * Select the desired Datacenter, Storage, and Network for the air gap repo as you proceed through the next steps. 
  * Customize the template as follows:
    * SSH Public Keys: Create a new SSH key pair (or pick an existing one). Enter the public key in this field. This public key will be installed in the appliance and can be used to gain SSH access, as the user ubuntu for troubleshooting.
* Finish the OVF deployment wizard and wait for the template creation. This will take a few minutes.
* Power on the VM.

# Initialize Air-Gapped Appliance

Power on the air-gappped VM to obtain the IP address (repo-ip).

* SSH to the air-gapped VM using the SSH public key (installed in the air gap repo) as an ubuntu user.
* As root user execute: `airgap-setup.sh <repo-ip>`
* Execution of the above script provides the following details:

|Spectro Cloud Repository Details|
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
Please make a note of the Spectro Cloud Repository Details, Pack Registry Details, and Registry Certificate. These will be used while deploying you the platform.
</InfoBox>

* Download and execute a binary specific to the version of Spectro Cloud you need to install. Contact support team for version specific binary. Eg.:

`curl --user spectro:XXXX https://repo.console.spectrocloud.com/airgap/packs/airgap-v1.14.24.bin -o airgap-v1.14.24.bin`

`chmod 755 ./airgap-v1.14.24.bin`

`./airgap-v1.14.24.bin`

* Download the desried worker images (OVAs) from Spectro Cloud Public Image reporsitory and upload to your vCenter. These images should be copied in a folder called 'spectro-templates'. The images should be coped with a prefix 'r_'. For eg., in order to support provisioning of Kubernetes version 1.21.3, with Ubuntu 18.0.4 operating system, the image should be renamed to "r_u-1804-0-k-1213-0.ova". The platform itself uses the version 1.20.9 therefore the worker image for that is mandatory. It should be dowloaded to the 'spectro-templates' folder and renamed to  "r_u-1804-0-k-1209-0.ova".

# Deploy Platform Installer
Once the airgapped appliance is setup, deploy the platform using the steps described [here](/enterprise-version/deploying-the-platform-installer/#deployplatforminstaller). While deploying the platform installer for "Spectro Cloud Repository settings" use the Spectro Cloud Repository Details and for the "Artifact repo certificate" field use the
 Registry Certificate displayed during initialization.


# Upgrade
To upgrade Spectro Cloud version, the binaries for that version need to be installed in the air-gapped appliance. Contact Spectro Cloud support to get a link to the Spectro Cloud binary for the desired version. Download the binary to the appliance and execute it. For eg.:

`curl --user spectro:XXXX https://repo.console.spectrocloud.com/airgap/packs/airgap-v1.14.24.bin -o airgap-v1.14.24.bin`

`chmod 755 ./airgap-v1.14.24.bin`

`./airgap-v1.14.24.bin`

After this, the new version will be available in the system console for upgrade.


<InfoBox>
The Air-Gapped installation only supports the core layers such as OS, Kubernetes, Sotrage and Network. Add-on layers are currently not supported for air-gapped envronments.
</InfoBox>
