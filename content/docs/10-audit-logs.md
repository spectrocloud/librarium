---
title: "Audit Logs"
metaTitle: "Spectro Cloud user audit logs"
metaDescription: "Spectro Cloud logs for every event occurring under a user for every Kubernetes cluster"
icon: "admin"
hideToC: false
fullWidth: false
---


import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# About Audit Logs

Palette records audit logs that monitor user interactions with application resources over time. In addition, for specific resources, it also captures system-level modifications.

Audit logs include information about the resource and the user who executed the action. Actions on resources, performed by either users or the system, are categorized as *Create*, *Update*, or *Delete*. Each resource is classified by type, allowing users to easily filter and focus on relevant audit logs.

Audit logs are retained for the last one year.

## Audit Resource Types

The following Palette resources are captured in an audit log.

| Resource Name     | Resource Kind   | Description |
|-------------------|-----------------|-------------|
| Api Key           | `apiKey`        |             |
| App Deployment    | `appdeployment` |             |
| App Profile       | `appprofile`    |             |
| Cloud Account     | `cloudaccount`  |             |
| Cluster Group     | `clustergroup`  |             |
| Profile           | `clusterprofile`|             |
| EdgeHost          | `edgehost`      |             |
| EdgeToken         | `edgetoken`     |             |
| Filter            | `filter`        |             |
| Location          | `location`      |             |
| Plan              | `plan`          |             |
| Private Gateway   | `privategateway`|             |
| Project           | `project`       |             |
| Registry          | `registry`      |             |
| Role              | `role`          |             |
| Cluster           | `spectrocluster`|             |
| SSH Key           | `sshkey`        |             |
| Team              | `team`          |             |
| User              | `user`          |             |
| Virtual Cluster   | `virtualCluster`|             |
| Workspace         | `workspace`     |             |


 The resource kind value is used when interacting with Palette's API audit endpoint `https://api.spectrocloud.com/v1/audits` and you need to filter for a specific set of resources. The following code snippet is an example request using `curl` that queries the audit endpoint and applies a filter for a specific date range and resource kind.

<br />

```shell
curl "https://api.spectrocloud.com/v1/audits?startTime=2023-03-28T00:00:00%2B05:30&endTime=2023-04-28T23:59:59%2B05:30&resourceKind=project" \
 --header 'Content-Type: application/json' \
 --header 'Accept: application/json' \
 --header "ApiKey: $API_KEY"
```



# Accessing Audit Logs

Audits can be accessed for the tenant scope and the project scope. The tenant scope audits show all the activity logs across all projects and tenant actions. The project scope audits show the activity logs for the specific project.

* The tenant scope audit logs can be accessed in the Spectro Cloud console under the **Admin > Audit Logs**. The user should have the *Tenant Admin* role or at least the `audit.get` and `audit.list` permissions at the tenant scope to access the audit logs.
* The project scope audit logs can be accessed under the **Project** *selection* > **Audit Logs**. The user should have at least the *Project Viewer* role with `audit.get` and `audit.list` permissions for the selected project to access the audit logs.
* Tenant admins (or users with appropriate permissions) can download the audit logs as a *.csv file.

# Filtering Audit Logs

The audit logs can be filtered based on user and resource attributes. The following attributes can be used to filter the audit logs:

* Type - The action type on the resource.
* Resource Type - The resource type. (The resources are grouped based on the type).
* Start Date and End Date - Period range for the audit logs.

# Adding Update Note

For certain resources like the Cluster Profile, users can associate a custom update note in addition to the generic audit event log. On a successful save of the Cluster Profile, the user will be prompted to provide an update note about the changes made on the profile. This message will be shown when the user selects an audit log from the list.

# Pushing the Audit Log to the AWS Cloud Trail

Spectro Cloud users can now push the compliance, management, operational, and risk audit logs to the AWS CloudTrail. This enables continuous monitoring, security analysis, resource tracking, and troubleshooting of the workload cluster using the event history.

<WarningBox>
An AWS account with cloud trail created is the prerequisite.

The permissions listed need to be enabled for CloudWatch.
</WarningBox>

## Permission List

Ensure that the IAM user or the ROOT user role created should have the following IAM policy included for Amazon CloudWatch:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:DescribeLogGroups",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DeleteLogStream",
        "logs:DescribeLogStreams"
      ],
      "Resource": [
        "<CLOUDWATCH-LOG-GROUP-ARN>;"
      ]
    }
  ]
}
```
## Instructions to Push Cluster Audit Logs to AWS Trails 

* Go to Admin Settings and select Audit Trails.
* Select the wizard ‘Add new Audit Trail’ and fill in the following details:

  * Audit Name: Custom name to identify the logs
  * Type: Choice of monitoring service (currently set to AWS Cloud Watch)
  * Group: The log group name obtained from cloud watch logs of AWS cloud trail creation
  * Region: The region of the AWS account
  * Method of verification:
   	* Credentials:
Use the AWS Access Key and Secret Access Key to validate the AWS account for pushing the Audit log trails from Spectro Cloud console.
   	* STS:
Use Amazon’s unique resource identifier- ARN, to validate the AWS account for pushing the Audit log trails from Spectro Cloud console.
	
* Stream Optional.
* Confirm the information to complete the audit trail creation wizard.
* The audit trail could be edited and deleted using the kebab menu.


