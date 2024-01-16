---
sidebar_label: "Kubernetes Debugging"
title: "Kubernetes Debugging Tips"
description: "Learn tips and tricks related to Kubernetes dubbging."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["k8s-tips", "troubleshooting"]
---

# Kubernetes Debug

Spectro Cloud provisions standard, upstream Kubernetes clusters using `kubeadm` and `cluster-api`. The official Kubernetes documentation related to support and troubleshooting are great troubleshooting resources that you should also consider reviewing. The official Kubernetes [debugging guide](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster) is about cluster troubleshooting and offers excellent advice on how to resolve common issues that may arise.

## Log Tips

The table below displays useful Kubernetes log types that can aid you in the debugging process. The [Kubernetes Logging Architecture](https://kubernetes.io/docs/concepts/cluster-administration/logging/) page is a good resource you can review to help gain a better understanding of the logging architecture.

| **Log Type**       | **Access Method**                                           |
| ------------------ | ----------------------------------------------------------- |
| Kubelet            | `journalctl -u kubelet`                                     |
| Container          | `kubectl logs` OR `/var/log/containers` and `/var/log/pods` |
| Previous Container | `kubectl logs <podName> --previous`                         |
