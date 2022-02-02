---
title: "Cluster Health Alerts"
metaTitle: "Cluster Health Alerts on Spectro Cloud"
metaDescription: "Cluster Health Alerts"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';


# Overview
Spectro Cloud monitors the health of all workload clusters and raises an alert when the cluster goes to an unhealthy state. Besides displaying the alert on the UI console, Spectro Cloud provides the ability to have these alerts pushed out to a variety of channels. Users can setup simple email alerts to receive an email when health status of their cluster changes. Additionally, they can setup Webhooks to integrate alerts with a variety of ITSM tools such as Service Now, Slack, Microsoft Teams, etc. These alerts are setup at the project level and apply to all clusters within the project.

Palette management server relies on the following to trigger cluster-health alerts:
* Node and resource metrics pushed by Spectro agent from clusters.
* Machines info and heartbeat from the agent.
Management server has a timeout of 10 mins for heartbeat detection. An alert is triggered if agent heartbeat is not received within the fixed timeout. Cluster will be marked as "unhealthy" when the agent is down/paused for troubleshooting. This behavior is applicable for:
  * both workload clusters and management cluster of public cloud
  * management clusters of on-prem enterprise infrastructure

# Email Alerts
* As project administrator, navigate to project settings.
* Click Alerts to access the Manage Alerts page.
* Enable ClusterHealth.
* Select "Email all project members" option if the alert needs to be received by every project member or specify the email ids of members who are supposed to receive the alerts.
* Save the settings to start receiving the health alerts from your workload cluster.

# Webhook Alerts

* As project administrator, navigate to project settings.
* Click Alerts to access the Manage Alerts page.
* Enable ClusterHealth.
* Click on add new Webhook.
* Follow the Webhook creation wizard with the following details:
	* Alert type: ClusterHealth
	* Method: POST to Post the alert message to the hooked target
	* URL: URL of the target to be hooked to receive alerts
	* Body: JSON formatted alert message
	* Headers: Optional header as key-value pair depending on the target
	* Active: Enable to Disable the Webhook
* Confirm the details provided to receive the health alerts for your workload clusters in your ITSM tools.




