---
sidebar_label: "Cluster Deployment"
title: "Troubleshooting steps for errors during a cluster deployment"
description: "Troubleshooting steps for errors during a cluster deployment."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["troubleshooting", "cluster-deployment"]
---

The following steps will help you troubleshoot errors in the event issues arise while deploying a cluster.

## Scenario - CoreDNS Pods Stuck in Azure Government Secret Clusters

When deploying an [Azure IaaS cluster](../clusters/public-cloud/azure/create-azure-cluster.md) in
[Azure Government Secret](../clusters/public-cloud/azure/azure-cloud.md#azure-government-secret-cloud) cloud, you may
encounter networking issues related to `coredns` pods never entering a `Ready` state. This can be the result of the
control plane coming up before the Container Network Interface (CNI), preventing pods from being assigned IP addresses.

To confirm if you are experiencing this issue, establish an SSH connection with one of your Azure IaaS cluster nodes,
and run the following command.

```shell
ls -1 /etc/cni/net.d
```

If the directory is missing or empty, paste the following `kubeadmconfig` object into the OS layer of your cluster
profile, and redeploy your cluster. This creates a minimal, local CNI so that pods can start and CoreDNS can resolve,
allowing you to bootstrap the remainder of the cluster and pull the required images.

```yaml
kubeadmconfig:
  files:
    # 3. CNI configs moved to temp locations
    - targetPath: "/tmp/custom-10-bridge.conf" # Temp location
      targetOwner: "root"
      targetPermissions: "0644"
      contentEncoding: "base64"
      content: "ewogICAgImNuaVZlcnNpb24iOiAiMC4zLjEiLAogICAgIm5hbWUiOiAiYnJpZGdlIiwKICAgICJ0eXBlIjogImJyaWRnZSIsCiAgICAiYnJpZGdlIjogImNuaW8wIiwKICAgICJpc0dhdGV3YXkiOiB0cnVlLAogICAgImlwTWFzcSI6IHRydWUsCiAgICAiaXBhbSI6IHsKICAgICAgICAidHlwZSI6ICJob3N0LWxvY2FsIiwKICAgICAgICAicmFuZ2VzIjogWwogICAgICAgICAgICBbeyJzdWJuZXQiOiAiMTkyLjE2OC4wLjAvMTYifV0KICAgICAgICBdLAogICAgICAgICJyb3V0ZXMiOiBbeyJkc3QiOiAiMC4wLjAuMC8wIn1dCiAgICB9Cn0="

    - targetPath: "/tmp/custom-99-loopback.conf" # Temp location
      targetOwner: "root"
      targetPermissions: "0644"
      contentEncoding: "base64"
      content: "ewogICAgImNuaVZlcnNpb24iOiAiMC4zLjEiLAogICAgIm5hbWUiOiAibG8iLAogICAgInR5cGUiOiAibG9vcGJhY2siCn0="

    # 4. Audit policy moved to temp location (DEFINITELY will cause duplicates)
    - targetPath: "/tmp/custom-audit-policy.yaml" # Temp location
      targetOwner: "root"
      targetPermissions: "0644"
      contentEncoding: "base64"
      content: "YXBpVmVyc2lvbjogYXVkaXQuazhzLmlvL3YxCmtpbmQ6IFBvbGljeQpydWxlczoKLSBsZXZlbDogTWV0YWRhdGE="

    # 5. Pod security config moved to temp location (DEFINITELY will cause duplicates)
    - targetPath: "/tmp/custom-pod-security-standard.yaml" # Temp location
      targetOwner: "root"
      targetPermissions: "0644"
      contentEncoding: "base64"
      content: "YXBpVmVyc2lvbjogYXBpc2VydmVyLmNvbmZpZy5rOHMuaW8vdjEKa2luZDogQWRtaXNzaW9uQ29uZmlndXJhdGlvbgpwbHVnaW5zOgotIG5hbWU6IFBvZFNlY3VyaXR5CiAgY29uZmlndXJhdGlvbjoKICAgIGFwaVZlcnNpb246IHBvZC1zZWN1cml0eS5hZG1pc3Npb24uY29uZmlnLms4cy5pby92MWJldGExCiAgICBraW5kOiBQb2RTZWN1cml0eUNvbmZpZ3VyYXRpb24KICAgIGRlZmF1bHRzOgogICAgICBlbmZvcmNlOiAicmVzdHJpY3RlZCIKICAgICAgZW5mb3JjZS12ZXJzaW9uOiAibGF0ZXN0IgogICAgICBhdWRpdDogInJlc3RyaWN0ZWQiCiAgICAgIGF1ZGl0LXZlcnNpb246ICJsYXRlc3QiCiAgICAgIHdhcm46ICJyZXN0cmljdGVkIgogICAgICB3YXJuLXZlcnNpb246ICJsYXRlc3QiCiAgICBleGVtcHRpb25zOgogICAgICB1c2VybmFtZXM6IFtdCiAgICAgIHJ1bnRpbWVDbGFzc2VzOiBbXQogICAgICBuYW1lc3BhY2VzOiBba3ViZS1zeXN0ZW1d"

  preKubeadmCommands:
    # Create necessary directories first
    - "mkdir -p /etc/cni/net.d"

    # Copy your custom configs to final locations (this OVERWRITES any pack-provided files)
    - "cp /tmp/custom-10-bridge.conf /etc/cni/net.d/10-bridge.conf"
    - "cp /tmp/custom-99-loopback.conf /etc/cni/net.d/99-loopback.conf"
    - "cp /tmp/custom-audit-policy.yaml /etc/kubernetes/audit-policy.yaml"
    - "cp /tmp/custom-pod-security-standard.yaml /etc/kubernetes/pod-security-standard.yaml"

  postKubeadmCommands:
    - "systemctl restart containerd"
    - "systemctl restart kubelet"
```

## Scenario - PV/PVC Stuck in Pending Status for EKS Cluster Using AL2023 AMI

After deploying an Amazon EKS cluster using an
[Amazon Linux 2023 (AL2023) Amazon Machine Image (AMI)](../clusters/public-cloud/aws/eks.md#cloud-configuration-settings),
PersistentVolumes (PVs) or PersistentVolumeClaims (PVCs) are stuck in a pending status.

```shell title="Example"
NAMESPACE   NAME                                 STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS            VOLUMEATTRIBUTESCLASS   AGE   VOLUMEMODE
wordpress   data-wordpress-wordpress-mariadb-0   Pending                                      spectro-storage-class   <unset>                 16m   Filesystem
wordpress   wordpress-wordpress                  Pending                                      spectro-storage-class   <unset>                 16m   Filesystem
```

This issue can arise when an add-on pack or Helm chart that requires a PV or PVC is deployed to an existing cluster or
while creating a new cluster.

The PV or PVC provisioning fails because IAM Roles for Service Accounts (IRSA) have not been configured for the AWS CSI
packs such as Amazon EBS CSI, Amazon EFS CSI, and Amazon Cloud Native. It is also required if using the AWS Application
Loadbalancer.

For instances launched on AL2023,
[IMDSv2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-metadata-transition-to-version-2.html) is enforced
by default, and IRSA is the recommended approach for providing IAM permissions to
[Amazon EBS CSI](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html) and
[Amazon EFS CSI](https://docs.aws.amazon.com/eks/latest/userguide/efs-csi.html).

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Ensure you are in the correct project scope.

3. From the left main menu, navigate to the **Profiles** page. Find and click on your cluster profile.

4. [Create a new version of the cluster profile](../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md).

5. Select the **Kubernetes** layer of your cluster profile.

6. Use the YAML editor to configure IRSA roles for the `managedControlPlane` and `managedMachinePool` resources.

   <Tabs groupId="aws-csi">

   <TabItem value="AWS EBS CSI" label="AWS EBS CSI">

   ```yaml hideClipboard title="Example configuration"
   managedControlPlane:
   ---
   irsaRoles:
     - name: "{{.spectro.system.cluster.name}}-irsa-cni"
       policies:
         - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
       serviceAccount:
         name: aws-node
         namespace: kube-system
     - name: "{{.spectro.system.cluster.name}}-irsa-csi"
       policies:
         - arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy
   ---
   managedMachinePool:
     roleAdditionalPolicies:
       - "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
   ```

   </TabItem>

   <TabItem value="AWS EFS CSI" label="AWS EFS CSI">

   ```yaml hideClipboard title="Example configuration"
   managedControlPlane:
   ---
   irsaRoles:
     - name: "{{.spectro.system.cluster.name}}-irsa-cni"
       policies:
         - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
       serviceAccount:
         name: aws-node
         namespace: kube-system
     - name: "{{.spectro.system.cluster.name}}-irsa-csi"
       policies:
         - arn:aws:iam::aws:policy/service-role/AmazonEFSCSIDriverPolicy
   ---
   managedMachinePool:
     roleAdditionalPolicies:
       - "arn:aws:iam::aws:policy/service-role/AmazonEFSCSIDriverPolicy"
   ```

   </TabItem>

   </Tabs>

7. Click **Confirm Updates** after editing.

8. Select the **Storage** layer of your cluster profile.

9. Use the YAML editor to add an IAM role ARN annotation to the AWS CSI Driver so that the IRSA role is correctly
   referenced. Replace `<aws-account-id>` with your AWS account ID.

   <Tabs groupId="aws-csi">

   <TabItem value="AWS EBS CSI" label="AWS EBS CSI">

   ```yaml hideClipboard title="Example configuration" {12}
   charts:
   ...
     aws-ebs-csi-driver:
     ...
       controller:
       ...
         serviceAccount:
           # A service account will be created for you if set to true. Set to false if you want to use your own.
           create: true
           name: ebs-csi-controller-sa
           annotations: {
             "eks.amazonaws.com/role-arn":"arn:aws:iam::<aws-account-id>:role/{{.spectro.system.cluster.name}}-irsa-csi"
           }
           ## Enable if EKS IAM for SA is used
           # eks.amazonaws.com/role-arn: arn:<partition>:iam::<account>:role/ebs-csi-role
           automountServiceAccountToken: true
   ```

   </TabItem>

   <TabItem value="AWS EFS CSI" label="AWS EFS CSI">

   ```yaml hideClipboard title="Example configuration" {12}
   charts:
   ...
     aws-efs-csi-driver:
     ...
       controller:
       ...
         serviceAccount:
           # A service account will be created for you if set to true. Set to false if you want to use your own.
           create: true
           name: efs-csi-controller-sa
           annotations: {
             "eks.amazonaws.com/role-arn":"arn:aws:iam::<aws-account-id>:role/{{.spectro.system.cluster.name}}-irsa-csi"
           }
           ## Enable if EKS IAM for SA is used
           #  eks.amazonaws.com/role-arn: arn:aws:iam::111122223333:role/efs-csi-role
   ```

   </TabItem>

   </Tabs>

10. Update the custom labels for the AWS CSI Driver to retrigger the deployment.

    <Tabs groupId="aws-csi">

    <TabItem value="AWS EBS CSI" label="AWS EBS CSI">

    ```yaml hideClipboard title="Example"
    charts:
    ...
      aws-ebs-csi-driver:
      ...
        customLabels: {
          restart: "true"
        }
    ```

    </TabItem>

    <TabItem value="AWS EFS CSI" label="AWS EFS CSI">

    ```yaml hideClipboard title="Example"
    charts:
    ...
      aws-efs-csi-driver:
      ...
        controller:
          podLabels: {
            restart: "true"
          }
        ...
        node:
          podLabels: {
            restart: "true"
          }
    ```

    </TabItem>

    </Tabs>

11. Click **Confirm Updates** after editing.

12. Click **Save Changes** on the cluster profile page.

13. Update your cluster to use the new cluster profile version that you created with these changes. Refer to
    [Update a Cluster](../clusters/cluster-management/cluster-updates.md#enablement) for guidance.

14. Wait for the nodes to be repaved and the AWS CSI Driver to be redeployed.

15. Check that the PV or PVC status is `Bound` by issuing one of the following `kubectl` commands.

    ```shell title="Example command for PVs"
    kubectl get pv --output wide
    ```

    ```shell title="Example output for PVs"
    NAME               CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                         STORAGECLASS            VOLUMEATTRIBUTESCLASS   AGE   VOLUMEMODE
    pv-xyz...          10Gi       RWO            Delete           Bound    wordpress/data-wordpress-wordpress-mariadb-0  spectro-storage-class   <unset>                 16m   Filesystem
    pv-abc...          8Gi        RWO            Delete           Bound    wordpress/wordpress-wordpress                 spectro-storage-class   <unset>                 16m   Filesystem
    ```

    ```shell title="Example command for PVCs"
    kubectl get pvc --all-namespaces --output wide
    ```

    ```shell title="Example output for PVCs"
    NAMESPACE   NAME                                 STATUS    VOLUME      CAPACITY   ACCESS MODES   STORAGECLASS            VOLUMEATTRIBUTESCLASS   AGE   VOLUMEMODE
    wordpress   data-wordpress-wordpress-mariadb-0   Bound     pvc-xyz...  10Gi       RWO            spectro-storage-class   <unset>                 16m   Filesystem
    wordpress   wordpress-wordpress                  Bound     pvc-abc...  8Gi        RWO            spectro-storage-class   <unset>                 16m   Filesystem
    ```

## Scenario - Instances Continuously Delete Every 30 Minutes

An instance is launched and terminated every 30 minutes prior to completion of its deployment, and the **Events Tab**
lists errors with the following message:

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

      ```shell
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

     - For Public Clouds that do not use Gateway, verify the connection between the public Internet and the Kubernetes
       endpoint:

       ```shell
       curl -k https://<KUBE_API_SERVER_IP>:6443
       ```

       :::info

       You can obtain the URL for the Kubernetes API using this command: `kubectl cluster-info`.

       :::

6. Check `stdout` for errors. You can also open a support ticket. Visit our
   [support page](http://support.spectrocloud.io/).

## Scenario - Deployment Violates Pod Security

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

## Scenario - Nutanix CAPI Deployment Updates

In the event that the internal Nutanix cluster Cluster API (CAPI) configurations are updated, there is a possibility
that the cluster's Kubernetes deployments may encounter issues, resulting in an unhealthy cluster. This can occur when
the CAPI changes may be incompatible with the newer version of Palette. The following steps will help you troubleshoot
and resolve this issue.

### Debug Steps

1. Open a terminal session and ensure you have the `kubectl` CLI installed. If you do not have the CLI installed, you
   can download it from the [Kubernetes](https://kubernetes.io/docs/tasks/tools/install-kubectl/) website.

2. Set up your terminal session to use the kubeconfig file for your Nutanix cluster. You can find the kubeconfig for
   your cluster in the Palette UI by visiting the Nutanix cluster's details page. Check out the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli) guide for
   guidance on how to set up your terminal session to use the kubeconfig file.

3. To restore the cluster to a healthy state, you need to delete the following deployments so that Palette can re-create
   them with the updated machine template. Issue the following commands to delete the following three deployments.

   ```shell
    kubectl delete deployment capi-controller-manager --namespace capi-system
   ```

   ```shell
    kubectl delete deployment capi-kubeadm-bootstrap-controller-manager --namespace capi-kubeadm-bootstrap-system
   ```

   ```shell
    kubectl delete deployment capi-kubeadm-control-plane-controller-manager --namespace capi-kubeadm-control-plane-system
   ```

4. Palette will automatically re-create the deleted deployments with the updated machine template. You can monitor the
   progress of the re-creation by checking the status of the deployments using the following command.

   ```shell
   kubectl get deployments --all-namespaces
   ```
