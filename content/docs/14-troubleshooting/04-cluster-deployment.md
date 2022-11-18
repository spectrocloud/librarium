---
title: "Cluster Deployment Errors"
metaTitle: "Troubleshooting steps for erros during a cluster deployment"
metaDescription: "Troubleshooting steps for erros during a cluster deploymentS"
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
            TBD
        ```
		- For Public Clouds without Gateway	- Public Internet to Kube endpoint
        ```shell
            TBD
        ```

4. If the Kubelet servoce is not operational:
    4. Navigate to folder **/var/log/**
        ```shell
        cd /var/log/
        ```
    5. Check cloud-init-output for any errors.
    6. If no errors check stdout log for errors.