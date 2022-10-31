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

App Profiles are templates created with preconfigured services required for sandbox cluster deployment. App Profiles provide a way to drive consistency across sandbox clusters. You can create as many profiles as required. An App Profile can be created to meet specific types of Workload on Palette Sandbox Clusters. For example, you may create a Development App Profile with Helm Charts, Manifest, different database applications, etc. 

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

3. **Add Service**: Select a service to start the configuration of the App Profile from the available services and configure the service per the use case.


4. **Review** the configuration and finish the deployment.
The Palette Dev Engine App Profile is created successfully and can be used for `Apps` deployment. To edit or delete the App Profile, access the App Profile `Settings` option. 

<InfoBox>

The applications follows a hierarchy, where in the output parameter values from the application added first can be passed to application tiers added after that. The reverse is not possible.

To view the available output parameters from the below tiers in the code editor, type in ```{{.spectro.}}```.
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

Pack macros are the variables defined in the App Profile, and these variables are resolved only at the cluster deployment time.
<br />

```
{{.spectro.system.[VARIABLE_NAME]}}
```
**Supported Variables**
* appprofile.name
* appprofile.uid
* appdeployment.name
* appdeployment.uid
* appdeployment.tiername : Resolves to a string value in the format `<deployment name>-<tier name>`


<br />
<br />
