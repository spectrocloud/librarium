---
sidebar_label: "Collect Support Bundles"
title: "Collect Support Bundles for Edge Cluster Troubleshooting"
description: "Collect support bundles for Edge cluster troubleshooting"
hide_table_of_contents: false
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 3
tags: ["edge", "troubleshooting", "support"]
---

When deploying or operating Edge clusters, you may encounter issues that require assistance from the Spectro Cloud
support team, such as Edge hosts failing to register, pod failures, or provisioning errors. To help our team
troubleshoot these issues more effectively, follow this guide to collect support bundles and attach them to your support
ticket. Use the `support-bundle-edge.sh` script that collects host-level diagnostics from an Edge node and, if
available, includes Kubernetes data accessible locally on that host.

## Limitations

- The embedded `support-bundle-edge.sh` script is included with the version of Palette agent that was in use at the time
  of provisioning. It is updated only when Palette agent is upgraded through an ISO or a Palette update. To ensure you
  are using the most current version, download and run the script manually.

## Prerequisites

- You are connected to the host you want to troubleshoot using SSH (Secure Shell),
  [remote shell](../../clusters/edge/cluster-management/remote-shell.md), direct terminal access, or another connection
  method.
- The following tools are available on the host:
  - `journalctl`
  - `systemctl`
- You have root privileges to run the `support-bundle-edge.sh` script.

## Run the Script to Collect Edge Host Logs

Follow the steps below on every Edge host you want to troubleshoot.

1.  (Optional) Set the path to your `kubeconfig` file.

    ```bash title="Template"
    export KUBECONFIG=<path-to-kubeconfig>
    ```

    ```bash hideClipboard title="Example"
    export KUBECONFIG=/etc/kubernetes/admin.conf
    ```

    If you do not perform this step, the script defaults to using `/run/kubeconfig` if it exists. If no valid
    `kubeconfig` is available, the script still runs but collects only host-level diagnostics.

2.  <Tabs groupId="method">

    <TabItem value="Downloaded Scripts">

    <!--prettier-ignore-start-->

    Download the `support-bundle-edge.sh` script and run it as a user with root privileges.

    ```bash
    curl --remote-name https://software.spectrocloud.com/scripts/support-bundle-edge.sh
    sudo bash support-bundle-edge.sh
    ```

    The host you need to troubleshoot must have an active internet connection to download the troubleshooting script. If
    internet access is not available, download the script on another machine and transfer it to the host.

    <!--prettier-ignore-end-->

    </TabItem>

    <TabItem value="Embedded Script">

    Run the `support-bundle-edge.sh` script as a user with root privileges.

    ```bash
    sudo bash /opt/spectrocloud/scripts/support-bundle-edge.sh
    ```

    </TabItem>

    </Tabs>

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

    The default values for flags may change. Refer to the script for the most accurate information. For example, you can
    display the script content in the terminal with the following command.

    ```bash
    cat support-bundle-infra.sh
    ```

    :::

    If the script runs successfully, it creates a file in the directory specified by the `--directory` flag. If you do
    not specify `--directory`, the script saves the file in the system's temporary directory (typically `/tmp`). The
    file name follows the pattern `<hostname>-<YYYY-MM-DD>_<HH_MM_SS>.tar.gz`. One of the messages the terminal displays
    contains the created file's name and its path.

    ```bash hideClipboard title="Example output"
    Logs are archived in /tmp/tmp.qrKKeY1LqA/edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz
    ```

    :::info

    The script collects only Helm release secrets from Spectro Cloud namespaces and excludes other Kubernetes secrets to
    protect sensitive data.

    :::

3.  Copy the file to your local computer. Run the command on the machine to which you want to copy the file.

    ```bash title="Template"
    scp <user>@<host-ip-address>:<path-to-file> <local-destination-directory>
    ```

    The command below serves as an example of how to copy the file
    `edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz` from the `kairos@10.10.150.150` host to your
    `Downloads` folder.

    ```bash hideClipboard title="Example"
    scp kairos@10.10.150.150:/tmp/tmp.qrKKeY1LqA/edge-e965384209c2d45078a29480e90bd275-2025-05-13_16_58_20.tar.gz ~/Downloads/
    ```

## Validate

Review the file you copied. The script archives the collected logs into compressed tarballs TAR.GAR.

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

After you have successfully collected the support bundle, attach the TAR.GAR archive to the support ticket.
