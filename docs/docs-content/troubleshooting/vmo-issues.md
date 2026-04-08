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

## Scenario - Virtual Machines Tab Does Not Load on Self-Hosted Palette

On self-hosted Palette and Palette VerteX environments installed with Helm charts, the **Virtual Machines** tab may fail
to load or display a cross-site content error. The VMO GUI may also get stuck on a loading screen.

These issues are caused by two default ingress configurations that need to be adjusted for self-hosted environments:

- **Content Security Policy (CSP)**: Three Traefik `Middleware` resources contain a `Content-Security-Policy` header
  with `frame-ancestors` set to `https://*.spectrocloud.com`, which blocks the VMO GUI from loading when your Palette
  instance uses a different domain.

- **Rate limiting**: The `hubble-foreq-ingress-resource` `IngressRoute` may reference a rate-limit middleware with a
  value that is too low, causing the VMO GUI to get stuck during loading.

:::info

If you are accessing Palette using only an IP address, you can skip the CSP fix and only apply the rate-limit fix.

:::

### Debug Steps

#### VMO GUI Loading Screen (Rate-Limit Fix)

1. Connect to your self-hosted Palette cluster using [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl).

2. Verify that the `hubble-foreq-ingress-resource` IngressRoute references the `rate-limit-10000rps` middleware.

   ```shell
   kubectl get ingressroute hubble-foreq-ingress-resource --namespace hubble-system --output yaml
   ```

   In the output, confirm that the `middlewares` section includes `rate-limit-10000rps`.

   ```yaml title="Example output" {26} hideClipboard
   apiVersion: traefik.io/v1alpha1
   kind: IngressRoute
   metadata:
      annotations:
         meta.helm.sh/release-name: hubble
         meta.helm.sh/release-namespace: default
      creationTimestamp: "2026-04-07T15:03:54Z"
      generation: 1
      labels:
         app: spectro
         app.kubernetes.io/managed-by: Helm
         module: hubble
      name: hubble-foreq-ingress-resource
      namespace: hubble-system
      resourceVersion: "35952"
      uid: d7435456-ac4f-4b84-8329-e7475e90f20b
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

   If it references a lower rate-limit middleware, such as `rate-limit-10rps`, update it to `rate-limit-10000rps`.

   ```shell
   kubectl patch ingressroute hubble-foreq-ingress-resource --namespace hubble-system --type json \
   --patch '[{"op": "replace", "path": "/spec/routes/0/middlewares/1/name", "value": "rate-limit-10000rps"}]'
   ```

3. Verify that the `rate-limit-10000rps` middleware exists and has the correct value.

   ```shell
   kubectl get middleware rate-limit-10000rps --namespace hubble-system --output yaml
   ```

   The output should show a `spec.rateLimit.average` of `10000`.

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

   If the middleware does not exist or has a different value, create or update it.

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

#### Virtual Machines Tab Error (CSP Fix)

The `Content-Security-Policy` `frame-ancestors` directive must include your Palette root domain to allow the VMO GUI to
load in an iframe.

1. Verify the current `Content-Security-Policy` value for the following `Middleware` resources.

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

2. Update each `Middleware` resource by replacing `https://*.spectrocloud.com` with your root domain. Replace
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

3. Verify the updated values.

   ```shell
   kubectl get middleware ui-csp-frame-ancestors --namespace ui-system --output yaml
   kubectl get middleware cp-csp-frame-ancestors --namespace cp-system --output yaml
   kubectl get middleware foreq-security-headers --namespace hubble-system --output yaml
   ```

   Each middleware should display a `Content-Security-Policy` header with
   `frame-ancestors 'self' https://*.<rootDomain> https://<rootDomain>`.

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
