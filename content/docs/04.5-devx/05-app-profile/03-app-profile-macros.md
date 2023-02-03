---
title: "Output Variables"
metaTitle: "Palette Dev Engine Output Variables"
metaDescription: "Explore Palette Dev Engine App Profile Macros"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Output Variables

Palette Dev Engine output variables are defined in the App Profile and are only resolved at cluster deployment time. The output variables have the following properties:

* May be referenced by specifying them during app profile creation.

* Output variables are inherited from the lower tiers of the app profile.

* Each service type exposes a set of unique output variables. 



The variables are generated when the server layer is deployed. Output variables can be consumed by the higher layers in the app profile. 

Check out the [Services Connectivity](/devx/app-profile/services/connectivity) page to learn how to use output variables for establishing network connectivity between services.


<br /> 


```
{{.spectro.app.$appdeploymentName.<tiername>.<tierOutput_Variable_Name>}}
```

# System Output Variables

The following output variables are globally available for all services.

| Output Variable | Description |
| --- | --- |
| `spectro.system.user.name` | The user name of the logged in user. |
| `spectro.system.user.uid` | The id of the logged in user.|
| `spectro.system.user.email` | The email address of the logged in user. |
| `spectro.system.tenant.uid `| The id of the current tenant or organization. |
| `spectro.system.project.uid` | The id of the current project. |
| `spectro.system.project.name` | The name of the current project. |
| `spectro.system.cluster.uid` |  The id of the current cluster. |
| `spectro.system.cluster.name` | The name of the current cluster. |
| `spectro.system.kubernetes.version` | The current version of Kubernetes. |
| `spectro.system.reverseproxy.server` | The hostname of the Spectro Cloud reverse proxy server. This value is empty when not enabled. |
| `spectro.system.reverseproxy.port` | The port of the Spectro Cloud reverse proxy server. This value is empty when not enabled. |
| `spectro.system.reverseproxy.vhostport` | The port of the virtual host that is hosting the reverse proxy. |
| `spectro.system.reverseproxy.protocol` | The protocol used for the Spectro Cloud reverse proxy. |
| `spectro.system.cloud.type` | The type of cloud environment where the cluster is deployed, such as EKS, AKS, and GKE. |
| `spectro.system.cloud.region` |  The cloud provider region where the cluster is deployed.|
| `spectro.system.apptier.name` | The name of the service layer from the context of the app profile. |
| `spectro.system.apptier.uid` | The id of the service layer. |
| `spectro.system.appprofile.name` | The name of the app profile. |
| `spectro.system.appprofile.uid` |  The  id of the app profile. |
| `spectro.system.appdeployment.uid` | The id of the app deployment.  |
| `spectro.system.appdeployment.name` | The name of the app deployment. |
| `spectro.system.appdeployment.tiername` | The name of the service layer from the context of the app deployment. |
| `spectro.system.appdeployment.ingress.host` | The ingress host pattern for a cluster group with ingress enabled. This value is dynamically generated. |

# Container Service Output Variables

The container service type exposes the following output variables. Replace **[service-name]** with the respective name of the service layer.

| Output Variable | Description |
| --- | --- |
| `.spectro.app.$appDeploymentName.[service-name].CONTAINER_NAMESPACE` | The Kubernetes namespace of the deployed container.  |
|`.spectro.app.$appDeploymentName.[service-name].CONTAINER_SVC`  | The Kubernetes DNS hostname of the service. |
|`.spectro.app.$appDeploymentName.[service-name].CONTAINER_SVC_PORT`  | The exposed port of the service. |
| `spectro.app.$appDeploymentName.[service-name].CONTAINER_SVC_EXTERNALHOSTNAME`| The Kubernetes DNS hostname of the load balancer. This value is available if the service's access level is set to **Public**. |
|`spectro.app.$appDeploymentName.[service-name].CONTAINER_SVC_EXTERNALIP`| The public URL of the load balancer. This value is available if the service's access is set to **Public**.|

# Database Service Output Variables

Each database service exposes a set of output variables. Review each database service for more details. You can find information about each database service by checking out the [Available Services](/devx/app-profile/services/service-listings) resource.

# Resources

* [Palette System Macros](/registries-and-packs/pack-constraints#packmacros)

* [Palette User Macros](/clusters/cluster-management/macros#overview)
<br />
