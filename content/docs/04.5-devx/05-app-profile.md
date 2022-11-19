---
title: "App Profile"
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



## App Profiles

App Profiles are templates created with preconfigured services required for sandbox cluster deployment. App Profiles provide a way to drive consistency across sandbox clusters. You can create as many profiles as required. An App Profile can be created to meet specific types of Workload on Palette Virtual Clusters. For example, you may create a Development App Profile with Helm Charts, Manifest, different database applications, etc.

<br />

	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
### Create Your App Profile

<br />

To create your App Profile,
<br />

1. Log in to Palette Dev Engine console


2. Select the `App Profiles` from the left ribbon menu, click `+ New App Profile,` and provide the following information to the app creation wizard.

**Basic Information: **

|         Parameter           | Description  |
|-------------------------------|-----------------|
|Application Profile Name | A custom name for the App Profile|
|Description (optional)   | Description of the App Profile, if any | 
|Tag (optional)               | Tags on a cluster group are propagated to the cloud/datacenter environments.|

3. **Add Service**: Select a service to start configuring the App Profile from the available services and configure the service based on your requirements. The following services are provided:

  * Container Deployment: Containers are methods of building, packaging, and deploying an application. A container includes the code, runtime, libraries, and all the dependencies required by a containerized workload. Container deployment deploys containers to their target environment.
 

 * [Helm](/devx/registries#palettehelmregistry): Palette App profile Pack from Helm registry charts. The public Palette Pack registry and a few popular Helm chart repositories are already available out of the box. Add additional pack registries or public or private chart registries to Palette.
 

 * Manifest: Layers can be constructed using raw manifests to provision Kubernetes resources that are unavailable in Palette or Charts. Pack Manifests provide a pass-through mechanism in which additional Kubernetes resources can be orchestrated onto a cluster and the rest of the stack. Specific integrations may require the creation of Secrets or CustomResourceDefinition (CRDs). Manifest files can be attached to the layer to achieve this. 
  

 *  Database Services: Different database applications such as MongoDB, PostgreSQl, Redis, etc.

<WarningBox>
When adding layers to the App profile using manifest files, specify a namespace name to which the resource must belong.
</WarningBox>


4. **Review** the configuration and finish the deployment.
The Palette Dev Engine App Profile is created successfully and can be used for `Apps` deployment. To edit or delete the App Profile, access the App Profile `Settings` option. 

<InfoBox>

The applications follows a hierarchy, where in the output variables values from the application added first can be passed to application tiers added after that. The reverse is not possible.

To view the available output variables from the below tiers in the code editor, type in ```{{.spectro.}}```.
</InfoBox>

<WarningBox>

Palette encourages the developers to [securely distribute their credential using secrets](https://kubernetes.io/docs/tasks/inject-data-application/distribute-credentials-secure/). We can achieve security by constructing their manifests to consume the parameter by references. They can also add a manifest to create their Kubernetes secrets, using macros to inject the values. In the App tier, set the environment variables using a secret reference. 

**Example Scenario**

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



</WarningBox>

# App Profile Macros

Pack macros are the variables defined in the App Profile and are only resolved at the cluster deployment time. The app profile variables can be:

* directly given by the developers while modelling the application profiles.

* resolved during the app instatiation.

* inherited from the lower tiers of the App Profile.

The variables are of two types:

* [The Input Variables](/devx/app-profile#inputparameters)

* [The Output Variables](/devx/app-profile#outputparameters)
<br />

## Input Variables

User-provided values that will be consumed by the current tier. It can even use output variables from below tier. This parameter resolves to a value of the variable defined in App Profile tier parameters.yaml file.

```
{{.spectro.system.[VARIABLE_NAME]}}
```
|**Supported Variables**|  Description|
|-----------------------|-------------|
|appprofile.name|Name of the app profile|
|appprofile.uid|Unique id of the app profile|
|appdeployment.name|Name of the deployment|
|appdeployment.uid|Unique id of the deployment|
|appdeployment.tiername| Resolves to a string value in the format `<deployment name>-<tier name>`|

<br />

The parameter which will be generated once the tier gets deployed. It can be consumed by the above tiers. It refers to the tier output variables of the top tiers. Refer the format and example below:

<br />

```
{{.spectro.system.apptier.<tierInput_Variable_Name>}}
```

**Example**
{{.spectro.system.apptier.NAMESPACE}}: 


## Output Variables

The variables are generated once the tier gets deployed. Output variables can be consumed by the higher tiers in the App Profile.


<br /> 


```
{{.spectro.app.$appdeploymentName.<tiername>.<tierOutput_Variable_Name>}} 
```

**Example**
{{.spectro.app.$appDepName-mongodb.PASSWORD}}: 

<br />

### Important Links to Refer Palette Macros

* [Palette System Macros](/registries-and-packs/pack-constraints#packmacros)

* [Palette User Macros](/clusters/cluster-management/macros#overview)
<br />
<br />
