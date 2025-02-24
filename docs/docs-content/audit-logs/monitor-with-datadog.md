---
sidebar_label: "Monitor Clusters with Datadog"
title: "Monitor Host Clusters with Datadog"
description: "Learn how to use Datadog to monitor Palette host clusters."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
hiddenFromNav: false
tags: ["audit-logs", "datadog", "monitoring"]
---

You can use [Datadog](https://www.datadoghq.com/), a monitoring and analytics tool, to visualize the audit logs of your
host clusters.

This guide will help you through the process of configuring your clusters deployed with Palette to export audit logs to
Datadog.

## Prerequisites

- A [Palette account](https://console.spectrocloud.com) with tenant admin access.

- A Datadog account. Visit the [Datadog official website](https://app.datadoghq.eu/signup) to create a Datadog account.

- An active [host cluster](../glossary-all.md#host-cluster). Refer to the
  [Deploy a Cluster](../clusters/public-cloud/deploy-k8s-cluster.md) tutorial for instructions on how to deploy a
  cluster.

- [Kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed and configured to access your host cluster. Refer
  to the [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) page for guidance on how to access
  your cluster with the kubectl CLI.

## Configure Host Cluster to Export Logs

1. Log in to Datadog and select **Kubernetes** from the left **Main Menu**.

2. Select **Helm Chart**. Datadog provides you with an API key. Copy and save the key.

   ![Datadog Agent Setup Page](/audit-logs_monitor-with-datadog_datadog-ui.webp)

3. Log in to [Palette](https://console.spectrocloud.com/).

4. From the left **Main Menu**, select **Tenant Settings**.

5. Click **Registries** and select **Add New Helm Registry** under **Helm Registries** to add the Datadog Helm
   repository.

6. Assign the registry a name, for example, `Datadog`, and include `https://helm.datadoghq.com` as the endpoint. Click
   **Confirm**. The synchronization may take a few minutes to complete.

   ![Palette Registry Setup Page](/audit-logs_monitor-with-datadog_registry.webp)

7. Once the synchronization is finished, click on **Profiles** from the left **Main Menu** and select **Add Cluster
   Profile** to create a Datadog add-on cluster profile.

8. Give the profile a name, select the type **Add-on**, and click **Next**.

9. Click on **Add Helm chart**, choose **Public packs**, and select the **Datadog** registry.

10. Next, select the latest version of the `datadog` chart.

    ![Datadog Helm Chart Pack](/audit-logs_monitor-with-datadog_datadog-pack.webp)

11. Click **Values** under **Pack Details** to configure the Datadog Helm chart. Modify the parameters according to the
    following table.

    | **Parameter**                                | **Modification**                                                                                                                                                                                                  |
    | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **pack.namespace**                           | Provide a namespace for the Datadog installation, for example, `datadog`.                                                                                                                                         |
    | **datadog.apiKey**                           | Insert your Datadog API key.                                                                                                                                                                                      |
    | **datadog.site**                             | Insert your regional Datadog website, for example, `us5.datadoghq.com`. Refer to the [Getting Started with Datadog Sites](https://docs.datadoghq.com/getting_started/site/) page for a complete list of websites. |
    | **datadog.logs.enabled**                     | Set it to `true` to enable the Datadog Agent log collection.                                                                                                                                                      |
    | **datadog.logs.containerCollectAll**         | Set it to `true` to allow log collection for all containers.                                                                                                                                                      |
    | **datadog.processAgent.processCollection**   | Set it to `true` to enable process collection.                                                                                                                                                                    |
    | **datadog.networkMonitoring.enabled**        | Set it to `true` to enable network performance monitoring.                                                                                                                                                        |
    | **datadog.serviceMonitoring.enabled**        | Set it to `true` to enable universal service monitoring.                                                                                                                                                          |
    | **datadog.securityAgent.compliance.enabled** | Set it to `true` to enable the security agent.                                                                                                                                                                    |

12. Next, paste the following snippet under the `clusterAgent.volumes` section to enable the volume and volume mount for
    collecting audit logs. Replace `/var/log/apiserver` with the `audit-log` path configured in the Kubernetes layer of
    your host cluster. You can find this path in the Kubernetes layer of your host cluster profile in Palette.

    ```yaml {3,13}
    volumes:
      - hostPath:
          path: /var/log/apiserver
        name: auditdir
      - name: dd-agent-config
        configMap:
          name: dd-agent-config
          items:
            - key: kubernetes-audit-log
              path: conf.yaml
    volumeMounts:
      - name: auditdir
        mountPath: /var/log/apiserver
      - name: dd-agent-config
        mountPath: /conf.d/kubernetes_audit.d
    ```

13. Additionally, if your host cluster uses Kubernetes version 1.25 or later, add the following lines under the
    `pack.namespace` section to accommodate the elevated privileges required by the Datadog pods. Replace
    `<k8s_version>` with your cluster's Kubernetes version and only include the major and minor version following the
    lowercase letter **v**. For example, `v1.30`. Refer to the
    [Deployment Violates Pod Security](../troubleshooting/cluster-deployment.md#deployment-violates-pod-security)
    troubleshooting guide for more information.

    ```yaml {3-4}
    pack:
      namespace: "datadog"
      namespaceLabels:
        "datadog": "pod-security.kubernetes.io/enforce=privileged,pod-security.kubernetes.io/enforce-version=v<k8s_version>"
    ```

14. Once you finish making the necessary changes, click **Confirm & Create**, then select **Next**.

15. Review the cluster profile and click **Finish Configuration**.

16. In Palette, attach the Datadog add-on cluster profile to your host cluster. Refer to the
    [Attach an Add-on Profile](../clusters/imported-clusters/attach-add-on-profile.md) guide for instructions.

17. Open a terminal window and use the `cat` command to create a ConfigMap resource for the host cluster to collect
    data.

    ```yaml
    cat << EOF > datadog-configmap.yaml
    kind: ConfigMap
    apiVersion: v1
    metadata:
      name: dd-agent-config
      namespace: datadog
    data:
      kubernetes-audit-log: |-
        logs:
          - type: file
            path: /var/log/apiserver/audit.log
            source: kubernetes.audit
            service: audit
    EOF
    ```

18. Issue the following command to apply the ConfigMap to your host cluster.

    ```bash
    kubectl apply --namespace datadog --filename datadog-configmap.yaml
    ```

    ```text hideClipboard
    configmap/dd-agent-config created
    ```

19. After a few minutes, the Datadog agent will start reporting. Log in to Datadog and select **Kubernetes** from the
    left **Main Menu** to verify that the audit logs are being transferred successfully to Datadog.

    ![Datadog Agent Reporting](/audit-logs_monitor-with-datadog_datadog-agent.webp)

## Validate

1. Log in to Datadog.

2. Click on **Logs** in the left **Main Menu**, select **Explorer**, and verify that your host cluster audit logs are
   visible.

   ![Datadog UI Displaying the Logs](/audit-logs_monitor-with-datadog_datadog-logs.webp)

## Resources

- [Cluster Monitoring](../clusters/cluster-management/monitoring/monitoring.md)

- [Audit Logs](./audit-logs.md)

- [Monitoring Kubernetes with Datadog](https://www.datadoghq.com/blog/monitoring-kubernetes-with-datadog/)
