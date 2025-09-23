---
sidebar_label: "Upgrade Notes"
title: "Upgrade Notes"
description: "Learn how to upgrade self-hosted Palette instances."
icon: ""
sidebar_position: 0
tags: ["palette", "self-hosted", "airgap", "kubernetes", "upgrade"]
keywords: ["self-hosted", "enterprise", "airgap", "kubernetes"]
---

This page offers version-specific reference to help you prepare for upgrading self-hosted Palette instances.

## Palette 3.4

Prior versions of Palette installed internal Palette component ingress resources in the default namespace. The new
version of the Helm Chart ensures all Palette required ingress resources are installed in the correct namespace.
Self-hosted Palette instances deployed to Kubernetes and upgrading from Palette versions 3.3.X or older must complete
the following action.

1. Connect to the cluster using the cluster's kubeconfig file.

2. Identify all Ingress resources that belong to _Hubble_ - an internal Palette component.

   ```shell
   kubectl get ingress --namespace default
   ```

3. Remove each Ingress resource listed in the output that starts with the name Hubble. Use the following command to
   delete an Ingress resource. Replace `REPLACE_ME` with the name of the Ingress resource you are removing.

   ```shell
   kubectl delete ingress --namespace default <REPLACE_ME>
   ```

## Upgrade Palette 3.x to 4.0

Palette 4.0 includes the following major enhancements that require user intervention to facilitate the upgrade process.

- **Enhanced security for Palette microservices** - To enhance security, all microservices within Palette now use
  `insecure-skip-tls-verify` set to `false`. When upgrading to Palette 4.0, you must provide a valid SSL certificate in
  the system console.

  If you already have an SSL certificate, key, and Certificate Authority (CA) certificate, you can use them when
  upgrading to Palette 4.0.0. To learn how to upload SSL certificates to Palette, refer to
  [SSL Certificate Management](../system-management/ssl-certificate-management.md).

- **Self-hosted Palette Kubernetes Upgrade** - If you installed Palette using the Helm Chart method, the Kubernetes
  version used for Palette is upgraded from version 1.24 to 1.25. You will need to copy the new Kubernetes YAML to the
  Kubernetes layer in the Enterprise cluster profile. If you have customized your Kubernetes configuration, you will
  need to manually adjust custom values and include any additional configuration in the upgraded YAML that we provide.
  Refer to [Upgrade Enterprise Cluster Profile](#upgrade-enterprise-cluster-profile).

### Upgrade with VMware

:::warning

A known issue impacts all self-hosted Palette instances older then 4.4.14. Before upgrading a Palette instance with
version older than 4.4.14, ensure that you execute a utility script to make all your cluster IDs unique in your
Persistent Volume Claim (PVC) metadata. For more information, refer to the
[Troubleshooting Guide](../../troubleshooting/enterprise-install.md#scenario---non-unique-vsphere-cns-mapping).

:::

From the Palette system console, click the **Update version** button. Palette will be temporarily unavailable while
system services update.

![Screenshot of the "Update version" button in the system consoles.](/enterprise-version_sys-console-update-palette-version.webp)

### Upgrade Enterprise Cluster Profile

Follow the steps below to upgrade Kubernetes.

1. Log in to the Palette system console.

2. From the left **Main Menu**, click **Enterprise Cluster Migration**.

3. Click on the **Profiles** tab, and select the Kubernetes layer. The Kubernetes YAML is displayed in the editor at
   right.

4. If the existing Kubernetes YAML has been customized or includes additional configuration, we suggest you create a
   backup of it by copying it to another location.

5. Copy the Kubernetes YAML you received from our support team and paste it into the editor.

   ![Screenshot of the Kubernetes YAML editor.](/enterprise-version_upgrade_ec-cluster-profile.webp)

6. If you have made any additional configuration changes or additions, add your customizations to the new YAML.

7. Save your changes.

The Enterprise cluster initiates the Kubernetes upgrade process and leads to the reconciliation of all three nodes.
