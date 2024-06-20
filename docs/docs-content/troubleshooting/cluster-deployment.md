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

An instance is launched and terminated every 30 minutes prior to completion of its deployment, and the **Events Tab**
lists errors with the following message:

<br />

```hideClipboard bash
Failed to update kubeadmControlPlane Connection timeout connecting to Kubernetes Endpoint
```

This behavior can occur when Kubernetes services for the launched instance fail to start properly. Common reasons for
why a service may fail are:

- The specified image could not be pulled from the image repository.
- The cloud init process failed.

### Debug Steps

1. Initiate an SSH session with the Kubernetes instance using the SSH key provided during provisioning, and log in as
   user `spectro`. If you are initiating an SSH session into an installer instance, log in as user `ubuntu`.

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

4. If the Kubelet service does not work as expected, do the following. If the service operates correctly, you can skip
   this step.

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

   - When the connection is established, verify the pods are in a _Running_ state. Take note of any pods that are not in
     _Running_ state.

   ```shell
       kubectl get pods -o wide
   ```

   - If all the pods are operating correctly, verify their connection with the Palette API.

     - For clusters using Gateway, verify the connection between the Installer and Gateway instance:
       ```shell
          curl -k https://<KUBE_API_SERVER_IP>:6443
       ```
     - For Public Clouds that do not use Gateway, verify the connection between the public Internet and the Kube
       endpoint:

       ```shell
           curl -k https://<KUBE_API_SERVER_IP>:6443
       ```

       :::info

       You can obtain the URL for the Kubernetes API using this command: `kubectl cluster-info`.

       :::

6. Check stdout for errors. You can also open a support ticket. Visit our
   [support page](http://support.spectrocloud.io/).

## Deployment Violates Pod Security

Cluster deployment fails with the following message.

```
Error creating: pods <name of pod> is forbidden: violates PodSecurity "baseline:v<k8s version>": non-default capabilities …
```

This can happen when the cluster profile uses Kubernetes 1.25 or later and also includes packs that create pods that
require elevated privileges.

### Debug Steps

To address this issue, you can change the Pod Security Standards of the namespace where the pod is being created.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Profiles**.

3. Select the profile you are using to deploy the cluster. Palette displays the profile stack and details.
4. Click on the pack layer in the profile stack that contains the pack configuration.

5. In the pack's YAML file, add a subfield in the `pack` section called `namespaceLabels` if it does not already exist.

6. In the `namespaceLabels` section, add a line with the name of your namespace as the key and add
   `pod-security.kubernetes.io/enforce=privileged,pod-security.kubernetes.io/enforce-version=v<k8s_version>` as its
   value. Replace `<k8s_version>` with the version of Kubernetes on your cluster and only include the major and minor
   version following the lowercase letter `v`. For example, `v1.25` and `v1.28`.
7. If a key matching your namespace already exists, add the labels to the value corresponding to that key.

:::warning

We recommend only applying the labels to namespaces where pods fail to be created. If your pack creates multiple
namespaces, and you are unsure which ones contain pods that need the elevated privileges, you can access the cluster
with the kubectl CLI and use the `kubectl get pods` command. This command lists pods and their namespaces so you can
identify the pods that are failing at creation.

For guidance in using the CLI, review
[Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli). To learn more about
kubectl pod commands, refer to the
[Kubernetes](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) documentation.

:::

### Examples

The following example shows a pack that creates a namespace called `"monitoring"`. In this example, the `monitoring`
namespace does not have any pre-existing labels. You need to add the `namespaceLabels` line as well as the corresponding
key-value pair under it to apply the labels to the `monitoring` namespace.

```yaml
pack:
  namespace: "monitoring"

  namespaceLabels:
    "monitoring": "pod-security.kubernetes.io/enforce=privileged,pod-security.kubernetes.io/enforce-version=v1.28"
```

This second example is similar to the first one. However, in this example, the `monitoring` key already exists under
`namespaceLabels`, with its original value being `"org=spectro,team=dev"`. Therefore, you add the labels to the existing
value:

```yaml
pack:
  namespace: "monitoring"

  namespaceLabels:
    "monitoring": "org=spectro,team=dev,pod-security.kubernetes.io/enforce=privileged,pod-security.kubernetes.io/enforce-version=v1.28"
```
