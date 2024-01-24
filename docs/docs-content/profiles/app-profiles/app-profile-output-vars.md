---
sidebar_label: "Output Variables"
title: "Output Variables"
description: "Explore Palette Dev Engine App Profile Macros"
hide_table_of_contents: false
sidebar_position: 60
tags: ["devx", "app mode", "pde", "app profiles"]
---

Palette Dev Engine output variables are defined in the [app profile](../../glossary-all.md#app-profile) and are only
resolved at cluster deployment time. The output variables have the following properties:

- May be referenced by specifying them during app profile creation.

- Output variables are inherited from the lower layers of the app profile.

- Each service type exposes a set of unique output variables.

The variables are generated when the server layer is deployed. Output variables can be consumed by the higher layers in
the app profile.

Check out the [Services Connectivity](../../devx/services/connectivity.md) page to learn how to use output variables for
establishing network connectivity between services.

```hideClipboard
{{.spectro.app.$appdeploymentName.<layerName>.<layerOutput_Variable_Name>}}
```

## System Output Variables

The following output variables are globally available for all services.

| **Output Variable**                         | **Description**                                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `spectro.system.user.name`                  | User name of the logged in user.                                                                    |
| `spectro.system.user.uid`                   | ID of the logged in user.                                                                           |
| `spectro.system.user.email`                 | Email address of the logged in user.                                                                |
| `spectro.system.tenant.uid `                | ID of the current tenant or organization.                                                           |
| `spectro.system.project.uid`                | ID of the current project.                                                                          |
| `spectro.system.project.name`               | Name of the current project.                                                                        |
| `spectro.system.cluster.uid`                | ID of the current cluster.                                                                          |
| `spectro.system.cluster.name`               | Name of the current cluster.                                                                        |
| `spectro.system.kubernetes.version`         | Current version of Kubernetes.                                                                      |
| `spectro.system.reverseproxy.server`        | Hostname of Spectro Proxy reverse proxy server. This value is empty when not enabled.               |
| `spectro.system.reverseproxy.port`          | Port of the Spectro Proxy reverse proxy server. This value is empty when not enabled.               |
| `spectro.system.reverseproxy.vhostport`     | Port of the virtual host that is hosting the reverse proxy.                                         |
| `spectro.system.reverseproxy.protocol`      | Protocol used for the Spectro Proxy reverse proxy.                                                  |
| `spectro.system.cloud.type`                 | Type of cloud environment where the cluster is deployed such as EKS, AKS, and GKE.                  |
| `spectro.system.cloud.region`               | Cloud provider region where the cluster is deployed.                                                |
| `spectro.system.apptier.name`               | Name of the service layer from the context of the app profile.                                      |
| `spectro.system.apptier.uid`                | ID of the service layer.                                                                            |
| `spectro.system.appprofile.name`            | Name of the app profile.                                                                            |
| `spectro.system.appprofile.uid`             | ID of the app profile.                                                                              |
| `spectro.system.appdeployment.uid`          | ID of the app deployment.                                                                           |
| `spectro.system.appdeployment.name`         | Name of the app deployment.                                                                         |
| `spectro.system.appdeployment.tiername`     | Name of the service layer from the context of the app deployment.                                   |
| `spectro.system.appdeployment.ingress.host` | Ingress host pattern for a cluster group with ingress enabled. This value is dynamically generated. |

## Container Service Output Variables

The container service type exposes the following output variables. Replace **[service-name]** with the respective name
of the service layer.

| **Output Variable**                                                            | **Description**                                                                                                                                             |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.spectro.app.$appDeploymentName.[service-name].CONTAINER_NAMESPACE`           | Kubernetes namespace of the deployed container.                                                                                                             |
| `.spectro.app.$appDeploymentName.[service-name].CONTAINER_SVC`                 | Kubernetes DNS hostname of the service.                                                                                                                     |
| `.spectro.app.$appDeploymentName.[service-name].CONTAINER_SVC_PORT`            | Exposed port of the service.                                                                                                                                |
| `spectro.app.$appDeploymentName.[service-name].CONTAINER_SVC_EXTERNALHOSTNAME` | Kubernetes DNS hostname of the load balancer. This value is available if the service's to **Public** and deployed to a public cloud provider environment.   |
| `spectro.app.$appDeploymentName.[service-name].CONTAINER_SVC_EXTERNALIP`       | Public URL of the load balancer. This value is available if the service's access is set to **Public** and deployed to a private cloud provider environment. |

## Database Service Output Variables

Each database service exposes a set of output variables. To learn about each database service, check out
[Available Services](../../devx/services/service-listings/service-listings.mdx).

## Resources

- [Palette System Macros](../../registries-and-packs/pack-constraints.md#pack-macros)

- [Palette User Macros](../../clusters/cluster-management/macros.md)
  <br />
