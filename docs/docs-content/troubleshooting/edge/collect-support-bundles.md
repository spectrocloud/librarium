---
sidebar_label: "Collect Support Bundles"
title: "Collect Support Bundles for Edge Cluster Troubleshooting"
description: "Learn how to deploy a Private Cloud Gateway (PCG) to an existing Kubernetes cluster."
hide_table_of_contents: false
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 3
tags: ["edge", "troubleshooting", "support"]
---

When deploying or operating Edge clusters, you may encounter issues that require assistance from the Spectro Cloud
support team, such as Edge hosts failing to register, pod failures, or provisioning errors. To help our team
troubleshoot these issues more effectively, follow this guide to collect support bundles and attach them to your support
ticket.

## Limitations

- This guide applies only to connected installation mode, not airgap environments, since it requires internet access to
  run the troubleshooting script.

## Prerequisites

- You have connected to the host you need to troubleshoot, using SSH, direct terminal access, or another connection
  method.
- The following tools are available on the host:
  - `journalctl`
  - `systemctl`
  - (Optional) `kubectl` (required for the full output of `support-bundle-infra.sh`)
- (Optional) A valid `kubeconfig` file is configured (required for the full output of `support-bundle-infra.sh`)

## Run the Troubleshooting Scripts

### Run the Script to Collect Cluster Logs

The `support-bundle-infra.sh` script collects cluster-level diagnostics. Follow the steps below on a host with a valid
`kubeconfig` and `kubectl` installed, typically a control plane node.

1. Set the path to your `kubeconfig` file.

   ```bash
   export KUBECONFIG=/etc/kubernetes/admin.conf
   ```

2. Run the `support-bundle-infra.sh` script.

   ```bash
   curl --silent --show-error --location https://software.spectrocloud.com/scripts/support-bundle-infra.sh | bash
   ```

   If the script runs successfully, it creates a file in your home directory. The file name follows the pattern
   `<cluster name>-<YYYY-MM-DD>_<HH_MM_SS>.tar.gz`. If the script is unable to determine the cluster name, it defaults
   to `spectro-cluster`. One of the messages the terminal displays contains the name of the created file.

   ```bash
   Logs are archived in spectro-cluster-2025-05-13_16_50_50.tar.gz
   ```

3. Copy the file to your local computer. The command below serves as an example of how to copy the file
   `spectro-cluster-2025-05-13_16_50_50.tar.gz` from the `kairos@10.10.150.150` host to your `Downloads` folder. Run the
   command on the machine to which you want to copy the file.

   ```bash
   scp kairos@10.10.150.150:~/spectro-cluster-2025-05-13_16_50_50.tar.gz ~/Downloads/
   ```

### Run the Script to Collect Edge Host Logs

The `support-bundle-edge.sh` script collects host-level diagnostics from an Edge node and, if available, includes
Kubernetes data accessible locally on that host. Follow the steps below on every Edge host you want to troubleshoot.

1. (Optional) Set the path to your `kubeconfig` file.

   ```bash
   export KUBECONFIG=/etc/kubernetes/admin.conf
   ```

   If you do not perform this step, the script defaults to using `/run/kubeconfig` if it exists.

2. Run the `support-bundle-edge.sh` script as a user with sudo privileges.

   ```bash
   curl --silent --show-error --location https://software.spectrocloud.com/scripts/support-bundle-edge.sh | sudo bash
   ```

   The table below contains the optional flags you can use when running the script.

   | **Full Flag Name**           | **Short Flag Name** | **Description**                                                                                  | **Example**                         |
   | ---------------------------- | ------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------- |
   | `--start-days-ago`           | `-s`                | Number of days before now to begin collecting journald logs from.                                | `-s 7`                              |
   | `--end-days-ago`             | `-e`                | Number of days before now to stop collecting journald logs. The value must be smaller than `-s`. | `-e 5`                              |
   | `--start-date`               | `-S`                | Start date for journald log collection.                                                          | `-S 2024-01-01`                     |
   | `--end-date`                 | `-E`                | End date for journald log collection. Must be later than `-S`.                                   | `-E 2024-01-06`                     |
   | `--namespaces`               | `-n`                | Additional namespaces to collect logs from.                                                      | `-n hello-universe,hello-world`     |
   | `--resources-namespaced`     | `-r`                | Additional namespace-scoped resources to collect.                                                | `-r certificates.cert-manager.io`   |
   | `--resources-cluster-scoped` | `-R`                | Additional cluster-scoped resources to collect.                                                  | `-R clusterissuers.cert-manager.io` |
   | `--journald-services`        | `-j`                | Additional journald services to include in logs.                                                 | `-j cloud-init,systemd-resolved`    |

   If the script runs successfully, it creates a file in the `/opt/spectrocloud/logs` directory. The file name follows
   the pattern `<hostname>-<YYYY-MM-DD>_<HH_MM_SS>.tar.gz`. One of the messages the terminal displays contains the
   created file's name and its path.

   ```bash
   Logs are archived in /opt/spectrocloud/logs/edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz
   ```

   :::info

   The script collects only Helm release secrets from Spectro Cloud namespaces and excludes other Kubernetes secrets to
   protect sensitive data.

   :::

3. Copy the file to your local computer. The command below serves as an example of how to copy the file
   `edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz` from the `kairos@10.10.150.150` host to your
   `Downloads` folder. Run the command on the machine to which you want to copy the file.

   ```bash
   scp kairos@10.10.150.150:/opt/spectrocloud/logs/edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz ~/Downloads/
   ```

## Validate

Review the files you copied to the `Downloads` folder. The scripts archive the collected logs into compressed tarballs
TAR.GAR.

Extract the file named in the format `<cluster name>-<YYYY-MM-DD>_<HH_MM_SS>.tar.gz` and verify it contains the `k8s`
folder with the following subfolders:

- `cluster-info`
- `cluster-resources`
- `metrics`
- `previous-pod-logs`

Extract the file named in the format `<hostname>-<YYYY-MM-DD>_<HH_MM_SS>.tar.gz` and ensure it contains the following:

- `console.log` file
- `helm` folder
- `journald` folder
- `networking` folder
- `oem` folder
- `run` folder
- `systeminfo` folder
- `usr` folder
- `var` folder

## Next Steps

After you have successfully collected support bundles, attach the TAR.GAR archives to the support ticket.
