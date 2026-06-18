---
sidebar_label: "Collect Support Bundles"
title: "Collect Support Bundles for Cluster Troubleshooting"
description: "Collect support bundles for cluster troubleshooting"
hide_table_of_contents: false
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 3
tags: ["troubleshooting", "support"]
---

When deploying or operating clusters on cloud providers or bare metal environments, you may encounter issues that
require assistance from the Spectro Cloud support team, such as nodes failing to join, pod failures, or cluster
provisioning errors. To help our team troubleshoot these issues more effectively, follow this guide to collect support
bundles and attach them to your support ticket. Use the `support-bundle-infra.sh` script that collects cluster-level
diagnostics.

## Prerequisites

- You have access to the node you want to troubleshoot using Secure Shell (SSH), direct console access, or another
  access method supported by your infrastructure provider.
- The node has a valid `kubeconfig` file configured and `kubectl` installed. This is typically a control plane node.

### Run the Script to Collect Cluster Logs

1. Set the path to your `kubeconfig` file.

   ```bash title="Template"
    export KUBECONFIG=<path-to-kubeconfig>
   ```

   ```bash hideClipboard title="Example"
   export KUBECONFIG=/etc/kubernetes/admin.conf
   ```

2. Download and run the `support-bundle-infra.sh` script.

   ```bash
   curl --remote-name https://software.spectrocloud.com/scripts/support-bundle-infra.sh
   bash support-bundle-infra.sh
   ```

   The node you need to troubleshoot must have an active internet connection to download the troubleshooting script. If
   internet access is not available, download the script on another machine and transfer it to the node.

   The table below contains the optional flags you can use when running the script.

   | **Longhand Flag**            | **Shorthand Flag** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                      | **Example**                         |
   | ---------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
   | `--directory`                | `-d`               | Custom output directory for temporary files and the final archive.                                                                                                                                                                                                                                                                                                                                                                                                   | `-d /var/tmp`                       |
   | `--namespaces`               | `-n`               | Additional namespaces to collect logs from. By default, the script collects the logs from the following namespaces: `capa-system`, `capi-kubeadm-bootstrap-system`, `capi-kubeadm-control-plane-system`, `capi-system`, `capi-webhook-system`, `cert-manager`, `default`, `harbor`, `kube-system`, `kube-public`, `longhorn-system`, `os-patch`, `palette-system`, `reach-system`, `spectro-system`, and `system-upgrade`.                                           | `-n hello-universe,hello-world`     |
   | `--resources-namespaced`     | `-r`               | Additional namespace-scoped resources to collect. By default, the script collects the following namespace-scoped resources: `apiservices`, `configmaps`, `cronjobs`, `daemonsets`, `deployments`, `endpoints`, `endpointslices`, `events`, `hpa`, `ingress`, `jobs`, `leases`, `limitranges`, `networkpolicies`, `poddisruptionbudgets`, `pods`, `pvc`, `replicasets`, `resourcequotas`, `roles`, `rolebindings`, `services`, `serviceaccounts`, and `statefulsets`. | `-r certificates.cert-manager.io`   |
   | `--resources-cluster-scoped` | `-R`               | Additional cluster-scoped resources to collect. By default, the script collects the following cluster-scoped resources: `apiservices`, `clusterroles`, `clusterrolebindings`, `crds`, `csr`, `mutatingwebhookconfigurations`, `namespaces`, `nodes`, `priorityclasses`, `pv`, `storageclasses`, `validatingwebhookconfigurations`, and `volumeattachments`.                                                                                                          | `-R clusterissuers.cert-manager.io` |

   :::info

   The default values for flags may change. Refer to the script for the most accurate information. For example, you can
   display the script content in the terminal with the following command.

   ```bash
   cat support-bundle-infra.sh
   ```

   :::

   If the script runs successfully, it creates a file in the directory specified by the `--directory` flag. If you do
   not specify `--directory`, the script saves the file in the current working directory by default. The file name
   follows the pattern `<cluster-name>-<YYYY-MM-DD>_<HH_MM_SS>.tar.gz`. If the script is unable to determine the cluster
   name, it defaults to `spectro-cluster`. One of the messages the terminal displays contains the name of the created
   file.

   ```bash hideClipboard title="Example output"
   Logs are archived in spectro-cluster-2025-05-13_16_58_20.tar.gz
   ```

3. Copy the file to your local computer. Run the command on the machine to which you want to copy the file.

   ```bash title="Template"
   scp <user>@<node-ip-address>:<path-to-file> <local-destination-directory>
   ```

   The command below serves as an example of how to copy the file `spectro-cluster-2025-05-13_16_58_20.tar.gz` from the
   `ubuntu@10.10.150.150` node to your `Downloads` folder.

   ```bash hideClipboard title="Example"
   scp ubuntu@10.10.150.150:~/spectro-cluster-2025-05-13_16_58_20.tar.gz ~/Downloads/
   ```

## Validate

Review the file you copied. The script archives the collected logs into compressed tarballs TAR.GAR.

    Extract the file named in the format `<cluster-name>-<YYYY-MM-DD>_<HH_MM_SS>.tar.gz` and verify it contains the `k8s`
    folder with the following subfolders:

    - `cluster-info`
    - `cluster-resources`
    - `metrics`
    - `previous-pod-logs`

    ## Next Steps

    After you have successfully collected the support bundle, attach the TAR.GAR archive to the support ticket.