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

# Scenario - PCG Installer Unable to Register With Palette

When the PCG installer instance is powered on, it goes through a bootstrap process and attempts to register itself with Palette. This process typically takes between five to ten minutes. If the installer fails to register with Palette within the timeframe, it could indicate a bootstrapping error.
<br />

## Debug Steps

<br />

1. SSH into the PCG installer virtual machine using the username `ubuntu` and the SSH key provided during OVA import.


2. Inspect the log file located at **/var/log/cloud-init-output.log**. 

  <br />

  ```bash
  cat /var/log/cloud-init-output.log
  ```

  This log file will contain error messages if there are failures with connecting to Palette, authenticating, or downloading installation artifacts. A common cause for these errors is incorrect values provided to the installer, such as the Palette endpoint or a mistyped pairing code.

<br />

3. Ensure that the Palette endpoint does not have a trailing slash. If any of the properties were incorrectly specified, power down and delete the installer Virtual Machine (VM) and relaunch a new VM with the correct values.


4. Another potential issue may be a lack of outbound connectivity from the PCG installer VM to Palette. The installer VM needs to have outbound connectivity directly or via a proxy. Adjust the proxy settings, if applicable, to fix the connectivity or power down and delete the installer VM and relaunch a new VM  in a network that supports outbound connections to Palette.


5. If the above steps do not resolve the problems, issue the following command in the installer VM to create a script that will generate a log bundle.  

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



6. Start the script to generate a log archive. By default, the script places the log archive in the **/tmp/** folder. The log archive file name starts with the prefix **spectro-logs-** followed by a timestamp value.

  <br />

  ```shell
  chmod +x pcg-debug.sh && ./pcg-debug.sh
  ```

7. Contact our support team by sending an email to [support@spectrocloud.com](mailto:support@spectrocloud.com) and attach the logs archive to the ticket so our support team can troubleshoot the issue and provide you with further guidance.

<br />

# Scenario - Gateway Cluster Provisioning Stalled or Failed

The installation of a gateway cluster may encounter errors or get stuck in the provisioning state due to such reasons as a lack of infrastructure resources, unavailable IP addresses, or the inability to perform a Network Time Protocol (NTP) sync.

While these are the most common errors, some other issues might be related to the underlying VMware environment. 
<br />

## Debug Steps

<br />

1. Review the cluster details page, which can be accessed by clicking anywhere on the gateway widget. The details page contains information about every orchestration step, including the current task. Any intermittent errors will be displayed on the cluster details page next to the relevant orchestration task. 


2. Click on the **Events** tab to review lower-level operations being performed for the various orchestration steps.


3. If you believe that the orchestration is stuck or failed due to incorrectly selected infrastructure resources or an intermittent problem with the infrastructure, you can reset the gateway by clicking on the **Reset** button on the gateway widget. The reset action transitions the state to **Pending** and allows you to reconfigure the gateway and start provisioning a new gateway cluster.



4. If the problem persists, contact our support team by sending an email to [support@spectrocloud.com](mailto:support@spectrocloud.com).
<br />


# Scenario - IP Address Not Assigned During PCG Creation

When deploying a PCG in VMware vCenter, the IP address fails to get assigned to the new node. This can be caused by networking errors such as DHCP issues or an incomplete cloud-init.
<br />

## Debug Steps
<br />

1. Verify the network connectivity between the new node and the DHCP server. Ensure that the DHCP server is operational and has available IP addresses in its pool.


2. Check the network configuration on the new node and ensure that it is set to obtain an IP address automatically via DHCP.


3. Review the cloud-init logs on the new node for any errors or warnings related to the IP address assignment process.
<br />

# Scenario -Missing Network Route to Kube API Server

While provisioning a cluster, you may encounter an event log message stating `no route to host`.  This indicates an issue when the PCG cluster nodes are attempting to connect to the Kube API Server. This issue can occur due to improper networking configuration, or errors in the cloud-init process in the newly created VM. Use the following steps to resolve the route error.
<br />

## Debug Steps
<br />

1. Review the networking configuration for the cluster and ensure that it is properly set up with the correct IP addresses, subnets, and gateways.


2. Check the cloud-init logs on the newly created VM for any errors or warnings that might indicate a problem with network configuration or initialization.


3. Examine the sys logs on the newly created VM for any errors or issues that might be causing network connectivity problems.
<br />

# Scenario - VM Not Showing in Palette Console After Running

<InfoBox>

This scenario is applicable to deploying PCG in VMware environment.

</InfoBox>

After a virtual machine (VM) reaches the running state, it fails to appear in the Palette console. This can occur due to network connectivity issues with the Spectro Console, incorrect pairing code, or an incorrect endpoint configuration for the Palette in the Installer OVA VApp properties.
<br />

## Debug Steps
<br />

1. Verify the network connectivity between the VM and the Spectro Console. Check for any network restrictions or firewall rules that may be blocking communication.


2. Double-check the accuracy of the pairing code used for the VM. Confirm that it matches the expected value.


3. Verify the correctness of the Palette endpoint specified in the Installer OVA VApp properties.
<br />

# Scenario - Cluster Cloning Provisioning Failure Due to Permission Denial

<InfoBox>

This scenario is applicable to deploying PCG in VMware environment.

</InfoBox>


The provisioning of cluster cloning fails due to permission denial. This can occur when the users involved in the cluster cloning operation have inadequate permissions.
<br />

## Debug Steps
<br />

1. Review the documentation and ensure that the users involved have been granted the proper permissions for cluster cloning. Check for any missing or incorrect permissions.


2. Verify the assigned permissions for the specific vCenter objects and actions required for cluster cloning.


3. Contact the vCenter administrator or the access management team to rectify any permission discrepancies or grant the necessary permissions as per the documentation.
<br />


# Scenario - PCG Provisioning Stuck after "Created Container Manager"

<InfoBox>

This scenario is applicable to deploying PCG in VMware environment.

</InfoBox>


During the provisioning of a PCG, the process gets stuck in events without any progress after the "Created container manager" step. This can occur when the Gateway Installer fails to connect to the Spectro Cloud image URL, or when proper permissions are not set for the **spectro-templates** folder.
<br />

## Debug Steps
<br />

1. Check the network connectivity from the Gateway Installer to the Spectro Cloud image URL bucket. Ensure that there are no network issues or firewall restrictions blocking the connection.


2. Verify that the proper permissions are set for the **spectro-templates** folder, allowing the Gateway Installer to access and download the required OVA.


3. Review the logs and error messages related to the provisioning process to identify any specific errors or issues. Consult the VMware vCenter documentation or contact support for assistance if needed.
<br />



# Scenario - Failed to Deploy Image

<InfoBox>

This scenario is applicable to deploying PCG in VMware environment.

</InfoBox>

In Palette events, the error `failed to deploy image: Failed to create govomiClient` occurs. This issue can be caused by the user providing vCenter details with "https://" or "http://", which should not be provided, or by connectivity issues to vCenter from within the VM.
<br />

## Debug Steps
<br />

1. Verify that the vCenter details provided during provisioning do not include "https://" or "http://". The connection to vCenter should be specified without these prefixes.


2. Check the connectivity to vCenter from within the VM. Ensure that there are no network issues or firewall restrictions blocking the connection.


3. Review the logs and error messages related to the failed image deployment in Palette to identify any specific errors or issues. Consult the VMware vCenter documentation or contact support for further assistance if needed.
