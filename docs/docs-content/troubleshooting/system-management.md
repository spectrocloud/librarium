---
sidebar_label: "System Management"
title: "System Management"
description:
  "Troubleshooting steps for errors encountered while performing system administration tasks in Palette and Palette
  VerteX."
icon: ""
hide_table_of_contents: false
sidebar_position: 65
tags: ["troubleshooting", "self-hosted", "palette", "vertex", "system-management"]
---

Refer to the following sections to troubleshoot errors encountered while performing system administration tasks in
Palette and Palette VerteX. It also includes troubleshooting for tenant administrators when the underlying issue relates
to the system.

## Scenario - Image Pull Secret Not Propagated to Workload Clusters

Because Spectro Cloud publishes security-hardened images to authenticated OCI registries, the clusters need the
[image pull secret](../enterprise-version/system-management/configure-image-pull-secret.md) to pull images.

Spectro Cloud automatically propagates the pull secret for you, but this propagation can fail. For example, propagation
can fail if the management cluster does not have the pull secret or if a workload cluster loses connectivity to the
management plane. Affected clusters cannot pull security-hardened images from Spectro Cloud's OCI registries until they
have the pull secret.

Debug steps vary depending on your product.

### Debug Steps for Palette SaaS

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. From the left **Main Menu**, select **Security**, then select **Hardened Images**.

3. For each cluster in the list, use the failure reason to help determine why the cluster did not receive the secret so
   you can take corrective action.

   - For connectivity issues, the secret will propagate properly when you restore connectivity.
   - If the [Pause Agent Upgrades](../clusters/cluster-management/platform-settings/pause-platform-upgrades.md) feature
     is excluding the cluster from Palette agent upgrades, the cluster does not have the update it needs to receive the
     secret. You need to toggle off Pause Agent Upgrades before the secret will propagate.

### Debug Steps for Self-Hosted Palette and VerteX

1. Log in to the [Palette](../enterprise-version/system-management/system-management.md#access-the-system-console) or
   [Palette VerteX](../vertex/system-management/system-management.md#access-the-system-console) system console.

2. From the left **Main Menu**, select **Administration**.

3. Select the **Hardened Images** tab.

4. Do one of the following:

   - If none of the tenants received the secret, use the system console to make sure that the image pull secret has been
     configured at the system level. Refer to
     [Configure Image Pull Secret for Self-Hosted Palette](../enterprise-version/system-management/configure-image-pull-secret.md)
     or [Configure Image Pull Secret for VerteX](../vertex/system-management/configure-image-pull-secret.md).

     If you do not have access to the system console and need to immediately configure the image pull secret so it can
     be propagated, refer to [Breakglass scenario: Manually create secret in management plane](#breakglass-pull-secret).

   - If some of the tenants received the secret, but others did not, record every tenant that reports one or more
     clusters in the **Propagation Failed** state and proceed to the next step.

5. To investigate why some clusters are receiving the pull secret but others are not, log in to the Palette UI as a
   tenant administrator for one of the tenants that you recorded in Step 4.

6. From the left **Main Menu**, select **Security**, then select **Hardened Images**.

7. For each cluster in the list, use the failure reason to help determine why the cluster did not receive the secret so
   you can take corrective action.

   - For connectivity issues, the secret will propagate properly when you restore connectivity.
   - If the [Pause Agent Upgrades](../clusters/cluster-management/platform-settings/pause-platform-upgrades.md) feature
     is excluding the cluster from Palette agent upgrades, the cluster does not have the update it needs to receive the
     secret. You need to toggle off Pause Agent Upgrades before the secret will propagate.

8. Repeat Steps 5 through 7 for each remaining tenant you recorded in Step 4.

#### Breakglass scenario: Manually create secret in management plane {#breakglass-pull-secret}

If the image pull secret is not properly configured for the deployment and you cannot access the system console to add
it, you can use the terminal to manually create the secret in the management cluster so that it can be propagated to the
workload clusters.

1. Open a terminal session in an environment that has network access to the management cluster. Set the `KUBECONFIG`
   environment variable to the file path of that cluster's kubeconfig.

   ```shell
   export KUBECONFIG=<path-to-kubeconfig>
   ```

2. Create a shell variable set to the base64-encoded pull secret provided by your Spectro Cloud support representative.

   ```shell
   export DOCKER_CONFIG_JSON='<base64-encoded-string-provided>'
   ```

3. Use the following command to create secrets in the management cluster.

   ```shell
   kubectl apply -f - <<EOF
   apiVersion: v1
   kind: Secret
   metadata:
      name: spectro-image-pull-secret
      namespace: <namespace>
   type: kubernetes.io/dockerconfigjson
   data:
      .dockerconfigjson: ${DOCKER_CONFIG_JSON}
   EOF
   ```

   You must create the secret in the following namespaces:

   - `hubble-system`
   - `jet-system`
   - `ui-system`
   - `ingress-traefik`
   - `cp-system`
   - `kube-system`

   For example, to create the secret in the `hubble-system` namespace of the management cluster, run the following.

   ```shell
   kubectl apply -f - <<EOF
   apiVersion: v1
   kind: Secret
   metadata:
      name: spectro-image-pull-secret
      namespace: hubble-system
   type: kubernetes.io/dockerconfigjson
   data:
      .dockerconfigjson: ${DOCKER_CONFIG_JSON}
   EOF
   ```

   ```shell title="Example output" hideClipboard
   secret/spectro-image-pull-secret created
   ```

4. When you are done creating the secret in all of the required namespaces, run the following command to verify that the
   secret is present in each of the namespaces.

   ```shell
   for ns in hubble-system jet-system ui-system ingress-traefik cp-system kube-system; do
     kubectl get secret spectro-image-pull-secret --namespace $ns --output name
   done
   ```

   ```shell title="Example output" hideClipboard
   secret/spectro-image-pull-secret
   secret/spectro-image-pull-secret
   secret/spectro-image-pull-secret
   secret/spectro-image-pull-secret
   secret/spectro-image-pull-secret
   secret/spectro-image-pull-secret
   ```
