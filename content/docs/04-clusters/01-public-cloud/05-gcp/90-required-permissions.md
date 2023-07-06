---
title: "Required IAM Permissions"
metaTitle: "Required IAM Permissions"
metaDescription: "A list of required IAM permissions that Palette requires for GCP deployments."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

This table contains the required Google Cloud Platform (GCP) permissions to create a custom GCP role tailored for usage with Palette. When creating a custom role, ensure you include all the permissions listed below to prevent Palette from having issues when deploying a host cluster.

| Permissions                              | Description                                                   |
|------------------------------------------|---------------------------------------------------------------|
| `compute.backendServices.create`           | Create backend services                                       |
| `compute.backendServices.delete`           | Delete backend services                                       |
| `compute.backendServices.get`              | Get backend service information                               |
| `compute.backendServices.list`             | List backend services                                         |
| `compute.backendServices.update`           | Update backend services                                       |
| `compute.backendServices.use`              | Use backend services                                          |
| `compute.disks.create`                     | Create persistent disks                                       |
| `compute.firewalls.create`                 | Create firewall rules                                         |
| `compute.firewalls.delete`                 | Delete firewall rules                                         |
| `compute.firewalls.get`                    | Get firewall rule information                                 |
| `compute.firewalls.list`                   | List firewall rules                                           |
| `compute.globalAddresses.create`           | Create global addresses                                       |
| `compute.globalAddresses.delete`           | Delete global addresses                                       |
| `compute.globalAddresses.get`              | Get global address information                                |
| `compute.globalAddresses.list`             | List global addresses                                         |
| `compute.globalAddresses.use`              | Use global addresses                                          |
| `compute.globalForwardingRules.create`     | Create global forwarding rules                                |
| `compute.globalForwardingRules.delete`     | Delete global forwarding rules                                |
| `compute.globalForwardingRules.get`        | Get global forwarding rule information                        |
| `compute.globalForwardingRules.list`       | List global forwarding rules                                  |
| `compute.healthChecks.create`              | Create health checks                                          |
| `compute.healthChecks.delete`              | Delete health checks                                          |
| `compute.healthChecks.get`                 | Get health check information                                  |
| `compute.healthChecks.list`                | List health checks                                            |
| `compute.healthChecks.useReadOnly`         | Use health checks in read-only mode                           |
| `compute.instanceGroups.create`            | Create instance groups                                        |
| `compute.instanceGroups.delete`            | Delete instance groups                                        |
| `compute.instanceGroups.get`               | Get instance group information                                |
| `compute.instanceGroups.list`              | List instance groups                                          |
| `compute.instanceGroups.update`            | Update instance groups                                        |
| `compute.instanceGroups.use`               | Use instance groups                                           |
| `compute.instances.create`                 | Create instances                                              |
| `compute.instances.delete`                 | Delete instances                                              |
| `compute.instances.get`                    | Get instance information                                      |
| `compute.instances.list`                   | List instances                                                |
| `compute.instances.setLabels`              | Set labels on instances                                       |
| `compute.instances.setMetadata`            | Set metadata on instances                                     |
| `compute.instances.setServiceAccount`      | Set service account on instances                              |
| `compute.instances.setTags`                | Set tags on instances                                         |
| `compute.instances.use`                    | Use instances                                                 |
| `compute.networks.create`                  | Create networks                                               |
| `compute.networks.delete`                  | Delete networks                                               |
| `compute.networks.get`                     | Get network information                                       |
| `compute.networks.list`                    | List networks                                                 |
| `compute.networks.updatePolicy`            | Update network policies                                       |
| `compute.regions.get`                      | Get region information                                        |
| `compute.regions.list`                     | List regions                                                  |
| `compute.routers.create`                   | Create routers                                                |
| `compute.routers.delete`                   | Delete routers                                                |
| `compute.routers.get`                      | Get router information                                        |
| `compute.routes.delete`                    | Delete routes                                                 |
| `compute.routes.get`                       | Get route information                                         |
| `compute.routes.list`                      | List routes                                                   |
| `resourcemanager.projects.get`                      | Get details of a specified Google Cloud project. |
| `resourcemanager.projects.list`                     | List all Google Cloud projects that the user has access to. |
| `storage.objects.get`                               | Get details of a specified object in Google Cloud Storage. |
| `storage.objects.list`                              | List all objects in a specified Google Cloud Storage bucket. |
| `iam.serviceAccounts.actAs`                         | Act as the service account specified, allowing access to its resources. |
| `iam.serviceAccounts.get`                           | Get details of a specified service account. |
| `iam.serviceAccounts.getAccessToken`                | Get the Oauth2 access token for the service account. |
| `iam.serviceAccounts.list`                          | List all service accounts available to the user. |
| `serviceusage.quotas.get`                           | Get quota information for a specified Google Cloud service. |
| `serviceusage.services.get`                         | Get details of a specified Google Cloud service. |
| `serviceusage.services.list`                        | List all Google Cloud services available to the user. |
| `recommender.containerDiagnosisInsights.*`          | Access insights about diagnosed issues with Google Kubernetes Engine containers. |
| `recommender.containerDiagnosisRecommendations.*`   | Access recommendations for resolving diagnosed issues with Google Kubernetes Engine containers. |
| `recommender.locations.*`                           | Access details about locations in Google Cloud Recommender. |
| `recommender.networkAnalyzerGkeConnectivityInsights.*`| Access insights about network connectivity for Google Kubernetes Engine clusters. |
| `recommender.networkAnalyzerGkeIpAddressInsights.*` | Access insights about IP address usage for Google Kubernetes Engine clusters. |

