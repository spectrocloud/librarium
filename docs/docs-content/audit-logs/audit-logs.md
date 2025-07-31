---
sidebar_label: "Audit Logs"
title: "Audit Logs"
description: "Learn about auditing in Palette and how to access audit logs."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "admin"
---

The Spectro Cloud management platform application captures audit logs to track the user interaction with the application
resources along with the timeline. For certain resources, the system-level modifications are also captured in the audit
logs.

The audit log contains information about the resource and the user who performed the action. The user or the system
action on the resource is classified as _Create_, _Update_, and _Delete_. Every resource is categorized as a type that
helps the user to scope down the audit logs.

Audit logs are retained for the last one year.

## Accessing Audit Logs

Audits can be accessed for the tenant scope and the project scope. The tenant scope audits show all the activity logs
across all projects and tenant actions. The project scope audits show the activity logs for the specific project.

- The tenant scope audit logs can be accessed in the Spectro Cloud console under the **Admin > Audit Logs**. The user
  should have the _Tenant Admin_ role or at least the `audit.get` and `audit.list` permissions at the tenant scope to
  access the audit logs.
- The project scope audit logs can be accessed under the **Project** _selection_ > **Audit Logs**. The user should have
  at least the _Project Viewer_ role with `audit.get` and `audit.list` permissions for the selected project to access
  the audit logs.
- Tenant admins (or users with appropriate permissions) can download the audit logs as a \*.csv file.

## Filtering Audit Logs

The audit logs can be filtered based on user and resource attributes. The following attributes can be used to filter the
audit logs:

- Type - The action type on the resource.
- Resource Type - The resource type. (The resources are grouped based on the type).
- Start Date and End Date - Period range for the audit logs.

## Adding Update Note

For certain resources like the Cluster Profile, users can associate a custom update note in addition to the generic
audit event log. On a successful save of the Cluster Profile, the user will be prompted to provide an update note about
the changes made on the profile. This message will be shown when the user selects an audit log from the list.

## Pushing the Audit Log to the AWS Cloud Trail

Spectro Cloud users can now push the compliance, management, operational, and risk audit logs to the AWS CloudTrail.
This enables continuous monitoring, security analysis, resource tracking, and troubleshooting of the workload cluster
using the event history.

<br />

:::warning

An AWS account with cloud trail created is the prerequisite.

The permissions listed need to be enabled for CloudWatch.

:::

### Permission List

Ensure that the IAM user or the ROOT user role created should have the following IAM policy included for Amazon
CloudWatch:

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
      "Resource": ["<CLOUDWATCH-LOG-GROUP-ARN>"]
    }
  ]
}
```

### Instructions to Push Cluster Audit Logs to AWS Trails

- Go to Admin Settings and select Audit Trails.
- Select the wizard ‘Add new Audit Trail’ and fill in the following details:

  - Audit Name: Custom name to identify the logs
  - Type: Choice of monitoring service (currently set to AWS Cloud Watch)
  - Group: The log group name obtained from cloud watch logs of AWS cloud trail creation
  - Region: The region of the AWS account
  - Method of verification: _ Credentials: Use the AWS Access Key and Secret Access Key to validate the AWS account for
    pushing the Audit log trails from Spectro Cloud console. _ STS: Use Amazon’s unique resource identifier- ARN, to
    validate the AWS account for pushing the Audit log trails from Spectro Cloud console.

- Stream Optional.
- Confirm the information to complete the audit trail creation wizard.
- The audit trail could be edited and deleted using the **three-dot Menu**.

## Resources

- [Kubernetes API parameters](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/)

- [Kubernetes Auditing Documentation](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/)

<br />