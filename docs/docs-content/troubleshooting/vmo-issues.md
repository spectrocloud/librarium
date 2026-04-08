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

On [self-hosted Palette](../enterprise-version/install-palette/install-on-kubernetes/install-on-kubernetes.md) and
[Palette VerteX](../vertex/install-palette-vertex/install-on-kubernetes/install-on-kubernetes.md) Helm-based
installations, the cluster's **Virtual Machines** tab or the VMO Graphical User Interface (GUI) may fail to load.

### Debug Steps

To fix these issues, you must adjust two default ingress configurations. If your self-hosted environment uses an IP
address instead of a domain name, only the [Rate Limiting](#adjust-rate-limit) fix is applicable.

- [**Rate Limiting**](#adjust-rate-limit) - The `IngressRoute` resource `hubble-foreq-ingress-resource` may reference a
  rate-limit `Middleware` resource with a value that is too low, causing the VMO GUI to get stuck when loading.

- [**Content Security Policy (CSP)**](#adjust-csp) - Three Traefik `Middleware` resources contain a
  `Content-Security-Policy` header with `frame-ancestors` set to `https://*.spectrocloud.com`. This blocks the VMO GUI
  from loading when your Palette instance uses a different domain name. This issue does not apply to self-hosted
  environments that use an IP address instead of a domain name.

#### Adjust Rate Limit

1. Log in to your
   [self-hosted Palette](../enterprise-version/system-management/system-management.md#access-the-system-console) or
   [Palette VerteX system console](../vertex/system-management/system-management.md#access-the-system-console).

2. From the left main menu, select **Enterprise Cluster**.

3. On the **Overview** tab, download the **Kubernetes Config File**.

4. From your terminal, set the `KUBECONFIG` variable to the file path of the kubeconfig.

   ```shell
   export KUBECONFIG=<path-to-kubeconfig>
   ```

5. Verify that the `IngressRoute` resource `hubble-foreq-ingress-resource` references the `Middleware` resource
   `rate-limit-10000rps`.

   ```shell
   kubectl get ingressroute hubble-foreq-ingress-resource --namespace hubble-system --output yaml
   ```

   ```yaml title="Example output" {11} hideClipboard
   ... # additional output omitted for readability
   spec:
      entryPoints:
      - web
      - websecure
      routes:
      - kind: Rule
         match: PathPrefix(`/v1/tenantApps`)
         middlewares:
         - name: foreq-security-headers
         - name: rate-limit-10000rps
         services:
         - name: foreq-service
            port: 443
            scheme: https
            serversTransport: foreq-service-https
   ```

   If it references a lower rate limit, such as `rate-limit-10rps`, update it to `rate-limit-10000rps`.

   ```shell
   kubectl patch ingressroute hubble-foreq-ingress-resource --namespace hubble-system --type json \
   --patch '[{"op": "replace", "path": "/spec/routes/0/middlewares/1/name", "value": "rate-limit-10000rps"}]'
   ```

6. Verify that the `Middleware` resource `rate-limit-10000rps` exists and has a `spec.rateLimit.average` of `10000`.

   ```shell
   kubectl get middleware rate-limit-10000rps --namespace hubble-system --output yaml
   ```

   ```yaml title="Example output" hideClipboard {17}
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
     name: rate-limit-10000rps
     namespace: hubble-system
     resourceVersion: "36011"
     uid: 7d90e97c-ff6e-462d-8643-5d08db2bda7b
   spec:
     rateLimit:
       average: 10000
       burst: 20000
       period: 1s
   ```

   If the `Middleware` resource `rate-limit-10000rps` does not exist or has a different value, use the following command
   to create or update it.

   ```shell
   cat <<EOF | kubectl apply --filename -
   apiVersion: traefik.io/v1alpha1
   kind: Middleware
   metadata:
   name: rate-limit-10000rps
   namespace: hubble-system
   spec:
   rateLimit:
      average: 10000
      period: 1s
      burst: 20000
   EOF
   ```

#### Adjust CSP

:::info

This procedure does not apply to self-hosted environments that use an IP address instead of a domain name.

:::

1. Log in to your
   [self-hosted Palette](../enterprise-version/system-management/system-management.md#access-the-system-console) or
   [Palette VerteX system console](../vertex/system-management/system-management.md#access-the-system-console).

2. From the left main menu, select **Enterprise Cluster**.

3. On the **Overview** tab, download the **Kubernetes Config File**.

4. From your terminal, set the `KUBECONFIG` variable to the file path of the kubeconfig.

   ```shell
   export KUBECONFIG=<path-to-kubeconfig>
   ```

5. Verify the current `Content-Security-Policy` value for the following `Middleware` resources.

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
   `<rootDomain>` in the following commands with your Palette root domain.

   :::tip

   Use the following command to identify your root domain.

   ```shell
   kubectl get configmap root-domain-info --namespace hubble-system --output jsonpath='{.data.apiEndpoint}'
   ```

   :::

   ```shell
   kubectl patch middleware ui-csp-frame-ancestors --namespace ui-system --type merge \
   --patch '{"spec":{"headers":{"customResponseHeaders":{"Content-Security-Policy":"frame-ancestors '\''self'\'' https://*.<rootDomain> https://<rootDomain>"}}}}'
   ```

   ```shell
   kubectl patch middleware cp-csp-frame-ancestors --namespace cp-system --type merge \
   --patch '{"spec":{"headers":{"customResponseHeaders":{"Content-Security-Policy":"frame-ancestors '\''self'\'' https://*.<rootDomain> https://<rootDomain>"}}}}'
   ```

   ```shell
   kubectl patch middleware foreq-security-headers --namespace hubble-system --type merge \
   --patch '{"spec":{"headers":{"customResponseHeaders":{"Content-Security-Policy":"frame-ancestors '\''self'\'' https://*.<rootDomain> https://<rootDomain>;"}}}}'
   ```

7. Verify the updated values. Each `Middleware` resource should display a `Content-Security-Policy` header with
   `frame-ancestors 'self' https://*.<rootDomain> https://<rootDomain>`.

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
