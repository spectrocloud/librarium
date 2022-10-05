---
title: "How to Configure kube-apiserver audit logging"
metaTitle: "Configuring the kube-apiserver audit logging featureo"
metaDescription: "KnowledgeBase with How to"
icon: "laptop"
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Geting Started with Palette and kube-api Audit Logging

This tutorial is based on the upstream Kubernetes documentation and kube-apiserver source code. It assumes that you have working knowledge of the Kubernetes API.


## Logging all API requests at the metadata level

To start, we will use the [minimal audit policy file](#creating-the-audit-policy-file) to log all requests at the `metadata` level. 

The output will be written to the log file located at `/var/log/kubernetes/audit/audit.log`, which should be sent to and ingested by a logging appliance (ex. Splunk). 

The `/var/log/kubernetes/audit/` directory should be backed by persistent storage to ensure that during an unexpected outage of the node, any unshipped audit logs will not be lost.  

In this example, the logging appliance should be configured to filter the incoming audit logs. 

## Creating the Audit Policy File

On a control-plane node in the target cluster, run the following command to create your audit policy file. 

**NB.** This example configuration enables log truncation, compression, batching, and retention.

```shell
cat << EOF > /etc/kubernetes/audit-policy.yaml
# Log all requests at the Metadata level.
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
EOF
```

## Configuring the kube-apiserver manifest

Append the following yaml configuration to your kube-apiserver manifest.

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

## Configuring kube-apiserver options 

Add the following kube-apiserver flags.

```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml 
    --audit-log-path=/var/log/kubernetes/audit/audit.log
    --audit-log-batch-buffer-size 10000
    --audit-log-batch-max-size 5
    --audit-log-compress
    --audit-log-format "json" 
    --audit-log-maxage 30
    --audit-log-maxbackup 100
    --audit-log-maxsize 50
    --audit-log-mode "batch"
    --audit-log-truncate-enabled
    --audit-log-truncate-max-batch-size 10485760
    --audit-log-truncate-max-event-size 102400
    --audit-log-version "audit.k8s.io/v1"
```

**NB** Descriptions are included below for each option set.

```console
audit-policy-file string // If set, all requests coming to the apiserver will be logged to this file. '-' means standard out.

audit-log-path string // If set, all requests coming to the apiserver will be logged to this file. '-' means standard out.

audit-log-batch-buffer-size int // The size of the buffer to store events before batching and writing. Only used in batch mode.

audit-log-batch-max-size int // The maximum size of a batch. Only used in batch mode.

audit-log-compress // if set, the rotated log files will be compressed using gzip

audit-log-format string // Format of saved audits. "legacy" indicates 1-line text format for each event. "json" indicates structured json format. Known formats are legacy,json.

audit-log-maxage int // defined the maximum number of days to retain old audit log files

audit-log-maxbackup int // defines the maximum number of audit log files to retain

audit-log-maxsize int // defines the maximum size in megabytes of the audit log file before it gets rotated

audit-log-mode string // Strategy for sending audit events. Blocking indicates sending events should block server responses. Batch causes the backend to buffer and write events asynchronously. Known modes are batch,blocking,blocking-strict.

audit-log-truncate-enabled // Whether event and batch truncating is enabled.

audit-log-truncate-max-batch-size int // Maximum size of the batch sent to the underlying backend. Actual serialized size can be several hundreds of bytes greater. If a batch exceeds this limit, it is split into several batches of smaller size.

audit-log-truncate-max-event-size int // Maximum size of the audit event sent to the underlying backend. If the size of an event is greater than this number, first request and response are removed, and if this doesn't reduce the size enough, event is discarded.

audit-log-version string // API group and version used for serializing audit events written to log.

```

## (Optional) Additional configuration options for fine-tuning

```console
    --audit-log-batch-max-wait duration \ # The amount of time to wait before force writing the batch that hadn't reached the max size. Only used in batch mode.
    --audit-log-batch-throttle-burst int \ # Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. Only used in batch mode.
    --audit-log-batch-throttle-enable \ # Whether batching throttling is enabled. Only used in batch mode.
    --audit-log-batch-throttle-qps float \ # Maximum average number of batches per second. Only used in batch mode.
```