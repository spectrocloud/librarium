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

The following are scenarios you may encounter when deploying and using a Private Cloud Gateway.

<br />


# Scenairo - Jet Crashback Loop

During the installation of a PCG cluster, one of the internal Palette components will continue to undergo a CrashLoopBackOff until the PCG is configured correctly in the User Interface (UI). The internal component, *Jet*, will transition to a healthy state once the PCG cluster is successfully registered with Palette.

## Debug Steps

<br />

Complete the PCG installation so that the internal component receives the proper authorization token from Palette and completes the initialization successfully.

<br />

# Scenario - PCG Installer Unable to Register With Palette

When the PCG installer instance is powered on, the PCG installer goes through a bootstrap process and attempts to register itself with Palette. This process typically takes between five to ten minutes. If the installer fails to register with the Palette within the timeframe, it could indicate a bootstrapping error.

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


5. If the above steps do not resolve your issues, issue the following command in the installer VM to create a script that will generate a log bundle.  

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



6. Start the script to generate a log archive. By default, the script will place the log archive in the **/tmp/** folder. The log archive file name starts with the prefix **spectro-logs-** followed by a timestamp value.

  <br />

  ```shell
  chmod +x pcg-debug.sh && ./pcg-debug.sh
  ```

7. Contact our support team by sending an email to [support@spectrocloud.com](mailto:support@spectrocloud.com) and attach the logs archive to the ticket so our support team can troubleshoot the issue and provide you with further guidance.

<br />

# Scenario - Gateway Cluster Provisioning Stalled or Failed

The installation of a gateway cluster may encounter errors or get stuck in the provisioning state due to several reasons, such as a lack of infrastructure resources, unavailable IP addresses, or the inability to perform a Network Time Protocol (NTP) sync.

While these are the most common errors, some other issues might be related to the underlying VMware environment. 

## Debug Steps

<br />

1. Review the cluster details page, which can be accessed by clicking anywhere on the gateway widget. The details page contains information of every orchestration step including an indication of the current task being performed. Any intermittent errors will be displayed on the cluster details page next to the relevant orchestration task. 


2. Click on the **Events** tab to review lower-level operations being performed for the various orchestration steps.


3. If you believe that the orchestration is stuck or failed due to incorrectly selected infrastructure resources or an intermittent problem with the infrastructure, you can reset the gateway by clicking on the **Reset** button on the gateway widget. The reset action transitions the state to **Pending** and allows you to reconfigure the gateway and start provisioning a new gateway cluster.



4. If the problem persists, contact our support team by sending an email to [support@spectrocloud.com](mailto:support@spectrocloud.com).
<br />