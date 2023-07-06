---
title: "Palette Upgrade"
metaTitle: "Palette Upgrade"
metaDescription: "Troubleshooting steps for errors encountered with upgrade actions."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Troubleshooting
<br />

### Gateway Installer - Unable to register with the Tenant Portal

When powered on, the installer VM goes through a bootstrap process and registers itself with the Tenant Portal. This process typically takes 5 to 10 minutes. If the installer fails to register with the Tenant Portal within this timeframe, it could indicate a bootstrapping error.

SSH into the installer virtual machine using the username "ubuntu" and the key provided during OVA import and inspect the log file located at **/var/log/cloud-init-output.log**. This log file will contain error messages in the event there are failures with connecting to Palette, authenticating, or downloading installation artifacts. A common cause for these errors is the Palette console endpoint or the pairing code was mistyped.

Ensure that the Tenant Portal console endpoint does not have a trailing slash. If these properties were incorrectly specified, power down and delete the installer VM and relaunch with the correct values.

Another potential issue is a lack of outgoing connectivity from the VM. The installer VM needs to have outbound connectivity directly or via a proxy. Adjust proxy settings (if applicable) to fix the connectivity or power down and delete the installer VM and relaunch it in a network that enables outgoing connections.

If the above steps do not resolve your issues, you can copy the following script to the installer VM and invoke it to generate a logs archive. Please contact our support team by sending an email to support@spectrocloud.com and attach the logs archive to the ticket so our Support team can troubleshoot the issue and provide further guidance.

<br />

``` bash
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
```
<br />

### Gateway Cluster - Provisioning Stalled or Failed

An installation of the gateway cluster may run into errors or might get stuck in the provisioning state due to several reasons, such as lack of infrastructure resources, unavailable IP addresses, inability to perform a Network Time Protocol (NTP) sync.

While these are most common, some other issue might be related to the underlying VMware environment. The Cluster Details page, which can be accessed by clicking anywhere on the gateway widget, contains details of every orchestration step including an indication of the current task being executed.

Any intermittent errors will be displayed on this page next to the relevant orchestration task. The **Events** tab on this page, also provides a useful resource to look at lower-level operations being performed for the various orchestration steps.

If you think that the orchestration is stuck or failed due to incorrectly selected infrastructure resources or an intermittent problem with the infrastructure, you can reset the gateway by clicking on the **Reset** button on the gateway widget. This resets the gateway state to **Pending** and allows you to reconfigure the gateway and start provisioning a new gateway cluster.

If the problem persists, please contact our support team by sending an email to support@spectrocloud.com.
<br />