---
title: "Cluster Deployment"
metaTitle: "Troubleshooting steps for errors during a cluster deployment"
metaDescription: "Troubleshooting steps for errors during a cluster deployment."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

The following steps will help you troubleshoot errors in the event issues arise while deploying a cluster.  


## Scenario - Instances Continuously Delete Every 30 Minutes

An instance is launched and terminated every 30 minutes prior to completion of its deployment, and the **Events Tab** lists errors with the following message:

<br />

```bash
Failed to update kubeadmControlPlane Connection timeout connecting to Kubernetes Endpoint
```

This behavior can occur when Kubernetes services for the launched instance fail to start properly. 
Common reasons for why a service may fail are:

- The specified image could not be pulled from the image repository.
- The cloud init process failed.

### Debugging Steps

1. Initiate an SSH session with the Kubernetes instance using the SSH key provided during provisioning, and log in as user `spectro`. If you are initiating an SSH session into an installer instance, log in as user `ubuntu`.

    ```shell
        ssh --identity_file <_pathToYourSSHkey_> spectro@X.X.X.X 
    ```

2. Elevate the user access. 

    ```shell
        sudo -i
    ```
3. Verify the Kubelet service is operational.
	```shell
        systemctl status kubelet.service
    ```

4. If the Kubelet service does not work as expected, do the following. If the service operates correctly, you can skip this step. 
    1. Navigate to the **/var/log/** folder.
        ```shell
        cd /var/log/
        ```
    2. Scan the **cloud-init-output** file for any errors. Take note of any errors and address them.
        ```
        cat cloud-init-output.log
        ```

5. If the kubelet service works as expected, do the following.  
	- Export the kubeconfig file. 

    ```shell
        export KUBECONFIG=/etc/kubernetes/admin.conf
    ```
	- Connect with the cluster's Kubernetes API. 

    ```shell
        kubectl get pods --all-namespaces
    ```
	- When the connection is established, verify the pods are in a *Running* state. Take note of any pods that are not in *Running* state.

    ```shell
        kubectl get pods -o wide
    ```

	- If all the pods are operating correctly, verify their connection with the Palette API. 
		- For clusters using Gateway, verify the connection between the Installer and Gateway instance:
        ```shell
           curl -k https://<KUBE_API_SERVER_IP>:6443
        ```
		- For Public Clouds that do not use Gateway, verify the connection between the public Internet and the Kube endpoint:
        ```shell
            curl -k https://<KUBE_API_SERVER_IP>:6443
        ```

        <InfoBox>
            You can obtain the URL for the Kubernetes API using this command: kubectl cluster-info 
        </InfoBox>

6. Check stdout for errors. You can also open a support ticket. Visit our [support page](http://support.spectrocloud.io/).


## Scenario - Gateway Installer Registration Failures

There are a couple reasons the Gateway Installer might fail: 

- A bootstrap error might have occured. When the Gateway Installer VM is powered on, it initiates a bootstrap process and registers itself with the tenant portal. This process typically takes 5 to 10 minutes. If the installer fails to register with the tenant portal during this time, it indicates a bootstrapping error. 

    To address the issue, SSH into the Installer virtual machine using the key provided during OVA import and inspect the log file located at *'/var/log/cloud-init-output.log'*. 

    The log file contains error messages about any failures that occur while connecting to the Spectro Cloud management platform portal, authenticating, or downloading installation artifacts. 

    A common cause for these errors is that the Spectro Cloud management platform console endpoint or the pairing code is typed incorrectly. Ensure that the tenant portal console endpoint does not have a trailing slash. If these properties were incorrectly specified, power down and delete the installer VM and re-launch with the correct values.


- The VM may not have an outbound connection. The Gateway Installer VM requires outbound connectivity directly or using a proxy. Adjust proxy settings, if applicable, to fix the connectivity or power down and delete the Installer VM, then relaunch it in a network that enables outbound connections.

If these steps do not resolve the Gateway Installer issues, copy the following script to the Installer VM to generate a logs archive. Open a support ticket by visiting our [support page](http://support.spectrocloud.io/). Attach the logs archive so the Spectro Cloud Support team can troubleshoot the issue and provide further guidance:

```bash
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