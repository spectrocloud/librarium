---
title: "Audit Logs"
metaTitle: "Spectro Cloud user audit logs"
metaDescription: "Spectro Cloud logs for every event occurring under a user for every Kubernetes cluster"
icon: "admin"
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# About Audit Logs

The Spectro Cloud SaaS application captures audit logs to track the user interaction with the application resources along with the timeline. For certain resources, the system-level modifications are also captured in the audit logs.

The audit log contains information about the resource and the user who performed the action. The user or the system action on the resource is classified as *Create*, *Update* and *Delete*. Every resource is categorized as a type that helps the user to scope down the audit logs.

# Accessing Audit Logs

Audits can be accessed for the tenant scope and the project scope. The tenant scope audits show all the activity logs across all projects and tenant actions. The project scope audits show the activity logs for the specific project.

* The tenant scope audit logs can be accessed in the Spectro Cloud console under the **Admin > Audit Logs**. The user should have the *Tenant Admin* role or at least the `audit.get` and `audit.list` permissions at the tenant scope to access the audit logs.
* The project scope audit logs can be accessed under the **Project** *selection* > **Audit Logs**. The user should have at least the *Project Viewer* role with `audit.get` and `audit.list` permissions for the selected project to access the audit logs.
* Tenant admins (or users with appropriate permissions) can download the audit logs as a *.csv file.

# Filtering Audit Logs

The audit logs can be filtered based on user and resource attributes. The following attributes can be used to filter the audit logs:

* Type - The action type on the resource.
* Resource Type - The resources type. (The resources are grouped based on the type).
* Start Date and End Date - Period range for the audit logs.

# Adding Update Note

For certain resources like the Cluster Profile, users can associate a custom update note in addition to the generic audit event log. On a successful save of the Cluster Profile, the user will be prompted to provide an update note about the changes made on the profile. This message will be shown when the user selects an audit log from the list.
