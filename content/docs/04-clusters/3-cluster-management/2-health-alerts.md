---
title: "Cluster Health Alerts"
metaTitle: "Cluster Health Alerts on Spectro Cloud"
metaDescription: "Cluster Health Alerts"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';


# Overview

Spectro Cloud monitors the health of all the workload clusters and raises an alert when the cluster goes to an unhealthy state. Besides displaying the alert on the UI console, Spectro Cloud provides the ability to have these alerts pushed out to a variety of channels. Users can setup simple email alerts to receive an email when health status of their cluster changes. Additionally, they can setup Webhooks to integrate alerts with a variety of ITSM tools such as Service Now, Slack, Microsoft Teams, etc. These alerts are setup at the project level and apply to all clusters within the project.

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
* Fill the Webhook creation wizard with the following details:
	* Alert type: ClusterHealth
	* Method: POST to Post the alert message to the hooked target
	* URL: URL of the target to be hooked to receive alerts
	* Body: JSON formatted alert message
	* Headers: Optional header as key-value pair depending on the target
	* Active: Enable to Disable the Webhook
* Confirm the details provided to receive the health alerts for your workload clusters in your ITSM tools.




