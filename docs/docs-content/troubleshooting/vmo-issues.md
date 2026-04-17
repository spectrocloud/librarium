---
sidebar_label: "Virtual Machine Orchestrator"
title: "Virtual Machine Orchestrator"
description: "Troubleshooting steps for common Virtual Machine Orchestrator scenarios."
icon: ""
hide_table_of_contents: false
sidebar_position: 55
tags: ["troubleshooting", "vmo"]
---

The following are common scenarios that you may encounter when using Virtual Machine Orchestrator (VMO).

## Scenario - VMO Loading Errors in Self-Hosted Palette

On [self-hosted Palette](../enterprise-version/enterprise-version.md) and [Palette VerteX](../vertex/vertex.md)
installations, the cluster's **Virtual Machines** tab or the VMO Graphical UI (GUI) may fail to load. This issue applies
to all installation methods but does not apply to self-hosted environments that use an IP address instead of a domain
name.

The root cause is a `Content-Security-Policy` header with `frame-ancestors` set to `https://*.spectrocloud.com`, which
blocks the VMO GUI from loading when your Palette instance uses a different domain name. This header can be present in Traefik Middleware resources or Nginx Ingress annotations, depending on the version of Palette you are running.

### Debug Steps

1. Log in to your
   [self-hosted Palette](../enterprise-version/system-management/system-management.md#access-the-system-console) or
   [Palette VerteX](../vertex/system-management/system-management.md#access-the-system-console) system console.

2. From the left main menu, select **Enterprise Cluster**.

3. On the **Overview** tab, download the **Kubernetes Config File**.

4. From your terminal, set the `KUBECONFIG` variable to the file path of the kubeconfig.

   ```shell
   export KUBECONFIG=<path-to-kubeconfig>
   ```

<Tabs>

<TabItem label="Traefik (>= 4.8.37)" value="traefik">

5. Verify the current `Content-Security-Policy` value for the following Traefik `Middleware` resources.

   ```shell
   kubectl get middleware ui-csp-frame-ancestors --namespace ui-system --output yaml
   kubectl get middleware cp-csp-frame-ancestors --namespace cp-system --output yaml
   kubectl get middleware foreq-security-headers --namespace hubble-system --output yaml
   ```

   ```yaml title="Example output" hideClipboard {18}
   apiVersion: traefik.io/v1alpha1
   kind: Middleware
      metadata:
      annotations:
         meta.helm.sh/release-name: hubble
         meta.helm.sh/release-namespace: default
      creationTimestamp: "2026-04-07T15:03:54Z"
      generation: 1
      labels:
         app.kubernetes.io/managed-by: Helm
      name: ui-csp-frame-ancestors
      namespace: ui-system
      resourceVersion: "36023"
      uid: 2f87aada-b8cf-454f-8c32-38be34b060bf
   spec:
      headers:
         customResponseHeaders:
            Content-Security-Policy: frame-ancestors 'self' https://*.spectrocloud.com
   ```

6. Update each applicable `Middleware` resource by replacing `https://*.spectrocloud.com` with your root domain. Replace
   `<root-domain>` in the following commands with your Palette root domain.

   :::tip

   Use the following command to identify your root domain.

   ```shell
   kubectl get configmap root-domain-info --namespace hubble-system --output jsonpath='{.data.apiEndpoint}'
   ```

   :::

   ```shell
   kubectl patch middleware ui-csp-frame-ancestors --namespace ui-system --type merge \
   --patch '{"spec":{"headers":{"customResponseHeaders":{"Content-Security-Policy":"frame-ancestors '\''self'\'' https://*.<root-domain> https://<root-domain>"}}}}'
   ```

   ```shell
   kubectl patch middleware cp-csp-frame-ancestors --namespace cp-system --type merge \
   --patch '{"spec":{"headers":{"customResponseHeaders":{"Content-Security-Policy":"frame-ancestors '\''self'\'' https://*.<root-domain> https://<root-domain>"}}}}'
   ```

   ```shell
   kubectl patch middleware foreq-security-headers --namespace hubble-system --type merge \
   --patch '{"spec":{"headers":{"customResponseHeaders":{"Content-Security-Policy":"frame-ancestors '\''self'\'' https://*.<root-domain> https://<root-domain>;"}}}}'
   ```

7. Verify the updated values. Each `Middleware` resource should display a `Content-Security-Policy` header with
   `frame-ancestors 'self' https://*.<root-domain> https://<root-domain>`.

   ```shell
   kubectl get middleware ui-csp-frame-ancestors --namespace ui-system --output yaml
   kubectl get middleware cp-csp-frame-ancestors --namespace cp-system --output yaml
   kubectl get middleware foreq-security-headers --namespace hubble-system --output yaml
   ```

   ```yaml title="Example output" hideClipboard {18-19}
   apiVersion: traefik.io/v1alpha1
   kind: Middleware
   metadata:
      annotations:
         meta.helm.sh/release-name: hubble
         meta.helm.sh/release-namespace: default
      creationTimestamp: "2026-04-07T15:03:54Z"
      generation: 2
      labels:
         app.kubernetes.io/managed-by: Helm
      name: ui-csp-frame-ancestors
      namespace: ui-system
      resourceVersion: "83150"
      uid: 2f87aada-b8cf-454f-8c32-38be34b060bf
   spec:
      headers:
         customResponseHeaders:
            Content-Security-Policy: frame-ancestors 'self' https://*.docs-test.spectrocloud.com
            https://docs-test.spectrocloud.com
   ```

</TabItem>

<TabItem label="Nginx (< 4.8.37)" value="nginx">

5. Verify the current `Content-Security-Policy` value in the `configuration-snippet` annotation of the following Nginx
   `Ingress` resources.

   ```shell
   kubectl get ingress optic-ingress-resource --namespace ui-system \
   --output jsonpath='{.metadata.annotations.nginx\.ingress\.kubernetes\.io/configuration-snippet}'
   ```

   ```shell
   kubectl get ingress spectro-cp-ingress-resource --namespace cp-system \
   --output jsonpath='{.metadata.annotations.nginx\.ingress\.kubernetes\.io/configuration-snippet}'
   ```

   ```shell
   kubectl get ingress hubble-foreq-ingress-resource --namespace hubble-system \
   --output jsonpath='{.metadata.annotations.nginx\.ingress\.kubernetes\.io/configuration-snippet}'
   ```

   ```text title="Example output" hideClipboard
   more_set_headers "Content-Security-Policy: frame-ancestors 'self' https://*.spectrocloud.com";
   proxy_ssl_name $proxy_host;
   ```

6. Update the `configuration-snippet` annotation on each Ingress resource by replacing `https://*.spectrocloud.com` with
   your root domain. Replace `<root-domain>` in the following commands with your Palette root domain.

   :::tip

   Use the following command to identify your root domain.

   ```shell
   kubectl get configmap root-domain-info --namespace hubble-system --output jsonpath='{.data.apiEndpoint}'
   ```

   :::

   ```shell
   kubectl annotate ingress optic-ingress-resource --namespace ui-system --overwrite \
   nginx.ingress.kubernetes.io/configuration-snippet=$'more_set_headers "Content-Security-Policy: frame-ancestors \'self\' https://*.<root-domain> https://<root-domain>";
   proxy_ssl_name $proxy_host;'
   ```

   ```shell
   kubectl annotate ingress spectro-cp-ingress-resource --namespace cp-system --overwrite \
   nginx.ingress.kubernetes.io/configuration-snippet=$'more_set_headers "Content-Security-Policy: frame-ancestors \'self\' https://*.<root-domain> https://<root-domain>";
   proxy_ssl_name $proxy_host;'
   ```

   ```shell
   kubectl annotate ingress hubble-foreq-ingress-resource --namespace hubble-system --overwrite \
   nginx.ingress.kubernetes.io/configuration-snippet=$'proxy_ssl_name $proxy_host;
   add_header Content-Security-Policy "frame-ancestors \'self\' https://*.<root-domain> https://<root-domain>;";
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
   add_header X-Content-Type-Options "nosniff" always;
   add_header X-XSS-Protection "1; mode=block" always;
   add_header Referrer-Policy "same-origin" always;'
   ```

   :::warning

   The `hubble-foreq-ingress-resource` has additional security headers in its `configuration-snippet` annotation. The
   command above preserves all existing headers. Do not remove them.

   :::

7. Verify the updated values. Each Ingress resource should display a `Content-Security-Policy` header with
   `frame-ancestors 'self' https://*.<root-domain> https://<root-domain>` in its `configuration-snippet` annotation.

   ```shell
   kubectl get ingress optic-ingress-resource --namespace ui-system \
   --output jsonpath='{.metadata.annotations.nginx\.ingress\.kubernetes\.io/configuration-snippet}'
   ```

   ```shell
   kubectl get ingress spectro-cp-ingress-resource --namespace cp-system \
   --output jsonpath='{.metadata.annotations.nginx\.ingress\.kubernetes\.io/configuration-snippet}'
   ```

   ```shell
   kubectl get ingress hubble-foreq-ingress-resource --namespace hubble-system \
   --output jsonpath='{.metadata.annotations.nginx\.ingress\.kubernetes\.io/configuration-snippet}'
   ```

   ```text title="Example output" hideClipboard
   more_set_headers "Content-Security-Policy: frame-ancestors 'self' https://*.docs-test.spectrocloud.com https://docs-test.spectrocloud.com";
   proxy_ssl_name $proxy_host;
   ```

</TabItem>

</Tabs>

## Scenario - Virtual Machine (VM) Migration Plans in Unknown State

When using the [VM Migration Assistant](../vm-management/vm-migration-assistant/vm-migration-assistant.md) to migrate
VMs to your VMO cluster, migration plans can enter an **Unknown** state if more VMs are selected for migration than the
**Max concurrent virtual machine migrations** setting allows. This value determines the maximum number of VMs that can
be migrated simultaneously across all active migration plans.

To avoid this scenario, we recommend setting an appropriate value for **Max concurrent virtual machine migrations**
based on your workload and expected migration patterns. A higher value helps prevent migration plans from entering an
**Unknown** state due to excessive concurrency.

If migration plans do enter an **Unknown** state, use the following steps to resolve the issue.

### Debug Steps

1. [Access the VM Migration Assistant service console](../vm-management/vm-migration-assistant/create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left **Main Menu**, select **Overview**.

3. In the **Overview** tab, locate the configurable settings for the migration controller.

   ![Migration Controller Settings](/vm-management_vm-migration-assistant_additional-configuration_overview-settings.webp)

4. Click the pencil icon next to the **Max concurrent virtual machine migrations** setting.

5. In the pop-up window, increase the value based on the maximum number of VMs you expect to migrate concurrently across
   all active migration plans.

   For example, if you expect to migrate a maximum of 25 VMs across all active migration plans, set this value to 25 or
   more.

6. Click **Save** after making the change.

You will now need to recreate any migration plans that are in an **Unknown** state, and start them again. Refer to
[Create Migration Plans](../vm-management/vm-migration-assistant/create-migration-plans.md) for guidance.

## Scenario - Virtual Machines (VM) Stuck in a Migration Loop

Clusters with the VMO pack may experience VMs getting stuck in a continuous migration loop, as indicated by a
`Migrating` or `Migration` VM status. Use the following steps to troubleshoot and resolve the issue.

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com) and click **Clusters** from the left **Main Menu**.

2. Select your cluster and click on the **Profile** tab.

3. Select the VMO pack layer and click **Values** under the **Pack Details** section.

4. Comment out the following lines under the `kubevirtResource` section and click **Save**.

   ```yaml
   workloads: {}
   # workloadsUpdateStrategy:
   #     workloadUpdateMethods:
   #     - LiveMigrate
   ```

5. The KubeVirt custom resource may fail to update after changing the VMO pack values in the Palette UI. To ensure the
   changes take effect, follow the [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) guide to
   connect to your host cluster using the [kubectl](https://kubernetes.io/docs/tasks/tools/) CLI.

6. In your terminal, issue the following command to edit the KubeVirt custom resource.

   ```bash
   kubectl edit kubevirt --namespace kubevirt
   ```

7. Comment out the following lines under the `spec` block and save the file.

   ```yaml
   # workloadUpdateStrategy:
   #   workloadUpdateMethods:
   #   - LiveMigrate
   ```

8. Within a few minutes, the VMs will stop being stuck in the continuous migration loop.

   :::warning

   Step **4** affects the [CPU Hotplug](../vm-management/create-manage-vm/enable-cpu-hotplug.md) functionality. If your
   cluster has CPU Hotplug enabled, you will need to manually restart your VM each time you add a virtual CPU for the
   changes to take effect.

   :::

## Scenario - OVA Imports Fail Due To Storage Class Attribute

If you are importing an OVA file through the Palette CLI
[VMO command](../automation/palette-cli/commands/vmo.md#import-ova), `import-ova`, and the import fails. It may be due
to the VMO cluster using a `storageClass` with an unsupported volume bind mode, such as
`volumeBindingMode: WaitForFirstConsumer`. To address this issue, use the following steps to update the `storageClass`
attribute for the VMO cluster.

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com)

2. Navigate to the **left Main Menu** and select **Clusters**.

3. Select your VMO cluster to access the cluster details page.

4. Download the cluster's kubeconfig file by clicking the URL for the **Kubeconfig File**. For additional guidance,
   check out the [Kubeconfig](../clusters/cluster-management/kubeconfig.md) guide.

5. Open a terminal session and export the kubeconfig file to your terminal session.

   ```bash
   export KUBECONFIG=/path/to/your/kubeconfig
   ```

6. Use [kubectl](https://kubernetes.io/docs/reference/kubectl/) to create a new _StorageClass_ with
   `volumeBindingMode: Immediate`. Use the following command to create the new _StorageClass_.

   ```bash
    cat <<EOF | kubectl apply --filename -
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: immediate
    provisioner: csi.vsphere.vmware.com
    parameters:
      fstype: ext4
    reclaimPolicy: Delete
    volumeBindingMode: Immediate
    EOF
   ```

7. Select the new _StorageClass_ when prompted during the Palette CLI's OVA import process. You can learn more about the
   OVA import process in the [VMO command](../automation/palette-cli/commands/vmo.md#import-ova) page.
