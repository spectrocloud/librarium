---
title: "Private Cloud Gateway"
metaTitle: "Private Cloud Gateway"
metaDescription: "Troubleshooting steps for deploying a Private Cloud Gateway."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Private Cloud Gateway

When you deploy a Kubernetes cluster in a private data center environment, you must already have a Private Cloud Gateway (PCG) cluster deployed in the data center environment. A PCG enables secure communication between Palette and the private data center environment. 

The following are the high-level steps of deploying a PCG in a private data center environment:
<br />

1. Initiate the installation in Palette. In this step, you get a pairing code and an installer image. 
2. Deploy the cloud gateway installer in the data center environment.
3. Configure the cloud gateway in Palette, and launch the cloud gateway cluster.

While deploying a PCG, you may encounter one of the following scenarios during the abovementioned stages. Some scenarios below apply to all data center environments, whereas others apply to specific data center environments, such as VMware. Each scenario covers a specific problem, including an overview, possible causes, and debugging steps.  
<br />

# Scenairo - Jet Crashback Loop

After you finish configuring the cloud gateway in Palette, Palette starts provisioning the cloud gateway cluster. During provisioning, one of the internal Palette components may undergo a *CrashLoopBackOff* state. 

The internal component, *Jet*, will transition to a healthy state once the PCG cluster is successfully registered with Palette. 
<br />

## Debug Steps

Wait 10-15 minutes for the PCG installation to finish so that the internal component receives the required authorization token from Palette. Once the internal component is authorized, the cloud gateway cluster will provision successfully. 
<br />

# Scenario - Gateway Installer VM Unable to Register with Palette

When deploying the gateway installer in VMware vSphere, you deploy the OVF template and then power on the gateway installer Virtual Machine (VM). After powering it on, the gateway installer goes through a bootstrap process and attempts to register with Palette. This process typically takes between five to ten minutes. 

If the installer fails to register with Palette within the stipulated timeframe, it could indicate a bootstrapping error. The error can occur due to network connectivity issues, incorrect pairing code, or an incorrect endpoint configuration for the Palette in the gateway installer template settings.
<br />

## Debug Steps

<br />

1. SSH into the gateway installer VM using the username `ubuntu` and the SSH key you provided during the OVA import.


2. Inspect the log file located at **/var/log/cloud-init-output.log**. 

  <br />

  ```bash
  cat /var/log/cloud-init-output.log
  ```

  The **cloud-init-output.log** file will contain error messages if there are failures with connecting to Palette, authenticating, or downloading installation artifacts. A common cause for these errors is incorrect values provided to the OVF template deployment wizard, such as the Palette endpoint or a mistyped pairing code. 
  
  The screenshot below highlights the OVF template properties you configure and must be careful about while deploying a gateway installer VM.

  ![A screenshot displaying the OVF template properties you  configure while deploying the gateway installer VM](/troubleshooting-pcg-template_properties.png)


3. Double-check the accuracy of the pairing code used for the gateway installer VM. A pairing code is a unique authentication code Palette generates for each gateway installer instance. Confirm that it matches the value you copied from Palette. 


4. Ensure the Palette endpoint is correct and has no trailing slash "`/`". If you use Palette SaaS, the default endpoint is `https://console.spectrocloud.com`. If you are using Palette deployed in a self-hosted environment, use the endpoint as applicable to you. If the Palette endpoint is incorrectly specified, relaunch a new gateway installer VM with the correct values.
  

5. Another potential issue may be a lack of outbound connectivity from the gateway installer VM to Palette. The installer VM needs to have outbound connectivity directly or via a proxy to download the installation artifacts from Spectro Cloud. Check for any network restrictions or firewall rules in the network settings that may block communication. Adjust the proxy settings, if applicable, to fix the connectivity. Alternatively, you can relaunch a new gateway installer VM in a network that supports outbound connections to Palette.


6. If the problem persists, issue the following command in the gateway installer VM to create a script to generate a log bundle. 
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


4. If you have chosen the DHCP allocation scheme, ensure the Dynamic DNS is enabled in the DHCP server. A Dynamic DNS is only required if you are using DHCP. It is not required for a static IP allocation scheme.


5. If there are no network-related issues, SSH into the gateway installer VM using the username `ubuntu` and the SSH key you provided during the OVA import. Alternatively, open the web console of the gateway installer VM. 


6. Inspect the log files in the **/var/log** directory. 

 
6. Examine the cloud-init logs for potential errors or warnings related to the IP address assignment.
<br />

# Scenario - Cloud Gateway Installer Deployment Failed

When deploying the gateway installer in VMware, you deploy the OVF template and power on the gateway installer VM. After powering it on, the gateway installer VM gets a public IP address, but the deployment does not succeed even after waiting more than ten minutes. A failed deployment of the cloud gateway installer will cause trouble configuring the cloud gateway in Palette.

The gateway installer deployment can fail due to internet connectivity or internal misconfigurations, such as a misconfigured pairing code. 
<br />

## Debug Steps

If the gateway installer VM has a public IP address, you can access the cloud gateway installer's deployment status and system logs from the monitoring console. Follow the steps below to review the deployment status and logs:
<br />

1. Open a web browser on your local machine and visit the `https://[IP-ADDRESS]:5080` URL. Replace the `[IP-ADDRESS]` placeholder with your gateway installer VM's public IP address. 


2. Provide the username and password when it prompts. 
You can use the default credentials, `{username: admin, password:admin}`, saved in the gateway installer OVF template. If you have not changed the credentials during the template configuration, use the values as applicable. 


3. Once logged in, review the cloud gateway installer's deployment status, system logs, and diagnostic tasks, as highlighted in the screenshot below. The monitoring console allows you to check the high-level status and download the individual log files to your local. 

  ![A screenshot of the monitoring console of the gateway installer.](/troubleshooting-pcg-monioring_console.png)


4. If any of the statuses is not **Done** after waiting for a while, download the concerned logs. The screenshot below displays the **Logs** tab in the monitoring console.

  ![A screenshot of the logs in the monitoring console of the gateway installer.](/troubleshooting-pcg-monioring_logs.png)


5. Examine the log files for potential errors and root causes. 


6. If the deployment failed due to a lack of outbound connectivity from the gateway installer VM to Palette, check for any network restrictions or firewall rules in the network settings that may block communication. Adjust the proxy settings, if applicable, to fix the connectivity. Alternatively, you can power down and delete the gateway installer VM and relaunch a new one in a network that supports outbound connections to Palette.


7. If the problem persists, email the log files to Spectro Cloud's support team at [support@spectrocloud.com](mailto:support@spectrocloud.com).
<br />

# Scenario - Cloud Gateway Cluster Provisioning Stalled or Failed

After you finish configuring the cloud gateway in Palette, the PCG cluster provisioning process should take up to 15 minutes to finish the PCG cluster deployment. 

However, if the PCG cluster provisioning gets stuck, it could hint incorrect cloud gateway configurations, unavailable IP addresses for the worker nodes, or the inability to perform a Network Time Protocol (NTP) sync. 
<br />

## Debug Steps
<br />

1. Navigate to the **Tenant Settings** in Palette and select the **Private Cloud Gateways** page. 


2. Click on the newly provisioned gateway cluster to review its details page. 


3. Switch to the **Events** tab. 


4. Examine all events in the **Events** tab to identify specific errors or issues. Each event will have a status, timestamp, associated service name, and orchestration details. 


5. The table below outlines the most common error events discovered in the **Events** tab and the corresponding reference section for remediation steps. 
<br />

  |**Event**|**Reference Section**|
  |---|---|
  |`Created container manager`| [Scenario - No Progress After Creating the Container Manager](#scenario---no-progress-after-creating-the-container-manager) |
  |`Failed to deploy image: Failed to create govomiClient`| [Scenario - Failed to Deploy Image](#scenario---failed-to-deploy-image) |
  |`No route to host`| [Scenario - No Route to the Kube API Server](#scenario---no-route-to-the-kube-api-server) |


6. Verify the following cloud gateway configurations in Palette.  

    - Check the VMware vCenter server field. The field expects a URL or an IP address. If you use a URL, do not place a preceding "http://" or "https://" string. Also, select the **Use Qualified Network Name** checkbox if you use a URL. The screenshot below displays the vCenter server field you configure in Palette. 
    ![A screenshot displaying the vCenter server field you configure in Palette](/troubleshooting-pcg-cluster_config_1.png)

    - Ensure the VMware cloud properties are specified correctly in the cloud gateway configuration. You must use the vSphere data center and the folder where you have permission to create resources. 

    - If you choose the DHCP option, enable the Dynamic DNS in your DNS server.

    - Ensure the search domain is correctly defined in the fault domain's DNS settings. The screenshot below displays the VMware cloud properties you configure in Palette. 
    ![A screenshot displaying the VMware cloud properties you configure in Palette](/troubleshooting-pcg-cluster_config_2.png)


7. Suppose the orchestration is stalled due to the incorrect cloud gateway configuration. In that case, you must delete the gateway and reconfigure it again.


8. If the problem persists, download the cluster logs from Palette. The screenshot below will help you locate the button to download logs from the cluster details page. 

  ![A screenshot highlighting how to download cluster logs in from Palette.](/troubleshooting-pcg-download_logs.png)


9. Share the logs with Spectro Cloud's support team at [support@spectrocloud.com](mailto:support@spectrocloud.com).
<br />


# Scenario - No Progress After Creating the Container Manager
Suppose the PCG events in Palette display no progress after the specific event, `Created container manager`. 

The issue can occur when the gateway installer VM fails to connect to the Spectro Cloud API, [https://api.spectrocloud.com](https://api.spectrocloud.com), to download the installation artifacts. Another potential reason is that the gateway installer may not have the required permissions to store the installation artifacts in the **spectro-templates** folder. The installer downloads the images for the worker nodes and stores them in the **spectro-templates** folder during the cluster provisioning.
<br />

## Debug Steps
<br />

1. Check the network connectivity from the gateway installer VM to the Spectro Cloud API. Ensure that no network issues or firewall restrictions are blocking the connection.


2. Ensure you have the necessary write permissions for the **spectro-templates** folder. 
<br />

# Scenario - Failed to Deploy Image

Suppose the PCG events in Palette display the `Failed to deploy image: Failed to create govomiClient` error. 

The error can occur if there is a preceding "https://" or "http://" string in the vCenter server URL or the gateway installer VM lacks internet connectivity.
<br />

## Debug Steps
<br />

1. Check the data center server URL in the gateway cluster configurations. Ensure the URL does not include the preceding "http://" or "https://" string. 


2. Check the internet connectivity from within the gateway installer VM. Ensure that no network issues or firewall restrictions are blocking the connection.


3. Suppose the gateway installer VM does not have outbound internet access. In that case, you can either provision the gateway installer VM in a network that supports outbound connectivity or fix the firewall rules of the existing network.
<br />


# Scenario - No Route to the Kube API Server

While deploying the cloud gateway cluster, the Palette events display the `No route to host` error. 

The error indicates an issue with the PCG cluster nodes attempting to connect to the Kube API server. This issue can occur due to improper networking configuration or an error in the cloud-init process. 
<br />

## Debug Steps
<br />

1. Ensure you provision the gateway cluster VM in a network supporting outbound connectivity. 


2. Check the internet connectivity from within the gateway installer VM. Ensure that no network issues or firewall restrictions are blocking the connection.


3. Suppose the gateway installer VM does not have outbound internet access. In that case, you can either provision the gateway installer VM in a network that supports outbound connectivity or fix the firewall rules of the existing network.


4. If the gateway cluster VM has a public IP address, SSH into the gateway installer VM using the username `ubuntu` and the SSH key you provided during the OVA import.


5. Inspect the log files in the **/var/log** directory. 

 
6. Examine the cloud-init and sys logs for potential errors or warnings.
<br />

# Scenario - Permission Denied to Provision

A user must have the necessary permissions to provision a PCG cluster in the VMware data center. 

Suppose you do not have adequate permissions. In that case, the PCG cluster provisioning will fail, and you will get the "*Permission to perform this operation denied*" error. 
<br />

## Debug Steps
<br />

1. Ensure you have all the permissions listed in the [VMware Privileges](https://docs.spectrocloud.com/clusters/data-center/vmware/#vmwareprivileges) section before proceeding to provision a PCG cluster. 


2. Contact your vCenter administrator if you need permission.

<br />