---
sidebar_label: "Troubleshooting"
title: "Common issues and their solutions"
description: "Common issues and their solutions in the deployment of Spectro Cloud Clusters"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "screwdriver-wrench"
tags: ["troubleshooting"]
---

Use the following troubleshooting resources to help you address issues that may arise. You can also reach out to our support team by opening up a ticket through our [support page](http://support.spectrocloud.io/).

<br />

- [Kubernetes Debugging](kubernetes-tips.md)

- [Cluster Deployment](cluster-deployment.md)

- [Edge](edge.mdx)

- [Nodes & Clusters](nodes.md)

- [Kubernetes Debugging](kubernetes-tips.md)

- [Packs](pack-issues.md)

- [Palette Dev Engine](palette-dev-engine.md)

- [Palette Upgrade](palette-upgrade.md)

- [Private Cloud Gateway](pcg.md)

## Generate HAR Files

When you report issues with Palette to Spectro Cloud Support, we may ask you to generate an HTTP Archive (HAR) file to help us identify and resolve those issues.

- [Generate HAR files](generate-har-files.md)

## Download Cluster Logs

At times it might be required to work with the Spectro Cloud support team to troubleshoot an issue. Spectro Cloud provides the ability to aggregate logs from the clusters it manages. Problems that occur during the orchestration life cycle may require access to the various containers, nodes, and Kube system logs. Spectro Cloud automates this log collection process and provides an easy download option from the Spectro Cloud UI console. Hence reduces the burden on the operator to login into various cluster nodes individually and fetch these logs.

Follow the link for more details: [Download Cluster Logs](../clusters/clusters.md#download-cluster-logs)

## Event Stream

Spectro Cloud maintains an event stream with low-level details of the various orchestration tasks being performed. This event stream is a good source for identifying issues in the event an operation does not complete for a long time.

<br />

:::caution

Due to Spectro Cloud’s reconciliation logic, intermittent errors show up in the event stream. As an example, after launching a node, errors might show up in the event stream regarding being unable to reach the node. However, the errors clear up once the node comes up.<p></p>
Error messages that persist over a long time or errors indicating issues with underlying infrastructure are an indication of a real problem.

:::

## Lifecycle Behaviors

Typically when a cluster life cycle action such as provisioning, upgrade, or deletion runs into a failure, it does not result in an outright error on the cluster. The Spectro Cloud orchestration engine follows the reconciliation pattern wherein the system repeatedly tries to perform various orchestration tasks to bring the cluster to its desired state until it succeeds. Initial cluster provisioning or subsequent updates can run into a variety of issues related to cloud infrastructure availability, lack of resources, networking issues, etc.

## Cluster conditions

Spectro Cloud maintains specific milestones in a life cycle and presents them as “conditions”. Examples include: Creating Infrastructure, Adding Control Plane Node, Customizing Image, etc. The active condition indicates what task Spectro Cloud’s orchestration system is trying to perform. If a task results in failures, the condition is marked as failed, with relevant error messages. Reconciliation however continues behind the scenes and continuous attempts are made to perform the task. Failed conditions are a great source of troubleshooting provisioning issues.

For example, failure to create a virtual machine in AWS due to the vCPU limit being exceeded would cause this error is shown to the end-users. They could choose to bring down some workloads in the AWS cloud to free up space. The next time a VM creation task is attempted, it would succeed and the condition would be marked as a success.

<br />
