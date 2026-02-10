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

## View Audit Logs

Audits can be accessed for the tenant scope and the project scope. The tenant scope audits show all the activity logs
across all projects and tenant actions. The project scope audits show the activity logs for the specific project.

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Select a project to view project scope audit logs or select **Tenant Admin** to view tenant scope audit logs.

    - Users must have the **Project Viewer** role with `audit.get` and `audit.list` permissions for the selected project
      to access the audit logs.
    - Users must have the **Tenant Admin** role or the `audit.get` and `audit.list` permissions at the tenant scope to
      access the audit logs.

3.  Navigate to the left main menu and select **Audit Logs**.

4.  You can filter audit logs based on user and resource attributes. The following attributes can be used to filter the
    audit logs.

    - **Project**
    - **Log Type**
    - **User**
    - **Resource Type**

5.  You can also download audit logs as CSV files.

## Add Update Note

For certain resources, like cluster profiles, you can associate a custom update note in addition to the generic audit
event log. On a successful save of a cluster profile, you will be prompted to provide an update note about the changes
made to the profile. This message will be shown when you select an audit log from the list.

## Push Audit Trails to AWS CloudWatch

You can push the compliance, management, operational, and risk audit logs to
[AWS CloudWatch](https://aws.amazon.com/cloudwatch/). This enables continuous monitoring, security analysis, resource
tracking, and troubleshooting of the workload cluster using the event history.

### Prerequisites

Ensure that the IAM user or the ROOT user role created has the following IAM policy included for Amazon CloudWatch.

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

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left main menu and select **Tenant Settings**. Then, select **Audit Trails** from the
   **Infrastructure** section.

3. Select **Add new Audit Trail**. The **Add audit trail** window appears.

4. Fill in the following details.

   - **Audit Name**: Custom name to identify the logs.
   - **Type**: Choice of monitoring service. Currently, AWS CloudWatch is available.
   - **Group**: The log group name obtained from CloudWatch logs for audit trail creation.
   - **Region**: The region of the AWS account.
   - **Credentials** : Use an **Access Key** and **Secret Access Key** to validate the AWS account for pushing the audit
     trails from Palette.
   - **STS**: Use Amazon's unique resource identifier, ARN, to validate the AWS account for pushing the audit trails
     from Palette.
   - **Stream (Optional)**: CloudWatch log stream for audit trail creation.

5. Select **Confirm** to complete the audit trail configuration. Audit trails can be edited and deleted using the
   **three-dot Menu**.

## Resources

- [Kubernetes API parameters](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/)

- [Kubernetes Auditing Documentation](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/)
