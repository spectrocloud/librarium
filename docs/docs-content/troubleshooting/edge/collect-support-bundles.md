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

- Only the `support-bundle-edge.sh` script is embedded and can run on hosts without an internet connection. The
  `support-bundle-infra.sh` script is not embedded and requires internet access.
- The embedded `support-bundle-edge.sh` script is included with the version of Palette agent that was in use at the time of
  provisioning. It is updated only when Palette agent is upgraded through an ISO or a Palette update. To ensure you are using
  the most current version, download and run the script manually.

## Prerequisites

<Tabs groupId="method">

<TabItem value="Downloaded Scripts">

- The host you need to troubleshoot has an active internet connection to access the troubleshooting script.
- You are connected to the host using SSH, [remote shell](../../clusters/edge/cluster-management/remote-shell.md),
  direct terminal access, or another connection method.
- The following tools are available on the host:
  - `journalctl`
  - `systemctl`
- (Optional) The host has a valid `kubeconfig` file configured and `kubectl` installed (required for the full output of
  `support-bundle-infra.sh`).

</TabItem>

<TabItem value="Embedded Script">
  
- You are connected to the host using SSH, [remote shell](../../clusters/edge/cluster-management/remote-shell.md), direct terminal access, or another connection method.
- The following tools are available on the host:
  - `journalctl`
  - `systemctl`

</TabItem>

</Tabs>

## Run the Troubleshooting Scripts

<Tabs groupId="method">

<TabItem value="Downloaded Scripts">

### Run the Script to Collect Cluster Logs

The `support-bundle-infra.sh` script collects cluster-level diagnostics. Follow the steps below on a host with a valid
`kubeconfig` and `kubectl` installed, typically a control plane node.

1. Set the path to your `kubeconfig` file.

   ```bash
   export KUBECONFIG=/etc/kubernetes/admin.conf
   ```

2. Download and run the `support-bundle-infra.sh` script.

   ```bash
   curl --remote-name https://software.spectrocloud.com/scripts/support-bundle-infra.sh
   bash support-bundle-infra.sh
   ```

   The table below contains the optional flags you can use when running the script.

   | **Longhand Flag**            | **Shorthand Flag** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                      | **Example**                         |
   | ---------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
   | `--directory`                | `-d`               | Custom output directory for temporary files and the final archive.                                                                                                                                                                                                                                                                                                                                                                                                   | `-d /var/tmp`                       |
   | `--namespaces`               | `-n`               | Additional namespaces to collect logs from. By default, the script collects the logs from the following namespaces: `capa-system`, `capi-kubeadm-bootstrap-system`, `capi-kubeadm-control-plane-system`, `capi-system`, `capi-webhook-system`, `cert-manager`, `default`, `harbor`, `kube-system`, `kube-public`, `longhorn-system`, `os-patch`, `palette-system`, `reach-system`, `spectro-system`, and `system-upgrade`.                                           | `-n hello-universe,hello-world`     |
   | `--resources-namespaced`     | `-r`               | Additional namespace-scoped resources to collect. By default, the script collects the following namespace-scoped resources: `apiservices`, `configmaps`, `cronjobs`, `daemonsets`, `deployments`, `endpoints`, `endpointslices`, `events`, `hpa`, `ingress`, `jobs`, `leases`, `limitranges`, `networkpolicies`, `poddisruptionbudgets`, `pods`, `pvc`, `replicasets`, `resourcequotas`, `roles`, `rolebindings`, `services`, `serviceaccounts`, and `statefulsets`. | `-r certificates.cert-manager.io`   |
   | `--resources-cluster-scoped` | `-R`               | Additional cluster-scoped resources to collect. By default, the script collects the following cluster-scoped resources: `apiservices`, `clusterroles`, `clusterrolebindings`, `crds`, `csr`, `mutatingwebhookconfigurations`, `namespaces`, `nodes`, `priorityclasses`, `pv`, `storageclasses`, `validatingwebhookconfigurations`, and `volumeattachments`.                                                                                                          | `-R clusterissuers.cert-manager.io` |

   :::info

   The default values for flags may change. Refer to the scripts for the most accurate information. For example, you can
   display the script content in the terminal with the following command.

   ```bash
   cat support-bundle-infra.sh
   ```

   :::

   If the script runs successfully, it creates a file in the directory specified by the `-d` flag. If you do not specify
   `-d`, the script saves the file in your home directory by default. The file name follows the pattern
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

1.  (Optional) Set the path to your `kubeconfig` file.

    ```bash
    export KUBECONFIG=/etc/kubernetes/admin.conf
    ```

    If you do not perform this step, the script defaults to using `/run/kubeconfig` if it exists.

2.  Download the `support-bundle-edge.sh` script and run it as a user with root privileges.

    ```bash
    curl --remote-name https://software.spectrocloud.com/scripts/support-bundle-edge.sh
    sudo bash support-bundle-edge.sh
    ```

    The table below contains the optional flags you can use when running the script.

    | **Longhand Flags**           | **Shorthand Flags** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                | **Example**                         |
    | ---------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
    | `--directory`                | `-d`                | Custom output directory for temporary files and the final archive.                                                                                                                                                                                                                                                                                                                                                                                                             | `-d /var/tmp`                       |
    | `--start-days-ago`           | `-s`                | Number of days in the past to start collecting journald logs from.                                                                                                                                                                                                                                                                                                                                                                                                             | `-s 7`                              |
    | `--end-days-ago`             | `-e`                | Number of days before now to stop collecting journald logs. The value must be smaller than `-s`.                                                                                                                                                                                                                                                                                                                                                                               | `-e 5`                              |
    | `--start-date`               | `-S`                | Start date for journald log collection.                                                                                                                                                                                                                                                                                                                                                                                                                                        | `-S 2024-01-01`                     |
    | `--end-date`                 | `-E`                | End date for journald log collection. Must be later than `-S`.                                                                                                                                                                                                                                                                                                                                                                                                                 | `-E 2024-01-06`                     |
    | `--lines`                    | `-l`                | Number of log lines to collect from journald logs.                                                                                                                                                                                                                                                                                                                                                                                                                             | `-l 500000`                         |
    | `--namespaces`               | `-n`                | Additional namespaces to collect logs from. By default, the script collects the logs from the following namespaces: `capi-webhook-system`, `cert-manager`, `harbor`, `kube-system`, `kube-public`, `longhorn-system`, `os-patch`, `palette-system`, `reach-system`, `spectro-system`, and `system-upgrade`.                                                                                                                                                                    | `-n hello-universe,hello-world`     |
    | `--resources-namespaced`     | `-r`                | Additional namespace-scoped resources to collect. By default, the script collects the following namespace-scoped resources: `apiservices`, `configmaps`, `cronjobs`, `daemonsets`, `deployments`, `endpoints`, `endpointslices`, `events`, `hpa`, `ingress`, `jobs`, `leases`, `limitranges`, `networkpolicies`, `poddisruptionbudgets`, `pods`, `pvc`, `replicasets`, `resourcequotas`, `roles`, `rolebindings`, `services`, `serviceaccounts`, and `statefulsets`.           | `-r certificates.cert-manager.io`   |
    | `--resources-cluster-scoped` | `-R`                | Additional cluster-scoped resources to collect. By default, the script collects the following cluster-scoped resources: `apiservices`, `clusterroles`, `clusterrolebindings`, `crds`, `csr`, `mutatingwebhookconfigurations`, `namespaces`, `nodes`, `priorityclasses`, `pv`, `storageclasses`, `validatingwebhookconfigurations`, and `volumeattachments`.                                                                                                                    | `-R clusterissuers.cert-manager.io` |
    | `--journald-services`        | `-j`                | By default, the script includes the following journald services: `stylus-agent`, `stylus-operator`, `palette-tui`, `spectro-stylus-agent`, `spectro-stylus-operator`, `spectro-init`, `spectro-palette-agent-start`, `spectro-palette-agent-initramfs`, `spectro-palette-agent-boot`, `spectro-palette-agent-network`, `spectro-palette-agent-bootstrap`, `systemd-timesyncd`, `containerd`, `kubelet`, `k3s`, `k3s-agent`, `rke2-server`, `rke2-agent`, and `cos-setup-boot`. | `-j cloud-init,systemd-resolved`    |

    :::info

    The default values for flags may change. Refer to the scripts for the most accurate information. For example, you
    can display the script content in the terminal with the following command.

    ```bash
    cat support-bundle-infra.sh
    ```

    :::

    If the script runs successfully, it creates a file in the directory specified by the `-d` flag. If you do not
    specify `-d`, the script saves the file in the system's temporary directory (typically `/tmp`). The file name
    follows the pattern `<hostname>-<YYYY-MM-DD>_<HH_MM_SS>.tar.gz`. One of the messages the terminal displays contains
    the created file's name and its path.

    ```bash
    Logs are archived in /tmp/tmp.qrKKeY1LqA/edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz
    ```

    :::info

    The script collects only Helm release secrets from Spectro Cloud namespaces and excludes other Kubernetes secrets to
    protect sensitive data.

    :::

3.  Copy the file to your local computer. The command below serves as an example of how to copy the file
    `edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz` from the `kairos@10.10.150.150` host to your
    `Downloads` folder. Run the command on the machine to which you want to copy the file.

    ```bash
    scp kairos@10.10.150.150:/tmp/tmp.qrKKeY1LqA/edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz ~/Downloads/
    ```

</TabItem>

<TabItem value="Embedded Script">

### Run the Script to Collect Edge Host Logs

The `support-bundle-edge.sh` script collects host-level diagnostics from an Edge node and, if available, includes
Kubernetes data accessible locally on that host. Follow the steps below on every Edge host you want to troubleshoot.

1. (Optional) Set the path to your `kubeconfig` file.

   ```bash
   export KUBECONFIG=/etc/kubernetes/admin.conf
   ```

   If you do not perform this step, the script defaults to using `/run/kubeconfig` if it exists.

2. Run the `support-bundle-edge.sh` script as a user with root privileges.

   ```bash
   sudo bash /opt/spectrocloud/scripts/support-bundle-edge.sh
   ```

   The table below contains the optional flags you can use when running the script.

   | **Longhand Flag**            | **Shorthand Flag** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | **Example**                         |
   | ---------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
   | `--directory`                | `-d`               | Custom output directory for temporary files and the final archive.                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `-d /var/tmp`                       |
   | `--start-days-ago`           | `-s`               | Number of days in the past to start collecting journald logs from.                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `-s 7`                              |
   | `--end-days-ago`             | `-e`               | Number of days before now to stop collecting journald logs. The value must be smaller than `-s`.                                                                                                                                                                                                                                                                                                                                                                                                                                | `-e 5`                              |
   | `--start-date`               | `-S`               | Start date for journald log collection.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `-S 2024-01-01`                     |
   | `--end-date`                 | `-E`               | End date for journald log collection. Must be later than `-S`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `-E 2024-01-06`                     |
   | `--lines`                    | `-l`               | Number of log lines to collect from journald logs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `-l 500000`                         |
   | `--namespaces`               | `-n`               | Additional namespaces to collect logs from. By default, the script collects the logs from the following namespaces: `capi-webhook-system`, `cert-manager`, `harbor`, `kube-system`, `kube-public`, `longhorn-system`, `os-patch`, `palette-system`, `reach-system`, `spectro-system`, and `system-upgrade`.                                                                                                                                                                                                                     | `-n hello-universe,hello-world`     |
   | `--resources-namespaced`     | `-r`               | Additional namespace-scoped resources to collect. By default, the script collects the following namespace-scoped resources: `apiservices`, `configmaps`, `cronjobs`, `daemonsets`, `deployments`, `endpoints`, `endpointslices`, `events`, `hpa`, `ingress`, `jobs`, `leases`, `limitranges`, `networkpolicies`, `poddisruptionbudgets`, `pods`, `pvc`, `replicasets`, `resourcequotas`, `roles`, `rolebindings`, `services`, `serviceaccounts`, and `statefulsets`.                                                            | `-r certificates.cert-manager.io`   |
   | `--resources-cluster-scoped` | `-R`               | Additional cluster-scoped resources to collect. By default, the script collects the following cluster-scoped resources: `apiservices`, `clusterroles`, `clusterrolebindings`, `crds`, `csr`, `mutatingwebhookconfigurations`, `namespaces`, `nodes`, `priorityclasses`, `pv`, `storageclasses`, `validatingwebhookconfigurations`, and `volumeattachments`.                                                                                                                                                                     | `-R clusterissuers.cert-manager.io` |
   | `--journald-services`        | `-j`               | Additional journald services to include in logs. By default, the script includes the following journald services: `stylus-agent`, `stylus-operator`, `palette-tui`, `spectro-stylus-agent`, `spectro-stylus-operator`, `spectro-init`, `spectro-palette-agent-start`, `spectro-palette-agent-initramfs`, `spectro-palette-agent-boot`, `spectro-palette-agent-network`, `spectro-palette-agent-bootstrap`, `systemd-timesyncd`, `containerd`, `kubelet`, `k3s`, `k3s-agent`, `rke2-server`, `rke2-agent`, and `cos-setup-boot`. | `-j cloud-init,systemd-resolved`    |

   :::info

   The default values for flags may change. Refer to the scripts for the most accurate information. For example, you can
   display the script content in the terminal with the following command.

   ```bash
   cat support-bundle-edge.sh
   ```

   :::

   If the script runs successfully, it creates a file in the directory specified by the `-d` flag. If you do not specify
   `-d`, the script saves the file in the system's temporary directory (typically `/tmp`). The file name follows the
   pattern `<hostname>-<YYYY-MM-DD>_<HH_MM_SS>.tar.gz`. One of the messages the terminal displays contains the created
   file's name and its path.

   ```bash
   Logs are archived in /tmp/tmp.qrKKeY1LqA/edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz
   ```

   :::info

   The script collects only Helm release secrets from Spectro Cloud namespaces and excludes other Kubernetes secrets to
   protect sensitive data.

   :::

3. Copy the file to your local computer. The command below serves as an example of how to copy the file
   `edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz` from the `kairos@10.10.150.150` host to your
   `Downloads` folder. Run the command on the machine to which you want to copy the file.

   ```bash
   scp kairos@10.10.150.150:/tmp/tmp.qrKKeY1LqA/edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz ~/Downloads/
   ```

</TabItem>

</Tabs>

## Validate

<Tabs groupId="method">

<TabItem value="Downloaded Scripts">

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

</TabItem>

<TabItem value="Embedded Script">

Review the files you copied to the `Downloads` folder. The scripts archive the collected logs into compressed tarballs
TAR.GAR.

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

</TabItem>

</Tabs>

## Next Steps

After you have successfully collected support bundles, attach the TAR.GAR archives to the support ticket.
