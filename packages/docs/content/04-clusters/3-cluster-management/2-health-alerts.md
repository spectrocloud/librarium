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


## Cluster Health Alert

Spectro Cloud defines custom health alerts for our workload clusters. The users can now set up alerts as emails or Webhook alert messages that pop-ups to users’ chat rooms, any preferred web pages or email. When an alert triggers from the cluster, the Webhook makes an HTTP POST request on the URL. Webhook passes JSON formatted information about the alert in the body of the POST request. To set up an alert, get the hook URL of the target source. E.g., If you want to hook the alerts to your Slack room, Slack's Webhook URL is used. The alert can also be received at any email id preferred by the customer.

### Create Your Alert
* To manage your alerts, go to project settings
* Click Alerts to access the Manage Alerts page.
* Users can create two types of alerts,
	* Email Alerts
	* Webhooks Alerts
* For Email Alerts:
	* Enable ClusterHealth
	* Select Email all project members if the alert needs to be received by every project member or specify the email ids of members who are supposed to receive the alerts.
       	* Save the settings to start receiving the health alerts from your workload cluster.
* For Webhooks Alert
	* Click on add new webhook
	* Fill the webhook creation wizard with the following details,
		* Alert type: ClusterHealth
		* Method: POST to Post the alert message to the hooked target
		* URL: URL of the target to be hooked to receive alerts.
		* Body: JSON formatted alert message
		* Headers: Optional header as key-value pair depending on the target
		* Active: Select and deselect keep the alert active or inactive.
	* Confirm the details provided to receive the health alerts of your workload cluster to the hooked target.




