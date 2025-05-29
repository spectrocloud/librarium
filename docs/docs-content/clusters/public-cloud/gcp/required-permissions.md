---
sidebar_label: "Required IAM Permissions"
title: "Required IAM Permissions"
description: "A list of required IAM permissions that Palette requires for GCP deployments."
hide_table_of_contents: false
sidebar_position: 40
tags: ["public cloud", "gcp", "iam"]
---

## Required API Services

Ensure the following Google Cloud Platform (GCP) API services are enabled in your GCP project to deploy a host cluster:

- [Cloud Resource Manager API](https://cloud.google.com/resource-manager/reference/rest)
- [Compute Engine API](https://cloud.google.com/compute/docs/reference/rest/v1)
- [Kubernetes Engine API](https://cloud.google.com/kubernetes-engine/docs/reference/rest)

:::tip

If you need help enabling a Google Cloud API service, check out the
[Enable and disable APIs](https://support.google.com/googleapi/answer/6158841?hl=en) guide from the official Google
Cloud documentation.

:::

## Required Permissions

This table contains the required Google Cloud Platform (GCP) permissions to create a custom GCP role tailored for usage
with Palette. When creating a custom role, ensure you include all the permissions listed below to prevent Palette from
having issues when deploying a host cluster.

| Permissions                                                 | Description                                                                        |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `compute.backendServices.create`                            | Create backend services                                                            |
| `compute.backendServices.delete`                            | Delete backend services                                                            |
| `compute.backendServices.get`                               | Get backend service information                                                    |
| `compute.backendServices.list`                              | List backend services                                                              |
| `compute.backendServices.update`                            | Update backend services                                                            |
| `compute.backendServices.use`                               | Use backend services                                                               |
| `compute.disks.create`                                      | Create persistent disks                                                            |
| `compute.firewalls.create`                                  | Create firewall rules                                                              |
| `compute.firewalls.delete`                                  | Delete firewall rules                                                              |
| `compute.firewalls.get`                                     | Get firewall rule information                                                      |
| `compute.firewalls.list`                                    | List firewall rules                                                                |
| `compute.globalAddresses.create`                            | Create global addresses                                                            |
| `compute.globalAddresses.delete`                            | Delete global addresses                                                            |
| `compute.globalAddresses.get`                               | Get global address information                                                     |
| `compute.globalAddresses.list`                              | List global addresses                                                              |
| `compute.globalAddresses.use`                               | Use global addresses                                                               |
| `compute.globalForwardingRules.create`                      | Create global forwarding rules                                                     |
| `compute.globalForwardingRules.delete`                      | Delete global forwarding rules                                                     |
| `compute.globalForwardingRules.get`                         | Get global forwarding rule information                                             |
| `compute.globalForwardingRules.list`                        | List global forwarding rules                                                       |
| `compute.healthChecks.create`                               | Create health checks                                                               |
| `compute.healthChecks.delete`                               | Delete health checks                                                               |
| `compute.healthChecks.get`                                  | Get health check information                                                       |
| `compute.healthChecks.list`                                 | List health checks                                                                 |
| `compute.healthChecks.useReadOnly`                          | Use health checks in read-only mode                                                |
| `compute.instanceGroupManagers.get`                         | Get instance group manager information                                             |
| `compute.instanceGroups.create`                             | Create instance groups                                                             |
| `compute.instanceGroups.delete`                             | Delete instance groups                                                             |
| `compute.instanceGroups.get`                                | Get instance group information                                                     |
| `compute.instanceGroups.list`                               | List instance groups                                                               |
| `compute.instanceGroups.update`                             | Update instance groups                                                             |
| `compute.instanceGroups.use`                                | Use instance groups                                                                |
| `compute.instances.create`                                  | Create instances                                                                   |
| `compute.instances.delete`                                  | Delete instances                                                                   |
| `compute.instances.get`                                     | Get instance information                                                           |
| `compute.instances.list`                                    | List instances                                                                     |
| `compute.instances.setLabels`                               | Set labels on instances                                                            |
| `compute.instances.setMetadata`                             | Set metadata on instances                                                          |
| `compute.instances.setServiceAccount`                       | Set service account on instances                                                   |
| `compute.instances.setTags`                                 | Set tags on instances                                                              |
| `compute.instances.use`                                     | Use instances                                                                      |
| `compute.networks.create`                                   | Create networks                                                                    |
| `compute.networks.delete`                                   | Delete networks                                                                    |
| `compute.networks.get`                                      | Get network information                                                            |
| `compute.networks.list`                                     | List networks                                                                      |
| `compute.networks.updatePolicy`                             | Update network policies                                                            |
| `compute.regions.get`                                       | Get region information                                                             |
| `compute.regions.list`                                      | List regions                                                                       |
| `compute.routers.create`                                    | Create routers                                                                     |
| `compute.routers.delete`                                    | Delete routers                                                                     |
| `compute.routers.get`                                       | Get router information                                                             |
| `compute.routes.delete`                                     | Delete routes                                                                      |
| `compute.routes.get`                                        | Get route information                                                              |
| `compute.routes.list`                                       | List routes                                                                        |
| `compute.subnetworks.create`                                | Create subnetworks                                                                 |
| `compute.subnetworks.delete`                                | Delete subnetworks                                                                 |
| `compute.subnetworks.get`                                   | Get subnetwork information                                                         |
| `compute.subnetworks.list`                                  | List subnetworks                                                                   |
| `compute.subnetworks.use`                                   | Use subnetworks                                                                    |
| `compute.targetTcpProxies.create`                           | Create target TCP proxies                                                          |
| `compute.targetTcpProxies.delete`                           | Delete target TCP proxies                                                          |
| `compute.targetTcpProxies.get`                              | Get target TCP proxy information                                                   |
| `compute.targetTcpProxies.use`                              | Use target TCP proxies                                                             |
| `compute.zones.get`                                         | Get zone information                                                               |
| `compute.zones.list`                                        | List zones                                                                         |
| `container.clusters.create`                                 | Create clusters                                                                    |
| `container.clusters.delete`                                 | Delete clusters                                                                    |
| `container.clusters.get`                                    | Get cluster information                                                            |
| `container.clusters.list`                                   | List clusters                                                                      |
| `container.clusters.update`                                 | Update clusters                                                                    |
| `container.operations.get`                                  | Get details of container (GKE) operations                                          |
| `container.operations.list`                                 | List container (GKE) operations                                                    |
| `iam.serviceAccounts.actAs`                                 | Act as the specified service account                                               |
| `iam.serviceAccounts.get`                                   | Get details of a specified service account                                         |
| `iam.serviceAccounts.getAccessToken`                        | Get an OAuth 2.0 access token for the service account                              |
| `iam.serviceAccounts.list`                                  | List all service accounts                                                          |
| `orgpolicy.policy.get`                                      | Get organization policy information                                                |
| `recommender.containerDiagnosisInsights.get`                | Get insights about diagnosed issues with Google Kubernetes Engine (GKE) containers |
| `recommender.containerDiagnosisInsights.list`               | List insights about diagnosed issues with GKE containers                           |
| `recommender.containerDiagnosisInsights.update`             | Update insights about diagnosed issues with GKE containers                         |
| `recommender.containerDiagnosisRecommendations.get`         | Get recommendations for resolving diagnosed issues with GKE containers             |
| `recommender.containerDiagnosisRecommendations.list`        | List recommendations for resolving diagnosed issues with GKE containers            |
| `recommender.containerDiagnosisRecommendations.update`      | Update recommendations for resolving diagnosed issues with GKE containers          |
| `recommender.locations.get`                                 | Get location details from Google Cloud Recommender                                 |
| `recommender.locations.list`                                | List location details from Google Cloud Recommender                                |
| `recommender.networkAnalyzerGkeConnectivityInsights.get`    | Get network connectivity insights for GKE clusters                                 |
| `recommender.networkAnalyzerGkeConnectivityInsights.list`   | List network connectivity insights for GKE clusters                                |
| `recommender.networkAnalyzerGkeConnectivityInsights.update` | Update network connectivity insights for GKE clusters                              |
| `recommender.networkAnalyzerGkeIpAddressInsights.get`       | Get IP address usage insights for GKE clusters                                     |
| `recommender.networkAnalyzerGkeIpAddressInsights.list`      | List IP address usage insights for GKE clusters                                    |
| `recommender.networkAnalyzerGkeIpAddressInsights.update`    | Update IP address usage insights for GKE clusters                                  |
| `resourcemanager.projects.get`                              | Get details of a specified Google Cloud project                                    |
| `serviceusage.services.get`                                 | Get details of a Google Cloud service                                              |
| `serviceusage.services.list`                                | List all enabled Google Cloud services                                             |
| `storage.objects.create`                                    | Create new objects in Cloud Storage                                                |
| `storage.objects.delete`                                    | Delete objects from Cloud Storage                                                  |
| `storage.objects.get`                                       | Get details of a specified object in Cloud Storage                                 |
| `storage.objects.list`                                      | List all objects in a specified Cloud Storage bucket                               |
