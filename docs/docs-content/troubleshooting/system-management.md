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

## Scenario - Image Pull Secret not propagated to all clusters

Because Spectro Cloud publishes security-hardened images to authenticated OCI registries, the management plane, PCGs,
and managed workload clusters need the
[image pull secret](../enterprise-version/system-management/configure-image-pull-secret.md) to pull images.

Spectro Cloud automatically propagates the pull secret for you, but this propagation can fail for some clusters. For
example, propagation can fail if a workload cluster loses connectivity to the management plane or is an airgapped
cluster. Affected clusters cannot pull security-hardened images from Spectro Cloud's OCI registries until you create the
secret on the cluster directly.

The **Hardened Images** views in the system console and in tenant settings identify which tenants and clusters did not
receive the pull secret. Use them to locate every affected cluster, then create the pull secret on each cluster
manually.

### Debug Steps

#### Identify Affected Clusters

:::info

Steps 1 through 4 apply only to self-hosted Palette and Palette VerteX. If you administer multi-tenant Palette SaaS,
start at Step 5.

:::

1. Log in to the [Palette](../enterprise-version/system-management/system-management.md#access-the-system-console) or
   [Palette VerteX](../vertex/system-management/system-management.md#access-the-system-console) system console.

2. From the left **Main Menu**, select **Administration**.

3. Select the **Hardened Images** tab.

4. Record every tenant that reports one or more clusters in the **Propagation Failed** state.

5. Log in to the Palette UI as a tenant administrator. In self-hosted environments, log in as an administrator for one
   of the tenants that you recorded in Step 4.

6. From the left **Main Menu**, select **Security**, then select **Hardened Images**.

7. Record the name of every cluster that reports a propagation error.

8. In self-hosted environments, repeat Steps 5 through 7 for each remaining tenant you recorded in Step 4.

#### Create the Pull Secret on Each Cluster

Complete the following steps for every cluster that you recorded in the previous section.

1. Open a terminal session in an environment that has network access to the affected workload cluster. Set the
   `KUBECONFIG` environment variable to the file path of that cluster's kubeconfig.

   ```shell
   export KUBECONFIG=<path-to-kubeconfig>
   ```

2. Create a shell variable set to the base64-encoded pull secret provided by your Spectro Cloud support representative. For self-hosted environments, this is the same value that you pasted into the **Pull secret** field in the system
   console.

   ```shell
   export DOCKER_CONFIG_JSON='<base64-encoded-string-provided>'
   ```

2. Create the image pull secret in every Spectro Cloud system namespace on the workload cluster. Replace
   `<base64-encoded-string>` with the base64-encoded pull secret provided by your Spectro Cloud support representative.
   

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

   ```shell title="Example output" hideClipboard
   secret/spectro-image-pull-secret created
   ```

3. Verify that the secret is present in each namespace.

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

After every affected cluster is updated, return to the **Hardened Images** view in tenant settings and confirm that the
affected clusters now report **Propagation Complete**.
