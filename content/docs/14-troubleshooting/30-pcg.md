---
title: "Private Cloud Gateway"
metaTitle: "Private Cloud Gateway"
metaDescription: "Troubleshooting steps for Private Cloud Gateway."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Private Cloud Gateway

You deploy a Private Cloud Gateway (PCG) using the following three-stage process:
<br />

1. Initiate the installation in Palette.
2. Deploy the gateway installer.
3. Configure the cloud gateway in Palette, and provision the cloud gateway cluster in the self-hosted environment. 

You may encounter one of the following scenarios during any of the abovementioned stages while deploying a PCG. Some of the scenarios below apply to all compute environments, whereas others apply to specific self-hosted environments, such as VMware. Each scenario covers a specific problem, including an overview and its possible causes. A detailed set of debugging steps follows the problem description to help identify and resolve the underlying problem.  
<br />

# Scenairo - Jet Crashback Loop

After configuring the cloud gateway in Palette, one of the internal Palette components will continue to undergo a *CrashLoopBackOff* until the PCG is configured correctly in the User Interface (UI). The internal component, *Jet*, will transition to a healthy state once the PCG cluster is successfully registered with Palette.
<br />

## Debug Steps

<br />

Complete the PCG installation so that the internal component receives the proper authorization token from Palette and completes the initialization successfully.

<br />

# Scenario - Gateway Installer VM Unable to Register With Palette

When deploying the gateway installer in VMware vSphere, you deploy the OVF template and then power on the gateway installer Virtual Machine (VM). After powering it on, the gateway installer goes through a bootstrap process and attempts to register itself with Palette. This process typically takes between five to ten minutes. 

If the installer fails to register with Palette within the stipulated timeframe, it could indicate a bootstrapping error. The error can occur due to network connectivity issues, incorrect pairing code, or an incorrect endpoint configuration for the Palette in the gateway installer template settings.
<br />

## Debug Steps

<br />

1. SSH into the gateway installer VM using the username `ubuntu` and the SSH key provided during OVA import.


2. Inspect the log file located at **/var/log/cloud-init-output.log**. 

  <br />

  ```bash
  cat /var/log/cloud-init-output.log
  ```

  This log file will contain error messages if there are failures with connecting to Palette, authenticating, or downloading installation artifacts. A common cause for these errors is incorrect values provided to the OVF template deployment wizard, such as the Palette endpoint or a mistyped pairing code. 
  
  The screenshot below highlights the OVF template properties you configure and must be careful about while deploying the gateway installer VM.

  ![A screenshot displaying the OVF template properties you can configure while deploying the gateway installer VM](/troubleshooting-pcg-template_properties.png)


3. Double-check the accuracy of the pairing code used for the gateway installer VM. A pairing code is a unique authentication code Palette generates for each gateway installer instance. Confirm that it matches the value you copied from Palette. 


4. Ensure the Palette endpoint is correct and has no trailing slash "`/`". If you use Palette SaaS, the default endpoint is `https://console.spectrocloud.com`. If you are using Palette deployed in a self-hosted environment, use the endpoint as applicable to you and follow the same syntax as the default endpoint. If the Palette endpoint is incorrectly specified, power off and delete the gateway installer VM and relaunch a new one with the correct values.
  

5. Another potential issue may be a lack of outbound connectivity from the gateway installer VM to Palette. The installer VM needs to have outbound connectivity directly or via a proxy to download the manifest files from Spectro Cloud. Check for any network restrictions or firewall rules in the network settings that may block communication. Adjust the proxy settings, if applicable, to fix the connectivity. Alternatively, you can power down and delete the gateway installer VM and relaunch a new one in a network that supports outbound connections to Palette.


6. If the above steps do not resolve the problems, issue the following command in the gateway installer VM to create a script to generate a log bundle. 
<br />

  ``` bash
  cat > pcg-debug.sh << 'EOF'
  #!/bin/bash
  DESTDIR="/tmp/"
  CONTAINER_LOGS_DIR="/var/log/containers/"
  CLOUD_INIT_OUTPUT_LOG="/var/log/cloud-init-output.log"
  CLOUD_INIT_LOG="/var/log/cloud-init.log"
  KERN_LOG="/var/log/kern.log"
  KUBELET_LOG="/tmp/kubelet.log"
  SYSLOGS="/var/log/syslog*"
  FILENAME=spectro-logs-$(date +%-Y%-m%-d)-$(date +%-HH%-MM%-SS).tgz
  journalctl -u kubelet > $KUBELET_LOG
  tar --create --gzip -h --file=$DESTDIR$FILENAME $CONTAINER_LOGS_DIR $CLOUD_INIT_LOG $CLOUD_INIT_OUTPUT_LOG $KERN_LOG $KUBELET_LOG $SYSLOGS
  retVal=$?
  if [ $retVal -eq 1 ]; then
      echo "Error creating spectro logs package"
  else
      echo "Successfully extracted spectro cloud logs: $DESTDIR$FILENAME"
  fi
  EOF
  ```



7. Start the script to generate a log archive. By default, the script places the log archive in the **/tmp/** folder. The log archive file name starts with the prefix **spectro-logs-** followed by a timestamp value.
<br />

  ```shell
  chmod +x pcg-debug.sh && ./pcg-debug.sh
  ```


8. Contact Spectro Cloud's support team by emailing [support@spectrocloud.com](mailto:support@spectrocloud.com) and attach the logs archive to the ticket so the support team can troubleshoot the issue and provide you with further guidance.

<br />

# Scenario - Gateway Installer VM Fails to Get an IP Address

When deploying the gateway installer in VMware vSphere, you deploy the OVF template and then power on the gateway installer VM. After powering it on, the gateway installer VM may fail to get an IP address.

If the gateway installer VM fails to get an IP address, it implies a networking error or an incomplete cloud-init. The selected IP allocation scheme specified in the network settings of the gateway installer OVF template assigns an IP address to the gateway installer VM. The IP allocation scheme offers two options - static IP or DHCP. You must check the selected IP allocation scheme for troubleshooting.
<br />

## Debug Steps
<br />

1. If you have chosen the static IP allocation scheme, ensure you have correctly provided the values for the gateway IP address, DNS addresses, and static IP subnet prefix. Check that the subnet prefix you provided allows the creation of an IP pool with sufficient IP addresses to allocate to the new gateway installer VM. 


2. If you have chosen the DHCP allocation scheme, check that the DHCP service is running on the DHCP server. Restart the service if it is not running already.


3. If the DHCP server is running, recheck the DHCP scope and the DHCP reservations. The DHCP scope defines the range of IP addresses that the DHCP server allocates on the selected network. You must have sufficient IP addresses from the DHCP scope for dynamic allocation. 


4. If you have chosen the DHCP allocation scheme, ensure that Dynamic DNS (DDNS) is enabled in the DHCP server. A DDNS is only required if you are using DHCP. It is not required for a static IP allocation scheme.


5. If there are no network-related issues, open the web console of the gateway installer VM to review the cloud-init logs. Examine the logs for errors or warnings related to the IP address assignment process.
<br />

# Scenario - Gateway Installer Deployment Failed

When deploying the gateway installer in VMware vSphere, you deploy the OVF template and power on the gateway installer VM. After powering it on, the gateway installer VM gets a public IP address, but the deployment does not succeed even after waiting for more than ten minutes. A failed deployment in vSphere will cause trouble configuring the cloud gateway in Palette.

The gateway installer deployment can fail due to the internet connectivity, or an internal misconfigurations, such as a misconfigured pairing code. 
<br />

## Debug Steps

If the gateway installer VM has a public IP address, you can access the PCG deployment status and system logs from the monitoring console. Follow the steps below to review the deployment status and logs:
<br />

1. Open a web browser on your local machine and visit the  'https://[IP-ADDRESS]:5080' URL. Replace the `[IP-ADDRESS]` placeholder with your gateway installer VM's public IP address. 


2. Provide the username and password when it prompts. 
You can use the default credentials, `{username: admin, password:admin}`,  saved in the gateway installer OVF template. If you haven't changed the credentials during the template configuration, use the values as applicable to you. 


3. Once logged in, review the deployment status,  system logs, and diagnostic tasks, as highlighted in the screenshot below. The monitoring console allows you to check the high-level status and download the individual log files to your local. 

  ![A screenshot of the monitoring console of the gateway installer.](/troubleshooting-pcg-monioring_console.png)


4. If any of the statuses is not **Done** after waiting for a while, download the concerned logs. The screenshot below displays the **Logs** tab in the monitoring console.

  ![A screenshot of the logs in the monitoring console of the gateway installer.](/troubleshooting-pcg-monioring_logs.png)


5. Examine the log files for potential errors and root causes. 


6. If the deployment failed due to a lack of outbound connectivity from the gateway installer VM to Palette, check for any network restrictions or firewall rules in the network settings that may block communication. Adjust the proxy settings, if applicable, to fix the connectivity. Alternatively, you can power down and delete the gateway installer VM and relaunch a new one in a network that supports outbound connections to Palette.


6. If the problem persists, email the log files to Spectro Cloud's support team at [support@spectrocloud.com](mailto:support@spectrocloud.com).
<br />

# Scenario - Gateway Cluster Provisioning Stalled or Failed

After you finish configuring the cloud gateway in Palette, the PCG cluster provisioning process should take up to 15 minutes to finish the PCG cluster deployment. 

However, if the PCG cluster provisioning gets stuck, it could hint a lack of infrastructure resources, unavailable IP addresses, or the inability to perform a Network Time Protocol (NTP) sync. While these are the most common errors, other issues might be related to the underlying VMware environment. 
<br />

## Debug Steps

<br />

1. Navigate to the **Tenant Settings** in Palette and select the **Private Cloud Gateways** page. 


2. Click on the newly provisioned gateway cluster to review its details page. 


3. Switch to the **Events** tab to review lower-level operations being performed for the various orchestration steps. 


4. Examine all events in the **Events** tab to identify any specific errors or issues. You will find the status, timestamp, service name, and details about every orchestration step. 


5. If the PCG events show no progress after the specific event, `Created container manager`, it implies one of the following events:
	- The gateway installer may have failed to connect to the Spectro Cloud URL, [https://api.spectrocloud.com](https://api.spectrocloud.com), to download the images. 
	- The gateway installer may not have permission to write images to the **spectro-templates** folder. 


7. Check the network connectivity from the gateway installer VM to the Spectro Cloud URL. Ensure that no network issues or firewall restrictions are blocking the connection.


8. Ensure that you have the necessary write permissions for the **spectro-templates** folder. The installer downloads the images for the worker nodes and stores them in the **spectro-templates** folder during the cluster provisioning.


9. Verify the cloud gateway configurations in Palette.  
	- Check the VMware vCenter server field. The field expects a URL or an IP address. If you are using a URL, do not place the preceeding "http://" or "https://". Also, ensure to select the **Use Qualified Network Name** checkbox, if you are using a URL. 

	- Ensure that the VMware cloud proerties are specified correctly in the cloud gateway configuration.  You must use the vSphere datacenter and the folder where you have permission to create resources.

	- If you chosen the DHCP option, ensure that the Dynamic DNS is enabled in your DNS server.

	- Ensure that the search domain is defined correctly in the fault domain's DNS settings. 


10. Suppose you believe the orchestration is stuck due to the incorrect cloud gateway configuration in Palette. In that case, you must delete the gateway and reconfigure it again.


11. If the problem persists, download the cluster logs from Palette. The screenshot below will help you locate the button to download logs from the cluster details page. 
    ![A screenshot highlighting how to download cluster logs in from Palette.](/troubleshooting-pcg-download_logs.png)


12. Share the logs with Spectro Cloud's support team at [support@spectrocloud.com](mailto:support@spectrocloud.com).
<br />

# Scenario - Permission Denied to Provision

To provision a PCG cluster in VMware, a user must have the necessary permissions to provision a cluster in the Datacenter. 

Suppose you do not have adequate permissions. In that case, the PCG cluster provisioning will fail, and you will get the "*Permission to perform this operation denied*" error. 

<br />

## Debug Steps

1. Ensure you have all the permissions listed in the [VMware Privileges](https://docs.spectrocloud.com/clusters/data-center/vmware/#vmwareprivileges) section before proceeding with provisioning a PCG cluster. 


2. Contact your vCenter administrator or the access management team if you need permissions.
<br />


# Scenario - Failed to Deploy Image

While deploying the cloud gateway cluster, the Palette events log the `Failed to deploy image: Failed to create govomiClient` error. 

The error can be caused due to a preceeding "https://" or "http://" in the vCenter server URL, or the gateway installer VM may not have the internet connectivity.
<br />

## Debug Steps
<br />

1. Check the vCenter server URL in the gateway cluster configurations. Ensure that the URL does not include the preceeding "http://" or "https://". 


2. Check the internet connectivity from within the gateway installer VM. Ensure that there are no network issues or firewall restrictions blocking the connection.
<br />


# Scenario - No Route to the Kube API Server

While deploying the cloud gateway cluster, the Palette events log the `No route to host` error. 

The error indicates an issue with the PCG cluster nodes attempting to connect to the Kube API server. This issue can occur due to improper networking configuration, or an error in the cloud-init process. 
<br />

## Debug Steps
<br />


1. Ensure that the gateway cluster VM is provisioned in a network with a outbound connectivity. 


2. Check the cloud-init logs on the newly created VM for any potential errors or warnings.


3. Examine the sys logs on the newly created VM for any errors or issues that might be causing network connectivity problems.
<br />

