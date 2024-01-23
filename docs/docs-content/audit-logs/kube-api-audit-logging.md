---
sidebar_label: "Enable Audit Logging"
title: "Enable API Audit Logging"
description: "Learn how to configure the kube-apiserver audit logging feature for Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
---

Kubernetes auditing is a feature of the Kubernetes cluster management system that allows administrators to track and log
events within the cluster. Administrators can review actions taken by users and applications and changes to the
cluster's configuration or state. By enabling auditing, organizations and system administrators can better understand
their users' actions and behaviors. The audit log answers common questions about what, where, when, and who.

You can also meet internal security control requirements by enabling audit logging. Many security controls require the
following capabilities.

- ensuring administrators can trace the actions of individual users back to a specific person.

- to debug an issue where an unknown application is modifying resources

The guidance on this page is based on the upstream Kubernetes documentation and `kube-apiserver` source code. Follow the
steps below to enable audit logging for the Kubernetes API server.

<br />

:::warning

Enabling audit logging causes the API server to consume more memory, as it needs to store additional context for each
request to facilitate auditing. Memory consumption depends on the audit logging configuration.

:::

## Prerequisites

- Access to a Kubernetes cluster node.

- Write access to the file system.

- Remote access to the Kubernetes cluster control plane nodes.

## Enable Auditing

The Kubernetes API Audit policies define the rules for capturing events and specifying the level of detail to include.
The audit policy you create will capture all requests at the _metadata_ level. To learn more about the various audit
levels, visit the Kubernetes API
[Audit Policy](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/#audit-policy) documentation.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Identify one of your cluster contro-plane nodes. You can find a cluster node by navigating to the left **Main Menu**
   and selecting **Clusters**. Click on your cluster to access the details pages and click on the **Nodes** tab. The tab
   contains information about each pool, select a node from the **Control Plane Pool** to view its IP address.

3. SSH into one of your control-plane nodes using its IP address and the SSH key you specified during the cluster
   creation process.

4. From a control-plane node in the target cluster, issue the following command to create your audit policy file.

<br />

```bash
cat << EOF > /etc/kubernetes/audit-policy.yaml
  apiVersion: audit.k8s.io/v1
  kind: Policy
  rules:
  - level: Metadata
EOF
```

The audit log output will be written to a file located at **/var/log/kubernetes/audit/audit.log**. In production
environments, you should ensure this log file is ingested by a logging and monitoring application.

The **/var/log/kubernetes/audit/** directory should be backed by persistent storage to ensure that any unshipped audit
logs will not be lost during an unexpected outage of the node.

<br />

5. Next, you will update the Kubernetes API server manifest file. The manifest file is located in the
   **/etc/kubernetes/manifests** folder. Before you modify the manifest file, create a backup copy.

<br />

```shell
cp /etc/kubernetes/manifests/kube-apiserver.yaml  /etc/kubernetes/manifests/kube-apiserver.backup
```

6. Now that you have a backup copy of the manifest file go ahead and open up the file
   **/etc/kubernetes/manifests/kube-apiserver.yaml** in a text editor such as Vi or Nano.

<br />

```shell
vi /etc/kubernetes/manifests/kube-apiserver.yaml
```

Append the following YAML configuration to your kube-apiserver manifest.

<br />

```yaml
volumeMounts:
  - mountPath: /etc/kubernetes/audit-policy.yaml
    name: audit
    readOnly: true
  - mountPath: /var/log/kubernetes/audit/
    name: audit-log
    readOnly: false
volumes:
  - name: audit
    hostPath:
      path: /etc/kubernetes/audit-policy.yaml
      type: File
  - name: audit-log
    hostPath:
      path: /var/log/kubernetes/audit/
      type: DirectoryOrCreate
```

7. The next step is to update the Kubernetes API parameters with audit settings. The top of the file contains the
   Kubernetes API parameters. Refer to the code snippet below to determine where to place these parameters.

<br />

```yaml
spec:
  containers:
    - command:
        - kube-apiserver
        - --advertise-address=172.18.0.2
        - --allow-privileged=true
        - --authorization-mode=Node,RBAC
```

8. Go ahead and add the following audit parameters under the `- kube-apiserver` line.

<br />

```shell
    - --audit-policy-file=/etc/kubernetes/audit-policy.yaml
    - --audit-log-path=/var/log/kubernetes/audit/audit.log
    - --audit-log-batch-max-size=5
    - --audit-log-compress
    - --audit-log-format=json
    - --audit-log-maxage=30
    - --audit-log-maxbackup=100
    - --audit-log-maxsize=50
    - --audit-log-mode=batch
    - --audit-log-truncate-enabled
    - --audit-log-truncate-max-batch-size=10485760
    - --audit-log-truncate-max-event-size=102400
    - --audit-log-version=audit.k8s.io/v1
```

9. Save your changes and exit the file. When you exit the file, the changes will automatically get picked up by the
   Kubelet process and applied.

You can also add the following Kubernetes API parameters to fine-tune the audit logging.

| Parameter                           | Type     | Description                                                                                                                     |
| ----------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `--audit-log-batch-max-wait`        | duration | The amount of time to wait before force writing the batch that hadn't reached the max size. Only used in batch mode. Ex: `"5s"` |
| `--audit-log-batch-throttle-enable` | boolean  | Whether batching throttling is enabled. Only used in batch mode.                                                                |
| `--audit-log-batch-throttle-qps`    | float    | The maximum average number of batches per second. Only used in batch mode                                                       |

To learn more about each of the Kubernetes API server flags, visit the Kubernetes API parameter
[documentation page](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/).

## Validate

You can validate that audit logs are captured by navigating to the specified audit folder in the `--audit-log-path`
parameter.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Identify one of your cluster contro-plane nodes. You find a cluster node by navigating to the left **Main Menu** and
   selecting **Clusters**. Click on your cluster to access the details pages and click on the **Nodes** tab. The tab
   contains information about each pool, select a node from the **Control Plane Pool** to view its IP address.

3. SSH into one of your control-plane nodes using its IP address and the SSH key you specified during the cluster
   creation process.

4. From a control-plane node in the target cluster, you can validate that audit logs are captured by reviewing the audit
   log file in the specified audit folder you specified in the `--audit-log-path` parameter.

5. Display the audit file content by using the following command. Replace the file path with the audit folder you
   specified in the `--audit-log-path` parameter.

<br />

```shell
cat /var/log/kubernetes/audit/audit.log
```

Example Output.

```shell hideClipboard
{"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"Metadata","auditID":"3cb20ec3-e944-4059-873c-078342b38fec","stage":"ResponseComplete","requestURI":"/apis/coordination.k8s.io/v1/namespaces/cluster-63a1ee9100663777ef2f75c8/leases/kubeadm-bootstrap-manager-leader-election-capi","verb":"update","user":{"username":"system:serviceaccount:cluster-63a1ee9100663777ef2f75c8:palette-manager","uid":"e728f219-d5e8-4a44-92c4-5ddcf22ce476","groups":["system:serviceaccounts","system:serviceaccounts:cluster-63a1ee9100663777ef2f75c8","system:authenticated"],"extra":{"authentication.kubernetes.io/pod-name":["capi-kubeadm-bootstrap-controller-manager-688596bc4b-pxmmh"],"authentication.kubernetes.io/pod-uid":["a0e9a0fd-0812-434e-a1a4-b8af9bb98a87"]}},"sourceIPs":["192.168.161.18"],"userAgent":"manager/v0.0.0 (linux/amd64) kubernetes/$Format/leader-election","objectRef":{"resource":"leases","namespace":"cluster-63a1ee9100663777ef2f75c8","name":"kubeadm-bootstrap-manager-leader-election-capi","uid":"8e70db1f-a26c-4af5-a558-78e860ae9903","apiGroup":"coordination.k8s.io","apiVersion":"v1","resourceVersion":"13660827"},"responseStatus":{"metadata":{},"code":200},"requestReceivedTimestamp":"2023-01-18T20:35:29.755649Z","stageTimestamp":"2023-01-18T20:35:29.760586Z","annotations":{"authorization.k8s.io/decision":"allow","authorization.k8s.io/reason":"RBAC: allowed by ClusterRoleBinding "palette-manager-admin-rolebinding" of ClusterRole "cluster-admin" to ServiceAccount "palette-manager/cluster-63a1ee9100663777ef2f75c8""}}
```

## Resources

- [Kubernetes API parameters](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/)

- [Kubernetes Auditing Documentation](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/)

<br />
