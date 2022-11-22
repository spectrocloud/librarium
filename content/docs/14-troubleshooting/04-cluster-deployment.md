---
title: "Cluster Deployment"
metaTitle: "Troubleshooting steps for erros during a cluster deployment"
metaDescription: "Troubleshooting steps for errors during a cluster deployment."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

The following steps will help you troubleshoot errors in the event issues arise while deploying a cluster.  



## Scenario - Instances Continuously Delete Every 30 Min

In the scenario that an instance is launched and terminated every 30 minutes prior to deployment conclusion. Additionaly, you may observe in the **Events Tab** errors with the following message. 

<br />

```bash
Failed to update kubeadmControlPlane Connection timeout connecting to Kubernetes Endpoint
```

This behavior can occur when launched instance's Kubernetes services fail to start properly. 
Common reasons for why a service may fail.

- Unable to pull the specified image from the specified image repository.
- The cloud init process has failures.

### Debugging Steps

1. Initiate an SSH session with the Kubernetes instance by using the SSH key provided during provisioning. Log in with the following user `spectro`. If you are initiating an SSH session into an installer instance, use the username `ubuntu`.

    ```shell
        ssh --identity_file pathToYourSSHkey spectro@X.X.X.X 
    ```

2. Elevate the user access with the sudo command. 

    ```shell
        sudo -i
    ```
2. Check the kubelet service is operational with the systemctl command.
	```shell
        systemctl status kubelet.service
    ```
3. If the kubelet service is operational, otherwise skip to step four:
	- Export the kubeconfig file. 

    ```shell
        export KUBECONFIG=/etc/kubernetes/admin.conf
    ```
	- Attempt to connect with the Kubernetes cluster's Kubernetes API 

    ```shell
        kubectl get pods --all-namespaces
    ```
	- If a connection is established and you receive a positive reply check, if all the pods are in a *Running* state.  Make note of the reason if the pods are not in a healthy state.

    ```shell
        kubectl get pods -o wide
    ```

	- If all the pods are operational, verify the connectivity with the Palette API is possible 
		- For Clusters with Gateway- Installer to Gateway instance connectivity
        ```shell
           curl -k https://<KUBE_API_SERVER_IP>:6443
        ```
		- For Public Clouds without Gateway	- Public Internet to Kube endpoint
        ```shell
            curl -k https://<KUBE_API_SERVER_IP>:6443
        ```

        <InfoBox>
            Use the command kubectl cluster-info  if you need to aquire the Kubernetes API URL.
        </InfoBox>

4. If the Kubelet service is not operational:
    1. Navigate to the folder **/var/log/**
        ```shell
        cd /var/log/
        ```
    2. Scan the cloud-init-output for any errors. If there are errors, make note of the errors.
        ```
        cat cloud-init-output.log
        ```
5. Lastly, check stdout for for errors. You can also reach out to Spectro Cloud Support and open up suppor ticket by visiting our [support page](http://support.spectrocloud.io/).



## Scenario - Gateway Installer Registration Failures

The installer VM, when powered on, goes through a bootstrap process and registers itself with the tenant portal. This process typically takes 5 to 10 minutes. Failure of the installer to  register with the tenant portal within this duration might be indicative of a bootstrapping error. SSH into the installer virtual machine using the key provided during OVA import and inspect the log file located at *'/var/log/cloud-init-output.log'*. This log file will contain error messages in the event there are failures with connecting to the Spectro Cloud management platform portal, authenticating, or downloading installation artifacts. A common cause for these errors is that the Spectro Cloud management platform console endpoint or the pairing code is typed incorrectly. Ensure that the tenant portal console endpoint does not have a trailing slash. If these properties were incorrectly specified, power down and delete the installer VM and re-launch with the correct values.

Another potential issue is a lack of outgoing connectivity from the VM. The installer VM needs to have outbound connectivity directly or via a proxy. Adjust proxy settings (if applicable) to fix the connectivity or power down and delete the installer VM and relaunch in a network that enables outgoing connections.

If the above steps do not resolve your issues, copy the following script to the installer VM and execute to generate a logs archive. Open a support ticket and attach the logs archive to the ticket to allow the Spectro Cloud Support team to troubleshoot and provide further guidance:

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