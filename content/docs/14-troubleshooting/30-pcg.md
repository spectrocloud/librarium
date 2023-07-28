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


# Private Cloud Gateway (PCG)

When deploying and using a Private Cloud Gateway in your computing environment, you may encounter one of the following scenarios. Some of the scenarios below apply to all compute environments, whereas others apply to specific self-hosted environments, such as VMware. Each scenario covers a specific problem, including an overview of the issue and its possible causes, followed by a detailed set of debug steps to help identify and resolve the underlying problem.  

<br />


# Scenairo - Jet Crashback Loop

During the installation of a PCG cluster, one of the internal Palette components will continue to undergo a CrashLoopBackOff until the PCG is configured correctly in the User Interface (UI). The internal component, *Jet*, will transition to a healthy state once the PCG cluster is successfully registered with Palette.
<br />

## Debug Steps

<br />

Complete the PCG installation so that the internal component receives the proper authorization token from Palette and completes the initialization successfully.

<br />

# Scenario - Gateway Installer VM Unable to Register With Palette

When deploying the gateway installer in vSphere, you deploy the OVF template and then power on the gateway installer Virtual Machine (VM). After powering it on, the gateway installer goes through a bootstrap process and attempts to register itself with Palette. This process typically takes between five to ten minutes. 

If the installer fails to register with Palette within the timeframe, it could indicate a bootstrapping error. The error can occur due to network connectivity issues, incorrect pairing code, or an incorrect endpoint configuration for the Palette in the gateway installer template settings.
<br />

## Debug Steps

<br />

1. SSH into the gateway installer VM using the username `ubuntu` and the SSH key provided during OVA import.


2. Inspect the log file located at **/var/log/cloud-init-output.log**. 

  <br />

  ```bash
  cat /var/log/cloud-init-output.log
  ```

  This log file will contain error messages if there are failures with connecting to Palette, authenticating, or downloading installation artifacts. A common cause for these errors is incorrect values provided to the OVF template deployment wizard, such as the Palette endpoint or a mistyped pairing code. The screenshot below shows the OVF template properties you can configure while deploying the gateway installer VM.

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

When deploying the gateway installer in vSphere, you deploy the OVF template and then power on the gateway installer VM. After powering it on, the gateway installer VM may fail to get an IP address.

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

# Scenario - Gateway Cluster Provisioning Stalled or Failed

After you finish configuring the cloud gateway in Palette, the PCG cluster provisioning process should take up to 15 minutes to finish the PCG cluster deployment. 

However, if the PCG cluster provisioning gets stuck, it could hint a lack of infrastructure resources, unavailable IP addresses, or the inability to perform a Network Time Protocol (NTP) sync. While these are the most common errors, other issues might be related to the underlying VMware environment. 
<br />

## Debug Steps

<br />

1. Navigate to the **Private Cloud Gateways** page in the **Tenant Settings**. 


2. Click in the newly provisioned gateway widget to review the PCG cluster details page. 


4. Switch to the **Events** tab to review lower-level operations being performed for the various orchestration steps. 


5. Examine all events in the **Events** tab to identify any specific errors or issues. You will find the status, timestamp, service name, and details about every orchestration step. 


6. Suppose you believe the orchestration is stuck due to the incorrect cloud gateway configuration in Palette. In that case, you must delete the gateway and reconfigure it again.


7. If the problem persists, contact Spectro Cloud's support team by sending an email to [support@spectrocloud.com](mailto:support@spectrocloud.com).
<br />


# Scenario - Gateway Cluster Provisioning Stuck after "Created Container Manager"

After you finish configuring the cloud gateway in Palette, the PCG cluster provisioning process should take up to 15 minutes to finish the PCG cluster deployment. 

If the PCG cluster provisioning has stuck and shows no progress after the specific event, "*Created container manager*", it implies one of these possibilities:
<br />

- The gateway installer failed to connect to the Spectro Cloud URL from where the gateway installer will download the images.

- The gateway installer does not have permission to write images to the **spectro-templates** folder. During the cluster provisioning, the installer downloads the images for the master and worker nodes and saves them in the **spectro-templates** folder. 

<br />

## Debug Steps
<br />

1. Check the network connectivity from the gateway installer in the VMware to the  Spectro Cloud URL. Ensure that no network issues or firewall restrictions are blocking the connection.


2. Verify that the gateway installer has the necessary write permissions for the **spectro-templates** folder, allowing the gateway installer to save the required image files.
<br />


# Scenario - Gateway Installer Deployment Failed
When deploying the gateway installer in vSphere, you deploy the OVF template and power on the gateway installer VM. After powering it on, the gateway installer VM gets a public IP address, but the deployment does not succeed even after waiting for more than ten minutes. A failed deployment in vSphere will cause trouble configuring the cloud gateway in Palette.

The gateway installer deployment can fail due to internet connectivity, or internal misconfigurations, such as misconfigured pairing code. 
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


# Scenario - Permission Denied to Provision

<InfoBox>

This scenario applies to deploying a PCG in the VMware environment.

</InfoBox>

To provision a PCG cluster in VMware, a user must have the necessary permissions to provision a PCG cluster in the Datacenter cluster. 

Suppose you do not have adequate permissions. In that case, the PCG cluster provisioning will fail, and you will get the "*Permission to perform this operation denied*" error. 

<br />

## Debug Steps

1. Ensure you have all the permissions listed in the [VMware Privileges](https://docs.spectrocloud.com/clusters/data-center/vmware/#vmwareprivileges) section before proceeding with provisioning a PCG cluster. 


2. Contact your vCenter administrator or the access management team if you need permissions.
<br />



![A screenshot of a PCG cluster widget in Palette.](/troubleshooting-pcg-pcg_cluster.png)

![A screenshot of the "Created Container Manager" event.](/troubleshooting-pcg-create_container_manager.png)

![A screenshot of cluster configuration in Palette - Part 1.](/troubleshooting-pcg-cluster_config_1.png)

![A screenshot of cluster configuration in Palette - Part 2.](/troubleshooting-pcg-cluster_config_2.png)

![A screenshot of cluster DNS mapping in Palette](/troubleshooting-pcg-dns.png)

![A screenshot of highlighting an extra HTTP in the vCenter server URL.](/troubleshooting-pcg-http_error.png)

![A screenshot highlighting how to download cluster logs in from Palette.](/troubleshooting-pcg-download_logs.png)

# #######################################

# Scenario - Failed to Deploy Image

In Palette events, the error `failed to deploy image: Failed to create govomiClient` occurs. This issue can be caused by the user providing vCenter details with "https://" or "http://", which should not be provided, or by connectivity issues to vCenter from within the VM.
<br />

## Debug Steps
<br />

1. Verify that the vCenter details provided during provisioning do not include "https://" or "http://". The connection to vCenter should be specified without these prefixes.


2. Check the connectivity to vCenter from within the VM. Ensure that there are no network issues or firewall restrictions blocking the connection.


3. Review the logs and error messages related to the failed image deployment in Palette to identify any specific errors or issues. Consult the VMware vCenter documentation or contact support for further assistance if needed.

# #######################################

# Scenario - Missing Network Route to Kube API Server

While provisioning a cluster, you may encounter an event log message stating `no route to host`. This indicates an issue when the PCG cluster nodes are attempting to connect to the Kube API Server. This issue can occur due to improper networking configuration, or errors in the cloud-init process in the newly created VM. Use the following steps to resolve the route error.
<br />

## Debug Steps
<br />

1. Review the networking configuration for the cluster and ensure that it is properly set up with the correct IP addresses, subnets, and gateways.


2. Check the cloud-init logs on the newly created VM for any errors or warnings that might indicate a problem with network configuration or initialization.


3. Examine the sys logs on the newly created VM for any errors or issues that might be causing network connectivity problems.
<br />

