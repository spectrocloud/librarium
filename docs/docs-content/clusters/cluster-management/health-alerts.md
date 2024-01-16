---
sidebar_label: "Cluster Health Alerts"
title: "Cluster Health Alerts"
description: "Cluster Health Alerts"
hide_table_of_contents: false
sidebar_position: 40
tags: ["clusters", "cluster management"]
---

Palette monitors the health of all Workload Clusters and raises an alert when the Cluster goes to an unhealthy state. Besides displaying the alert on the User Interface (UI) console, Palette provides the ability to have these alerts pushed out to a variety of channels. Users can set up simple email alerts to receive a notice when the Health Status of their cluster changes. Additionally, they can set up Webhooks to integrate alerts with a variety of IT Service Management (ITSM) tools such as ServiceNow, Slack, or Microsoft Teams. These alerts are set up at the Project level and apply to all Clusters within the Project.

The Palette Management Server relies on the following to trigger Cluster-health Alerts:

- Node and resource metrics pushed by Spectro agent from clusters.

- Machines' info and heartbeat from the agent.

  Management server has a timeout of 10 mins for heartbeat detection. An alert is triggered if agent heartbeat is not received within the fixed timeout. Cluster will be marked as "unhealthy" when the agent is down/paused for troubleshooting. This behavior is applicable for:

  - Both workload clusters and management cluster of public cloud.
  - Management clusters of on-premises, enterprise infrastructure.

## Email Alerts

1. As the Project Administrator, navigate to Project Settings.

2. Click **Alerts** to access the **Manage Alerts** page.

3. Enable **ClusterHealth**.

4. Select **Email all project members** option if the alert needs to be received by every Project Member or specify the email Ids of members who are supposed to receive the alerts.

5. Save the settings to start receiving the health alerts from your workload cluster.

## Webhook Alerts

1.  As **Project Administrator**, navigate to **Project Settings**.

2.  Click **Alerts** to access the **Manage Alerts** page.

3.  Click on **Add New Webhook**.

4.  Follow the Webhook creation wizard with the following details:

    - **Alert type** - ClusterHealth
    - **Method** - POST to Post the alert message to the hooked target
    - **URL** - URL of the target to be hooked to receive alerts
    - **Body** - JSON formatted alert message
    - **Headers** - Optional header as key-value pair depending on the target
    - **Active** - Enable to Disable the Webhook

5.  Confirm the details provided to receive the health alerts for your workload clusters in your ITSM tools.
