---
sidebar_label: "Cluster Deployment"
title: "Troubleshooting steps for errors during a cluster deployment"
description: "Troubleshooting steps for errors during a cluster deployment."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["troubleshooting", "cluster-deployment"]
---





# Cluster Deployment Errors Scenarios

The following steps will help you troubleshoot errors in the event issues arise while deploying a cluster.  


## Instances Continuously Delete Every 30 Minutes


An instance is launched and terminated every 30 minutes prior to completion of its deployment, and the **Events Tab** lists errors with the following message:

<br />

```hideClipboard bash
Failed to update kubeadmControlPlane Connection timeout connecting to Kubernetes Endpoint
```

This behavior can occur when Kubernetes services for the launched instance fail to start properly. 
Common reasons for why a service may fail are:

- The specified image could not be pulled from the image repository.
- The cloud init process failed.

### Debug Steps

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

        :::info
            You can obtain the URL for the Kubernetes API using this command: kubectl cluster-info 
        :::

6. Check stdout for errors. You can also open a support ticket. Visit our [support page](http://support.spectrocloud.io/).

## Deployment Violates Pod Security
In profiles running Kubernetes 1.25 or later, some packs contain pods that need elevated privileges during Pod creation. 
When you try to deploy a cluster with such packs, you get an error message that looks like the following:

```
Error creating: pods <name of pod> is forbidden: violates PodSecurity "baseline:v<k8s version>": non-default capabilities …
```

### Debug Steps

You can change the Pod Security Standards of the namepace where the Pod is being created to address this issue. 

1. Log in to *Palette* and navigate to the *Profiles* tab. 
2. Select the profile you are trying to deploy the cluster with and choose the layer that represents your pack. 
3. In the YAML file for your pack, under the `pack` field, add a subfield `namespaceLabels`. 4. In the `namespaceLabels` field, add a subfield with the name of your namespace as the key and `pod-security.kubernetes.io/enforce=privileged,pod-security.kubernetes.io/enforce-version=v<k8s_version>` as the value. Replace `<k8s_version>` with the version of Kubernetes that runs on your cluster. 
   - For example, if you the pack creates a namespace called "monitoring", add the labels to the monitoring namespace:
   ```yaml
   pack:
    namespace: "monitoring"

    namespaceLabels:
        "monitoring": "org=spectro,team=dev,pod-security.kubernetes.io/enforce=privileged,pod-security.kubernetes.io/enforce-version=v1.28"
   ```


## Gateway Installer Registration Failures

There are a couple reasons the Gateway Installer might fail: 

- A bootstrap error might have occurred. When the Gateway Installer VM is powered on, it initiates a bootstrap process and registers itself with the tenant portal. This process typically takes 5 to 10 minutes. If the installer fails to register with the tenant portal during this time, it indicates a bootstrapping error. 

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

## Gateway Cluster Provisioning Failures

Installation of the Gateway cluster may run into errors or get stuck in the provisioning state for various reasons like lack of infrastructure resources, lack of availability of IP addresses, inability to perform NTP sync, etc. 

While these are the most common failures, some other issues might be related to the underlying VMware environment. The **Cluster Details** page, which you can access by clicking anywhere on the Gateway widget, contains details of every orchestration step, including an indication of the current task. 

Intermittent errors are displayed on the **Cluster Details** page next to the relevant orchestration task. The **Events** tab on this page also provides helpful insights into lower-level operations currently being performed. Suppose you believe the orchestration is stuck or failed due to an invalid selection of infrastructure resources or an intermittent problem with the infrastructure. You may reset the Gateway by clicking on the **Reset** button on the Gateway widget. The Gateway state will transition to Pending. A Gateway in the Pending state allows you to reconfigure the Gateway and start provisioning a new Gateway cluster. If the problem persists, don't hesitate to contact Spectro support via the Service Desk or our [support page](http://support.spectrocloud.io/).

<br />