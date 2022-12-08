---
title: "Enable Kubenertes API Audit Logging"
metaTitle: "Enable Kubernete API Audit Logging"
metaDescription: "Learn how to configure the kube-apiserver audit logging feature for Palette."
icon: ""
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Enable Kubernetes API Audit Logging

Kubernetes auditing is a feature of the Kubernetes cluster management system that allows administrators to track and log events that occur within the cluster. This can include actions taken by users and applications and changes to the cluster's configuration or state. Organizations and system administrators can better understand their users' actions and behaviors by enabling auditing. The audit log answers common questions such as what, where, when, and who.

You can also meet internal security control requirements by enabling audit logging. Many security controls require the following capabilities to be met:
- ensuring the actions of individual users can be uniquely traced back to a specific user
- to debug an issue where an unknown application is modifying resources

The guidance on this page is based on the upstream Kubernetes documentation and `kube-apiserver` source code. Follow the steps below to enable audit logging for the Kubernetes API server.

<br />

<WarningBox>
Enabling audit logging increases the memory consumption of the API server because some context required for auditing is stored for each request. Memory consumption depends on the audit logging configuration.
</WarningBox>

# Prerequisites

- Access to a Kubernetes cluster node
- Write access to the file system


# Enable Auditing

The Kubernetes API Audit policies contain rules about what events are captured and the level of detail to include.
The audit policy you create will capture all requests at the *metadata* level. To learn more about the various audit levels, visit the Kubernetes API [Audit Policy](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/#audit-policy) documentation.

On a control-plane node in the target cluster, issue the following command to create your audit policy file.
<br />

```bash
cat << EOF > /etc/kubernetes/audit-policy.yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
EOF
```
The audit log output will be written to a file located at **/var/log/kubernetes/audit/audit.log**. In production environments, you should ensure this log file is ingested by a logging and monitoring application. 

The **/var/log/kubernetes/audit/** directory should be backed by persistent storage to ensure that any unshipped audit logs will not be lost during an unexpected outage of the node.

<br />

Next, you will update the Kubernetes API server manifest file. The manifest file is located in the **/etc/kubernetes/manifests** folder. 
Before modifying the manifest file, create a backup copy. 

```shell
cp /etc/kubernetes/manifests/kube-apiserver.yaml  /etc/kubernetes/manifests/kube-apiserver.backup 
```

Now that you have a backup copy of the manifest file go ahead and open up the file **/etc/kubernetes/manifests/kube-apiserver.yaml** in a text editor such as Vi or Nano.

```shell
vi /etc/kubernetes/manifests/kube-apiserver.yaml
```

Append the following YAML configuration to your kube-apiserver manifest.

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

The next step is to update the Kubernetes API parameters with audit settings. 
The Kubernetes API parameters are located toward the top of the file. The code snippet below showcases where in the file to place the parameters.

```yaml
spec:
  containers:
  - command:
    - kube-apiserver
    - --advertise-address=172.18.0.2
    - --allow-privileged=true
    - --authorization-mode=Node,RBAC
    ....
```

Go ahead and add the following audit parameters under the `- kube-apiserver` line.

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

Save your changes and exit the file. When you exit the file, the changes will automatically get picked up by the Kubelet process and applied.

To learn more about each of the Kubernetes API server flags, visit the Kubernetes API parameter [documentation page](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/).
                                                                                                                   |

<InfoBox>
You can optionally add the following Kubernetes API parameters to fine-tune the audit logging.

| Parameter                         | Type     | Description                                                                                                                   |
|-----------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------|
| --audit-log-batch-max-wait        | duration | The amount of time to wait before force writing the batch that hadn't reached the max size. Only used in batch mode. Ex: `"5s"` |
| --audit-log-batch-throttle-enable |          | Whether batching throttling is enabled. Only used in batch mode.                                                              |
| --audit-log-batch-throttle-qps    | float    | The maximum average number of batches per second. Only used in batch mode                                                     |

</InfoBox>

# Validate

You can validate that audit logs are captured by navigating to the specified audit folder in the `--audit-log-path` parameter. 
Navigate to the **/var/log/kubernetes/audit/** folder. Next, display the audit file content.

<br />

```shell
 cat audit.log
```

# Resources

- [Kubernetes API parameters](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/)
- [Kubernetes Auditing Documentation](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/)