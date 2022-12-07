---
title: "App Profiles"
metaTitle: "Palette Dev Engine for Enterprise Developers"
metaDescription: "Explore Palette Dev Engine as Free Developers"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# App Profiles

App Profiles are templates created with preconfigured services required for Palette Virtual Cluster deployment. App Profiles provide a way to drive consistency across virtual clusters. 

You create App Profiles to meet specific types of workloads on your Palette Virtual Clusters. For example, you may want to create a development App Profile with Helm Charts, Manifests, and different database applications. You can create as many App Profiles as you need.

Several Services are available to build App Profiles.

## Services

These basic Services are available:

- **Container Deployment**: [Containers](https://www.docker.com/resources/what-container/) are methods of building, packaging, and deploying an application. A container includes the code, run-time, libraries, and all the dependencies required by a containerized workload. Containers are deployed to their target environment. For steps on how to deploy a container in Palette, refer to [Container Deployment](/devx/app-profile/container-deployment).

- **Helm**: Palette provides out-of-box Helm registries and allows you to add additional registries. For more information, visit [Palette Helm Registry](/devx/registries/helm-registry#palettehelmregistry).

- **Manifest**: You can construct App Profile layers using raw manifests to provision Kubernetes resources that are unavailable in Palette or Helm Charts. Pack Manifests provide a pass-through mechanism to orchestrate Kubernetes resources in a cluster. For example, specific integrations may require creation of Secrets or Custom Resource Definitions (CRDs). To achieve this, you can attach a Manifest file to the layer.

<InfoBox>
We encourage you to securely distribute credentials using secrets. You can achieve this by constructing manifests to consume parameters that use references. You can also add a manifest to create your Kubernetes secrets using macros to inject the values. In the App layer, set the environment variables using a Secret reference.

**Example**

```
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
  namespace: {{.spectro.system.apptier.NAMESPACE}}
data:
  
  namespace: "{{.spectro.system.apptier.NAMESPACE}}" # Resolves to a value of the variable defined in App Profile tier parameters.yaml file.

  password: "{{.spectro.app.$appDepName-mongodb.PASSWORD}}" # To refer the tier output variables of the top tiers.
	
```
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myweb
  namespace: mywebnamespace
  ...
spec:
  template:
  ...
      containers:
        - env:
            - name: PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysecret
                  key: password
```

</InfoBox>

<br />

<WarningBox>
    When adding services to App Profiles using manifest files, specify a namespace name to which the resource belongs.
</WarningBox> 

## Messaging System Services

These Messaging System services are available for client-server data exchange and monitoring:

- **NATS**
- **Kafka**

## Security Service

**Vault** is available as a Security service to store encrypted data and sensitive configuration details such as password encryption keys and API keys.

## Object Storage Services

These Object Storage services are available:

- **MinIO Operator**
- **Amazon S3**

## Database Services

These Database Services are available: 

- **MongoDB**
- **MySQL** 
- **PostgreSQl** 
- **Redis**


<InfoBox>
  Database services have output variables that follow a usage hierarchy. Variable values from the first services you add, which become the first layer in the App Profile stack, can be passed to services you add next, which appear higher in the stack. However, variable values cannot be passed from the top service layers down.

  To view the available output variables from lower layers in the stack, type ```{{.spectro.}}``` in a text editor.
</InfoBox>

<br />

# Resources
- [Create an App Profile](/devx/app-profile/create-app-profile)
- [Container Deployment](/devx/app-profile/container-deployment)
- [App Profile Macros](/devx/app-profile/app-profile-macros)
- [App Profile Cloning](/devx/app-profile/app-profile-cloning)
- [App Profile Versioning](/devx/app-profile/versioning-app-profile)

