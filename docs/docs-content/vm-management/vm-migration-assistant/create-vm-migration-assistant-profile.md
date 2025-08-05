---
sidebar_label: "Create a VM Migration Assistant Profile"
title: "Create a VM Migration Assistant Profile"
description: "Learn how to create a Virtual Machine Migration Assistant cluster profile and add it your VMO cluster"
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm migration assistant"]
---

Follow these steps to create a new add-on profile that will be applied to your existing VMO cluster.

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a cluster profile. Refer to the
  [Permissions](../../user-management/palette-rbac/permissions.md#operations) documentation for more information.
- A healthy VMO cluster. Refer to the [Create a VMO Profile](../create-vmo-profile.md) for further guidance.
  - The VMO cluster must have network connectivity to vCenter and ESXi hosts, and the VMs you want to migrate.

## Create the Profile

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button.

4. Fill out the basic information and ensure you select **Add-on** for the type. Click on **Next** to continue.

5. Select **Add New Pack**. In the next window that displays, enter **Virtual Machine Migration Assistant** in the
   **Filter by name** search bar. The pack is in the **Palette Community Registry**. Select the pack when it appears.

6. Palette displays the YAML file in the editor on the right. You can edit the YAML as needed. Review the following
   service console parameters and adjust to your requirements as needed.

   | **Parameter**                                                        | **Description**                                                                                                                                                                                                                                                                                                                                                                                                             | **Default Value** |
   | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
   | `vm-migration-assistant-ui.console.service.type`                     | Choose how to expose the service console: `NodePort` / `LoadBalancer` / `ClusterIP`. Refer to [Service type](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types) for guidance on Kubernetes service types.                                                                                                                                                                  | `"LoadBalancer"`  |
   | `vm-migration-assistant-ui.console.service.loadBalancerPort`         | Choose the external port to expose the service console when LoadBalancer is selected.                                                                                                                                                                                                                                                                                                                                       | `"443"`           |
   | `vm-migration-assistant-ui.console.service.nodePort`                 | Choose the external port to expose the service console when `nodePort` is selected.                                                                                                                                                                                                                                                                                                                                         | `"30443"`         |
   | `vm-migration-assistant-ui.console.deployment.env.userAuth`          | If you want to enable OIDC for the service console, set the value to `oidc`. The OIDC configuration is inherited from your Kubernetes pack configuration, and the service console only supports OIDC when **Palette** is configured as the Identity Provider. Refer to [SAML and OIDC SSO](../../user-management/saml-sso/saml-sso.md) for details.                                                                         | `disabled`        |
   | `vm-migration-assistant-ui.console.ingress.enabled`                  | Choose whether to enable [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) access to the VM Migration Assistant service console. If enabled, the Ingress provides external connectivity to the service console. You can still access the service console through the cluster services list in Palette if `vm-migration-assistant-ui.console.service.type` is set to `LoadBalancer` or `NodePort`. | `false`           |
   | `vm-migration-assistant-ui.console.ingress.host`                     | Specify the domain name that the Ingress resource will use to expose the VM Migration Assistant service console.                                                                                                                                                                                                                                                                                                            |                   |
   | `vm-migration-assistant-ui.console.ingress.tls`                      | If providing your own TLS certificates, define the TLS configuration for the Ingress within this parameter. If you need to secure multiple domains or subdomains with different certificates, you can add multiple entries. Each array must contain the `secretName`, `hosts`, `crt`, and `key` parameters.                                                                                                                 |                   |
   | `vm-migration-assistant-ui.console.ingress.tls.secretName`           | The name for the Kubernetes Secret where the TLS certificate and key will be stored.                                                                                                                                                                                                                                                                                                                                        |                   |
   | `vm-migration-assistant-ui.console.ingress.tls.hosts`                | One or more hostnames that the certificate should secure.                                                                                                                                                                                                                                                                                                                                                                   |                   |
   | `vm-migration-assistant-ui.console.ingress.tls.crt`                  | The CA-issued TLS certificate.                                                                                                                                                                                                                                                                                                                                                                                              |                   |
   | `vm-migration-assistant-ui.console.ingress.tls.key`                  | The private key corresponding to the certificate.                                                                                                                                                                                                                                                                                                                                                                           |                   |
   | `vm-migration-assistant-ui.console.ingress.selfSignedIssuer.enabled` | When set to `true`, [cert-manager](https://cert-manager.io/docs/usage/ingress/) will automatically issue a self-signed TLS certificate based on the `ingress.tls.hosts` and `ingress.tls.secretName` values. This allows you to omit the manual certificate and key parameters being `ingress.tls.crt` and `ingress.tls.key` respectively.                                                                                  | `false`           |

7. Click on **Confirm & Create**.

8. In the following screen, click **Next**.

9. Click **Finish Configuration**.

10. From the **Main Menu**, choose **Clusters** and select your VMO cluster.

11. In the **Profile** tab, click **Add add-on profile (+)** and select the newly created profile. Click **Confirm**.

12. Click **Save** to deploy the VM Migration Assistant to your cluster.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to **Profiles** from the left **Main Menu**.

3. Locate the newly created profile in the list.

4. From the left **Main Menu**, click **Clusters** and select your cluster.

5. In the **Overview** tab, ensure that the cluster status and health is **Running** and **Healthy**.

6. In the **Overview** tab, the **Services** list displays the **vm-migration** service with a clickable port. Click the
   port to access the VM Migration Assistant service console. The port number is based on your service console
   configuration.

## Access the VM Migration Assistant Service Console

You can access the service console based on how you configured the VM Migration Assistant YAML manifest when
[creating the cluster profile](#create-the-profile).

The following examples are for each `console.service.type`:

- If you configured an `Ingress` with a `domain` of `vm-migration.mycompany.dev`, you can access the service console at
  `https://vm-migration.mycompany.dev`.

- If you configured a `NodePort` with a `nodePort` of `30443`, you can access the service console at
  `https://<NODE_IP>:30443`.

<!--prettier-ignore-->
- If you configured a `LoadBalancer` with a `loadBalancerPort` of `443`, you can access the service console at
  `https://<LOAD_BALANCER_IP>`, where the load balancer IP address is provided by your load balancer solution (such as
  <VersionedLink text="MetalLB" url="/integrations/packs/?pack=lb-metallb-helm" />).

## Next Steps

You can now use the VM Migration Assistant to migrate your VMs. Refer to the
[Create Source Providers](./create-source-providers.md) guide to start creating your source providers.
