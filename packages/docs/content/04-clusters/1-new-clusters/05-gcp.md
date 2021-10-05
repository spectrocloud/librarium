---
title: "GCP"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';



# GCP Cluster

On the GCP cluster, control plane nodes and worker nodes are placed within a single private subnet which spans across different availability zones within a region.

A new VPC Network is created together with all the network infrastructure components like Cloud NAT and a Cloud Router. Firewall rules are created to protect all the API endpoints.

API server endpoint is exposed through a Global Load Balancer. Applications running with the cluster use a Regional Load Balancer to expose the load-balancer services.

![gcp_cluster_architecture.png](gcp_cluster_architecture.png)

## Creating a GCP Cloud Account

To create a GCP cloud account, you need the JSON credentials (service account key) file of the service account.

To create a service account, the user should have one of the following IAM roles:
`roles/iam.serviceAccountAdmin` or `roles/iam.serviceAccountAdmin` .

To create a service account, refer to https://cloud.google.com/iam/docs/creating-managing-service-accounts.

There are two options to create a service account, either use existing standard roles, or create a new role with custom permissions.

### Create Service Account with existing standard roles

The service account should have the following roles:

1. Compute Admin
1. Service Account User
1. Storage Object Viewer

### Create Service Account with a new role with custom permissions

The custom new role should include these minimum permissions

```
compute.backendServices.create
compute.backendServices.delete
compute.backendServices.get
compute.backendServices.list
compute.backendServices.update
compute.backendServices.use
compute.disks.create
compute.firewalls.create
compute.firewalls.delete
compute.firewalls.get
compute.firewalls.list
compute.globalAddresses.create
compute.globalAddresses.delete
compute.globalAddresses.get
compute.globalAddresses.list
compute.globalAddresses.use
compute.globalForwardingRules.create
compute.globalForwardingRules.delete
compute.globalForwardingRules.get
compute.globalForwardingRules.list
compute.healthChecks.create
compute.healthChecks.delete
compute.healthChecks.get
compute.healthChecks.list
compute.healthChecks.useReadOnly
compute.instanceGroups.create
compute.instanceGroups.delete
compute.instanceGroups.get
compute.instanceGroups.list
compute.instanceGroups.update
compute.instanceGroups.use
compute.instances.create
compute.instances.delete
compute.instances.get
compute.instances.list
compute.instances.setLabels
compute.instances.setMetadata
compute.instances.setServiceAccount
compute.instances.setTags
compute.instances.use
compute.networks.create
compute.networks.delete
compute.networks.get
compute.networks.list
compute.networks.updatePolicy
compute.regions.get
compute.regions.list
compute.routers.create
compute.routers.delete
compute.routers.get
compute.routes.delete
compute.routes.get
compute.routes.list
compute.subnetworks.create
compute.subnetworks.delete
compute.subnetworks.get
compute.subnetworks.list
compute.subnetworks.use
compute.targetTcpProxies.create
compute.targetTcpProxies.delete
compute.targetTcpProxies.get
compute.targetTcpProxies.use
compute.zones.get
compute.zones.list
iam.serviceAccounts.actAs
iam.serviceAccounts.get
iam.serviceAccounts.list
resourcemanager.projects.get
resourcemanager.projects.list
storage.objects.get
storage.objects.list
```

The process of creating the JSON credential files is available here: https://cloud.google.com/iam/docs/creating-managing-service-account-keys.
