---
title: "Air-Gap"
metaTitle: "Air Gap Repo"
metaDescription: "AirGap Repo"
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from '@librarium/shared/src/components/InfoBox';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";



# AIR GAP

## Overview

Spectro Cloud tenant clusters can be deployed and run without a direct internet or external network connectivity.

## Pre-Requisites

* Host machine for the mirror servers.

	* 2 (v)CPU
	* 4 GB RAM
	* 100 GB Storage
* Ports

	* 80 
	* 443 
	* 5000 
	* 8000

	
<InfoBox>
For a large number of nodes, increase the sizing of CPU/RAM.
Storage sizing depends on your intended update frequency and data retention model.
</InfoBox>

## Setup an Airgap Repo

* Log in to the vSphere console and navigate to VMs and Templates.
* Navigate to the Datacenter and folder you would like to use for the installation.
* Right-click on the folder and invoke the VM creation wizard by selecting the option to Deploy OVF Template.
* Complete all the steps of the OVF deployment wizard. Provide values for various fields as follows.
  * URL: Location of the air-gap installer
  * Name: The name to identify the air-gap repo
  * Virtual Machine Name: vm name
  * Select a location for the VM: Select desired folder
  * Select the desired Datacenter, Storage, and Network for the air gap repo as you proceed through the next steps. 
  * Customize the template as follows:
  * SSH Public Keys: Create a new SSH key pair (or pick an existing one). Enter the public key in this field. Then, install the public key in the installer VM to provide SSH access, as the user ubuntu for troubleshooting.
  * Monitoring Console Password: A monitoring console is deployed in the air gap repo VM to provide detailed information about the installation progress and access various logs. The default monitoring console credentials are:		
    * User Name: admin
    * Password: admin

<InfoBox>
Provide a different password for the monitoring console if desired. Leave the field blank to accept the default password.
</InfoBox>

* A Unique Instance ID for this instance - Specifies the instance id. This is required and used to determine if the machine should take “first boot” actions.
* Host Name: Specifies the unique hostname for the appliance.
* URL to seed instance data from: This field is optional but indicates that the instance should 'seed' user-data and meta-data from the URL used. Leave this empty if you do not want to seed from a URL.
* Finish the OVF deployment wizard and wait for the template creation. This will take a few minutes.
* Power on the VM.

## Obtain the Air-Gap Repo Information

Power on the VM to obtain the VM/Repository IP address (repo-ip). 
* Open terminal
* SSH to the repository using the SSH public key (installed in the air gap repo) as an ubuntu user.
* Once logged into the repository for the first time, follow the wizard to update the login password and login again.
* As root user execute: airgap-setup.sh &lt;repo-ip&gt;

* Execution of the above script gives the following details:

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
|Optional certificate for air gap environment encoded in base 64|


<InfoBox>
Spectro Cloud Repository Details, Pack Registry Details, and Registry Certificate must be saved and used while deploying your platform installer.
</InfoBox>


* Download and execute the version-specific binary from S3

``` json 
export VERSION=1.14.3
curl --user spectro:sTMZiXqJumMU2J  https://scar.console.spectrocloud.com/airgap/packs/airgap-v${VERSION}.bin -o airgap-v${VERSION}.bin
chmod 755 ./airgap-v${VERSION}.bin
./airgap-v${VERSION}.bin
```

## Deploy Platform Installer

1. Deploy your platform installer using the Spectro Cloud Repository Details obtained from the air gap repo.
2. Refer to [Deploy Platform Installer](/enterprise-version/deploying-the-platform-installer/#deployplatforminstaller) for detailed steps of platform installer deployment. 

<WarningBox>
While deploying the platform installer for "Spectro Cloud Repository settings" use the Spectro Cloud Repository Details and Registry Certificate obtained from the Air-Gap Repo.
</WarningBox>

3. Finish the OVF deployment wizard and wait for the template creation. This may take few minutes.

4. Power on the VM once deployment is completed.

