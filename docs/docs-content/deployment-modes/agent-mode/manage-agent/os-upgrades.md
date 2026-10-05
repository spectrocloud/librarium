---
sidebar_label: "Configure OS Upgrades"
title: "Configure OS Upgrades"
description: "Instructions for performing OS upgrades on agent mode clusters."
hide_table_of_contents: false
sidebar_position: 110
tags: ["edge"]
---

:::info

This page covers OS upgrades for agent mode clusters, where you supply the host and own the operating system. For
clusters that Palette provisioned from a Palette-built VM image, for example on AWS, Azure, GCP, VMware, or MAAS, refer
to [OS Patching](../../../clusters/cluster-management/os-patching.md) instead. 

:::

Agent mode hosts install and manage their Operating System (OS) outside Palette. This approach brings great flexibility
in terms of architecture, but it has the drawback that Palette cannot upgrade, patch or manage the operating systems of
the hosts. This can lead to inconsistencies, missed updates, or operational risks.

This page demonstrates how to perform an OS upgrade by leveraging cluster profiles. You will learn how to create your
own Kubernetes manifest containing your custom OS upgrade script. Your cluster nodes will then be selected based on
configured node labels and upgraded in a single rolling pass. To run the upgrade again later, update the
`SpectroSystemTask` manifest and re-apply it.

## Prerequisites

- A Palette cluster deployed on one or multiple hosts with the Palette Agent installed. Refer to the
  [Install Agent Mode](../install-agent-host.md) guide for further details. The cluster should be listed as **Healthy**
  and with a **Running** status.
  - The host must have access to the internet and a connection to Palette.
- Access to a terminal with network access to your cluster.
- Kubectl installed locally. Refer to the Kubernetes [Install Tools](https://kubernetes.io/docs/tasks/tools/) guide for
  further details.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left main menu and select **Clusters**.

3. Select your cluster to access the cluster details page.

4. Download the **kubeconfig** file for your cluster. Open a terminal and navigate to the location of the file.

5. Set the `KUBECONFIG` environment variable to the file path of the **kubeconfig** file to enable you to connect to the
   cluster using [kubectl CLI](https://kubernetes.io/docs/reference/kubectl/). Refer to the
   [Access Cluster with CLI](../../../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli) section for
   further guidance.

   ```shell
   export KUBECONFIG=/path/to/your/kubeconfig
   ```

6. Execute the following commands to find the `spectro-task-XXX` namespace of your cluster and save it to the
   `SYSTEM_UPGRADE_NAMESPACE` variable. This namespace will be different between clusters.

   ```shell
   export SYSTEM_UPGRADE_NAMESPACE=$(kubectl get namespaces --no-headers --output custom-columns=":metadata.name" | grep '^spectro-task')
   echo $SYSTEM_UPGRADE_NAMESPACE
   ```

   The output will be similar to the following snippet.

   ```shell hideClipboard
   spectro-task-6851ddd04b1b188784c06291
   ```

7. Execute the following command in your terminal, replacing the placeholder with a node label of your choice. This
   variable allows you to customize which nodes should be updated. The command saves your label to the
   `SYSTEM_UPGRADE_NODE_LABEL` variable.

   ```shell
   export SYSTEM_UPGRADE_NODE_LABEL="REPLACE ME"
   ```

8. Apply the node label to all the nodes that you want updated. Execute the command by replacing the placeholder with
   the name of the node. Repeat this step for each node you want to upgrade.

   ```shell
   kubectl label node REPLACE-ME $SYSTEM_UPGRADE_NODE_LABEL=
   ```

   :::info

   Nodes are drained, upgraded, and rebooted one by one. Ensure that your cluster has enough resources to perform
   rolling upgrades in order to avoid outages.

   :::

9. Save your upgrade scripts to a file titled `upgrades.sh`. You can provide any instructions that you want to execute
   on system upgrade and reboot. The following example provides upgrade instructions for Ubuntu, but you can modify them
   to work according to your host operating system. The command creates the `upgrades.sh` file in your local directory.

   ```shell
   cat << 'EOF' > upgrades.sh
   #!/bin/sh
   export DEBIAN_FRONTEND=noninteractive
   apt-get --assume-yes update
   apt-get --option Dpkg::Options::="--force-confold" dist-upgrade --yes --allow-downgrades \
     --allow-remove-essential --allow-change-held-packages
   if [ -f /var/run/reboot-required ]; then
     systemd-run --unit=palette-os-upgrade-reboot --on-active=30s systemctl reboot
   fi
   EOF
   ```

10. Execute the following commands to create the `upgrades.yaml` file using your namespace, label, and upgrade script
    variables.

    ```shell
    cat << EOF > upgrades.yaml
    ---
    apiVersion: v1
    kind: Secret
    metadata:
        name: os-upgrade-script
        namespace: $SYSTEM_UPGRADE_NAMESPACE
    type: Opaque
    stringData:
        upgrade.sh: |
    $(sed 's/^/        /' upgrades.sh)
    ---
    apiVersion: cluster.spectrocloud.com/v1alpha1
    kind: SpectroSystemTask
    metadata:
        name: os-upgrade-plan
        namespace: $SYSTEM_UPGRADE_NAMESPACE
    spec:
        concurrency: 1
        nodeSelector:
            matchExpressions:
                - { key: $SYSTEM_UPGRADE_NODE_LABEL, operator: Exists }
        serviceAccountName: crony
        secrets:
            - name: os-upgrade-script
              path: /host/run/spectro-task/secrets/bionic
        tolerations:
            - key: node-role.kubernetes.io/master
              operator: Exists
              effect: NoSchedule
            - key: node-role.kubernetes.io/controlplane
              operator: Exists
              effect: NoSchedule
        drain:
            force: true
        version: bionic
        task:
            image: us-docker.pkg.dev/palette-images/third-party/ubuntu:22.04
            command: ["chroot", "/host"]
            args: ["sh", "/run/spectro-task/secrets/bionic/upgrade.sh"]
    EOF
    ```

    The command creates the `upgrades.yaml` file in your current directory. The YAML file defines the following
    Kubernetes resources.

    | **Resource**        | **Name**            | **Description**                                                                                                                                                                                             |
    | ------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `Secret`            | `os-upgrade-script` | Stores the `upgrade.sh` shell script, which defines the upgrade logic to be executed on target nodes. This script is mounted into the upgrade pod via a secret volume.                                      |
    | `SpectroSystemTask` | `os-upgrade-plan`   | Describes the upgrade. Palette reconciles the task, drains each labelled node in turn, runs the script against the host filesystem, and returns the node to service when the script completes successfully. |

11. Navigate back to [Palette](https://console.spectrocloud.com) in your browser. Select **Profiles** from the left main
    menu.

12. Select the cluster profile corresponding to your agent mode cluster.

13. Click on the version drop-down menu. Select the **Create new version** option. Fill in the **Version** input and
    click **Confirm** to create a new version of your cluster profile. The new profile version opens.

14. Click **Add manifest**. The manifest editor appears. Fill in the **Layer name** input field. Then, click **New
    Manifest**. Input a name for the manifest file. Click on the check or press Enter to open the editor.

15. Paste the contents of the `upgrades.yaml` file that you have created in **Step 10**. Click **Confirm Updates** to
    save your manifest. Then, click **Save Changes** to save your manifest to the cluster profile.

16. Navigate to the left main menu and select **Clusters**.

17. Select your cluster to access the cluster details page.

18. Click on the **Profiles** tab.

19. Select the newly created version of your cluster profile. Click **Save**.

Palette applies your manifest to the cluster. The Kubernetes resources responsible for the system upgrade are created in
the `spectro-task-xxx` namespace.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left main menu and select **Clusters**.

3. Select your cluster to access the cluster details page.

4. Download the **kubeconfig** file for your cluster. Open a terminal and navigate to the location of the file.

5. Set the `KUBECONFIG` environment variable to the file path of the **kubeconfig** file to enable you to connect to it
   using [kubectl CLI](https://kubernetes.io/docs/reference/kubectl/). Refer to the
   [Access Cluster with CLI](../../../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli) section for
   further guidance.

   ```shell
   export KUBECONFIG=/path/to/your/kubeconfig
   ```

6. Execute the following commands to find the `spectro-task-XXX` namespace of your cluster and save it to the
   `SYSTEM_UPGRADE_NAMESPACE` variable. This namespace will be different between clusters.

   ```shell
   export SYSTEM_UPGRADE_NAMESPACE=$(kubectl get namespaces --no-headers --output custom-columns=":metadata.name" | grep '^spectro-task')
   echo $SYSTEM_UPGRADE_NAMESPACE
   ```

   The output will be similar to the following snippet.

   ```shell hideClipboard
   spectro-task-6851ddd04b1b188784c06291
   ```

7. Issue the following command to retrieve the secret and the `SpectroSystemTask` under the `spectro-task-xxxxx`
   namespace.

   ```bash
   kubectl get secret,spectrosystemtask --namespace $SYSTEM_UPGRADE_NAMESPACE
   ```

   Confirm the secret `secret/os-upgrade-script` and the task
   `spectrosystemtask.cluster.spectrocloud.com/os-upgrade-plan` were created successfully.

   ```text title="Example Output"
   NAME                           TYPE     DATA   AGE
   secret/cert-renewal-script     Opaque   1      41m
   secret/ntp-update-config       Opaque   1      42m
   secret/ntp-update-script       Opaque   1      42m
   secret/os-upgrade-script       Opaque   1      10m
   secret/sshkeys-update-script   Opaque   1      41m
   secret/stylus-upgrade          Opaque   1      41m

   NAME                                                              AGE
   spectrosystemtask.cluster.spectrocloud.com/os-upgrade-plan        10m
   ```
